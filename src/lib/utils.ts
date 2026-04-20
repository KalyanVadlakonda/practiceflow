import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const AGE_GROUP_LABELS: Record<string, string> = {
  "6u": "6U",
  "8u": "8U",
  "10u": "10U",
  "12u": "12U",
  "14u": "14U",
  "16u": "16U",
  "18u": "18U",
  adult: "Adult",
};

export const SKILL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  elite: "Elite",
};

export const CATEGORY_LABELS: Record<string, string> = {
  hitting: "Hitting",
  pitching: "Pitching",
  fielding: "Fielding",
  catching: "Catching",
  baserunning: "Baserunning",
  conditioning: "Conditioning",
  defense: "Defense",
  offense: "Offense",
  fundamentals: "Fundamentals",
  mental: "Mental",
  warmup: "Warmup",
  cooldown: "Cooldown",
};

export const INTENSITY_COLORS: Record<string, string> = {
  low: "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400",
  medium: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400",
  high: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400",
};

export const SKILL_COLORS: Record<string, string> = {
  beginner: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
  intermediate: "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400",
  advanced: "text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400",
  elite: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400",
};

export const CATEGORY_COLORS: Record<string, string> = {
  hitting: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  pitching: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  fielding: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  catching: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  baserunning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  conditioning: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  defense: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  offense: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  fundamentals: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  mental: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  warmup: "bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300",
  cooldown: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
};
