export type Shift = {
  id: string;
  title: string; // "Registered nurse · Emergency care"
  facility: string;
  location: string;
  date: string; // "Sat, 25 Oct"
  time: string; // "08:00–20:00 WAT"
  shiftType: string;
  total: number; // naira per person for the whole shift
  hours: number;
  rate: number; // total / hours
  tag: "URGENT" | null;
  description: string;
  duties: string[];
  requirements: string;
  arrival: string;
  experience: string;
  status: string;
  needed: number;
  filled: number;
  sortKey: string; // "2026-10-25 08:00"
  createdAt: string;
};  