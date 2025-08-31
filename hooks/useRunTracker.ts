import { useState, useEffect, useRef, useCallback } from 'react';
import { Split, LocationPoint, Run } from '../types';
import { calculateDistance, metersToMiles } from '../utils/helpers';

const INSTANT_PACE_SECONDS = 5; // Calculate instant pace over the last 5 seconds

export const useRunTracker = (onRunComplete: (runData: Run) => void) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gpsReady, setGpsReady] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0); // in meters
  const [elevationGain, setElevationGain] = useState(0); // in meters
  const [splits, setSplits] = useState<Split[]>([]);
  
  const [instantPace, setInstantPace] = useState(0); // seconds per mile
  const [currentMilePace, setCurrentMilePace] = useState(0); // seconds per mile
  const [path, setPath] = useState<{lat: number, lng: number}[]>([]);
  const [altitudes, setAltitudes] = useState<(number|null)[]>([]);

  const timerRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  
  const locationHistoryRef = useRef<LocationPoint[]>([]);
  const mileMarkerDataRef = useRef<{ time: number; distance: number }>({ time: 0, distance: 0 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setGpsReady(true),
        () => {
          alert('GPS not available. Tracking may be inaccurate.');
          setGpsReady(true);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
        alert('Geolocation is not supported by your browser.');
        setGpsReady(true);
    }
  }, []);

  const updatePaces = useCallback(() => {
    const now = performance.now();
    
    // Instant Pace (based on time, more reliable than point count)
    const recentPoints = locationHistoryRef.current.filter(p => (now - p.timestamp) / 1000 <= INSTANT_PACE_SECONDS);
    if (recentPoints.length >= 2) {
      const timeDelta = (recentPoints[recentPoints.length - 1].timestamp - recentPoints[0].timestamp) / 1000;
      const distDelta = calculateDistance(recentPoints[0].latitude, recentPoints[0].longitude, recentPoints[recentPoints.length - 1].latitude, recentPoints[recentPoints.length - 1].longitude);
      const distMiles = metersToMiles(distDelta);
      if (timeDelta > 0 && distMiles > 0) {
        setInstantPace(timeDelta / distMiles);
      }
    }

    // Current Mile Pace
    const currentMileElapsedTime = elapsedTime - mileMarkerDataRef.current.time;
    const currentMileElapsedDistMiles = metersToMiles(distance - mileMarkerDataRef.current.distance);
    if (currentMileElapsedTime > 0 && currentMileElapsedDistMiles > 0) {
      setCurrentMilePace(currentMileElapsedTime / currentMileElapsedDistMiles);
    }
    
    // Check for new mile split
    const completedMiles = Math.floor(metersToMiles(distance));
    if (completedMiles > splits.length) {
      const lastSplitData = mileMarkerDataRef.current;
      const splitTime = elapsedTime - lastSplitData.time;
      const splitDistanceMiles = metersToMiles(distance - lastSplitData.distance);
      
      const milePace = splitDistanceMiles > 0 ? splitTime / splitDistanceMiles : 0;

      setSplits(prev => [...prev, {
        mile: completedMiles,
        time: splitTime,
        pace: milePace,
      }]);
      mileMarkerDataRef.current = { time: elapsedTime, distance };
    }
  }, [distance, elapsedTime, splits.length]);


  const handlePositionUpdate = (position: GeolocationPosition) => {
    if (isPaused) return;

    const { latitude, longitude, altitude } = position.coords;
    const newPoint: LocationPoint = { latitude, longitude, timestamp: performance.now(), altitude };
    
    setPath(prev => [...prev, { lat: latitude, lng: longitude }]);
    setAltitudes(prev => [...prev, altitude]);
    
    const lastPoint = locationHistoryRef.current[locationHistoryRef.current.length - 1];
    if (lastPoint) {
      const newDistance = calculateDistance(
        lastPoint.latitude, lastPoint.longitude,
        latitude, longitude
      );
      setDistance(prev => prev + newDistance);
      
      // Calculate elevation gain
      if (altitude !== null && lastPoint.altitude !== null && altitude > lastPoint.altitude) {
        setElevationGain(prev => prev + (altitude - lastPoint.altitude!));
      }
    }
    
    locationHistoryRef.current.push(newPoint);
  };

  const startTimer = useCallback(() => {
    const startTime = Date.now() - elapsedTime * 1000;
    timerRef.current = window.setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  }, [elapsedTime]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startGps = () => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        (error) => console.error("GPS Error:", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
  };

  const stopGps = useCallback(() => {
    if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) updatePaces();
  }, [elapsedTime, isRunning, isPaused, updatePaces]);


  const startRun = () => {
    if (!isRunning) resetRun();
    setIsRunning(true);
    setIsPaused(false);
    startTimer();
    startGps();
  };

  const pauseRun = () => {
    setIsPaused(true);
    stopTimer();
  };
  
  const resumeRun = () => {
    setIsPaused(false);
    startTimer();
  };

  const stopRun = () => {
    if (!isRunning) return;
    
    setIsRunning(false);
    setIsPaused(true);
    stopTimer();
    stopGps();

    if (distance > 10) { // Only complete run if there's meaningful distance
        const finalRun: Run = {
            id: `run_${Date.now()}`,
            date: Date.now(),
            distance,
            duration: elapsedTime,
            splits,
            path,
            altitudes,
            elevationGain,
        };
        onRunComplete(finalRun);
    }
  };
  
  const resetRun = () => {
    setIsRunning(false);
    setIsPaused(false);
    stopTimer();
    stopGps();
    setElapsedTime(0);
    setDistance(0);
    setSplits([]);
    setInstantPace(0);
    setCurrentMilePace(0);
    setElevationGain(0);
    setPath([]);
    setAltitudes([]);
    locationHistoryRef.current = [];
    mileMarkerDataRef.current = { time: 0, distance: 0 };
  };

  return { isRunning, isPaused, gpsReady, elapsedTime, distance, splits, instantPace, avgPace: (elapsedTime / metersToMiles(distance)), elevationGain, path, startRun, pauseRun, resumeRun, stopRun, resetRun };
};