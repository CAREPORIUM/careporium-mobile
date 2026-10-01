export type Shift = {
  id: string;
  title: string;
  facility: string;
  verifiedFacility: boolean;
  tag?: "URGENT" | "NEW" | null;
  matchPercent?: number;
  date: string;
  time: string;
  location: string;
  distanceKm: number;
  rate: number;
  total: number;
  description: string;
  duties: string[];
  closesAt: string;
};