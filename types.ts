export interface Split {
  mile: number;
  time: number; // in seconds
  pace: number; // in seconds per mile
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  altitude: number | null;
}

export interface Run {
  id: string;
  date: number; // Unix timestamp
  distance: number; // meters
  duration: number; // seconds
  splits: Split[];
  path: { lat: number; lng: number }[];
  altitudes: (number | null)[];
  elevationGain: number; // meters
}