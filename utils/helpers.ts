// Format time in seconds to HH:MM:SS or MM:SS format
export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  if (hours > 0) {
      return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Format pace in seconds per mile to MM:SS format
export const formatPace = (secondsPerMile: number): string => {
  if (!isFinite(secondsPerMile) || secondsPerMile <= 0) {
    return '--:--';
  }
  return formatTime(secondsPerMile);
};

// Convert meters to miles
export const metersToMiles = (meters: number): number => {
  return meters / 1609.34;
};

// Convert meters to feet for elevation
export const formatElevation = (meters: number): string => {
    const feet = meters * 3.28084;
    return `${Math.round(feet)} ft`;
}

// Calculate distance between two GPS coordinates using Haversine formula
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};