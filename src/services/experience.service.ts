// Kept on the phone for now (starts empty). The real endpoint is PUT /api/worker/v1/update-worker-profile,
// which is multipart and currently has a backend bug that never responds.

export type MonthYear = { month: number; year: number };

export type Experience = {
  id: string;
  title: string;
  workplace: string;
  location: string;
  start: MonthYear;
  end: MonthYear | null; // null = currently works here
  responsibilities: string;
};

export const MAX_EXPERIENCES = 3;

export const SOFT_SKILLS = [
  "Communication",
  "Teamwork",
  "Empathy",
  "Problem solving",
  "Time management",
  "Adaptability",
  "Attention to detail",
  "Conflict resolution",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let experiences: Experience[] = [];

let selectedSkills: string[] = [];

const key = (m: MonthYear) => m.year * 12 + m.month;

// Newest first, as the screen promises.
export function getExperiences(): Experience[] {
  return [...experiences].sort((a, b) => key(b.start) - key(a.start));
}

export function getExperience(id: string): Experience | undefined {
  return experiences.find((e) => e.id === id);
}

export async function saveExperience(input: Omit<Experience, "id">, id?: string): Promise<void> {
  if (id) {
    experiences = experiences.map((e) => (e.id === id ? { ...input, id } : e));
  } else {
    if (experiences.length >= MAX_EXPERIENCES) throw new Error("You can keep up to 3 experiences. Remove one to add another.");
    experiences = [...experiences, { ...input, id: `e${Date.now()}` }];
  }
}

export async function removeExperience(id: string): Promise<void> {
  experiences = experiences.filter((e) => e.id !== id);
}

export function getSoftSkills(): string[] {
  return selectedSkills;
}

export async function saveSoftSkills(skills: string[]): Promise<void> {
  selectedSkills = skills;
}

export function formatMonthYear(m: MonthYear): string {
  return `${MONTHS[m.month - 1]} ${m.year}`;
}

export function formatRange(e: Experience): string {
  return `${formatMonthYear(e.start)} – ${e.end ? formatMonthYear(e.end) : "Present"}`;
}

// "01 / 2020" <-> { month: 1, year: 2020 }
export function toInputText(m: MonthYear | null): string {
  return m ? `${String(m.month).padStart(2, "0")} / ${m.year}` : "";
}

// Keeps only digits and lays them out as "MM / YYYY" while the person types.
export function maskMonthYear(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 6);
  return d.length <= 2 ? d : `${d.slice(0, 2)} / ${d.slice(2)}`;
}

export function parseMonthYear(text: string): MonthYear | null {
  const m = /^(\d{2}) \/ (\d{4})$/.exec(text.trim());
  if (!m) return null;
  const month = Number(m[1]);
  const year = Number(m[2]);
  const thisYear = new Date().getFullYear();
  if (month < 1 || month > 12 || year < 1960 || year > thisYear) return null;
  return { month, year };
}