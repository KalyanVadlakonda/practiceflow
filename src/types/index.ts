// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Sport = "baseball" | "softball";
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "elite";
export type AgeGroup =
  | "6u"
  | "8u"
  | "10u"
  | "12u"
  | "14u"
  | "16u"
  | "18u"
  | "adult";
export type CompetitiveLevel =
  | "recreational"
  | "travel"
  | "school"
  | "college"
  | "professional";
export type DrillCategory =
  | "hitting"
  | "pitching"
  | "fielding"
  | "catching"
  | "baserunning"
  | "conditioning"
  | "defense"
  | "offense"
  | "fundamentals"
  | "mental"
  | "warmup"
  | "cooldown";
export type Intensity = "low" | "medium" | "high";
export type Position =
  | "P"
  | "C"
  | "1B"
  | "2B"
  | "3B"
  | "SS"
  | "LF"
  | "CF"
  | "RF"
  | "DH"
  | "UTIL";
export type ThrowingSide = "right" | "left" | "switch";
export type BattingSide = "right" | "left" | "switch";

// ─── Player / Coach ───────────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  number?: number;
  positions: Position[];
  throwingSide: ThrowingSide;
  battingSide: BattingSide;
  ageGroup?: AgeGroup;
  skillLevel?: SkillLevel;
  developmentNotes?: string;
  tags?: string[];
  attending?: boolean;
}

export interface Coach {
  id: string;
  name: string;
  role: "head" | "assistant" | "volunteer";
  specialty?: DrillCategory[];
}

// ─── Team ─────────────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  sport: Sport;
  ageGroup: AgeGroup;
  skillLevel: SkillLevel;
  competitiveLevel: CompetitiveLevel;
  players: Player[];
  coaches: Coach[];
  createdAt: string;
  updatedAt: string;
}

// ─── Drill ────────────────────────────────────────────────────────────────────

export interface DiagramElement {
  id: string;
  type: "player" | "coach" | "ball" | "cone" | "base" | "arrow" | "text";
  x: number;
  y: number;
  label?: string;
  color?: string;
  rotation?: number;
}

export interface DiagramPath {
  id: string;
  points: { x: number; y: number }[];
  color?: string;
  dashed?: boolean;
  animated?: boolean;
}

export interface DiagramFrame {
  id: string;
  label: string;
  elements: DiagramElement[];
  paths: DiagramPath[];
  duration?: number; // ms per frame in animation
}

export interface DrillDiagram {
  id: string;
  fieldType: "baseball" | "softball" | "infield" | "outfield" | "batting";
  frames: DiagramFrame[];
  width: number;
  height: number;
}

export interface Drill {
  id: string;
  name: string;
  description: string;
  sport: Sport | "both";
  category: DrillCategory;
  ageBands: AgeGroup[];
  skillLevels: SkillLevel[];
  playersMin: number;
  playersMax: number;
  coachesMin: number;
  coachesMax: number;
  durationMin: number; // minutes
  durationMax: number;
  equipment: string[];
  setupInstructions: string;
  stepByStep: string[];
  teachingPoints: string[];
  commonErrors: string[];
  tags: string[];
  diagram?: DrillDiagram;
  videoUrl?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  intensity: Intensity;
  indoorFriendly: boolean;
  focusAreas: DrillCategory[];
}

// ─── Practice Plan ────────────────────────────────────────────────────────────

export interface Assignment {
  playerId?: string;
  coachId?: string;
  role: string;
  group?: number;
  stationIndex?: number;
}

export interface PracticeBlock {
  id: string;
  drillId: string;
  drill?: Drill;
  name: string;
  durationMinutes: number;
  startMinute: number;
  endMinute: number;
  groupCount: number;
  assignments: Assignment[];
  coachAssignments: { coachId: string; role: string }[];
  notes?: string;
  equipment?: string[];
  isLocked?: boolean;
  aiNote?: string;
  order: number;
}

export interface PracticePlan {
  id: string;
  title: string;
  teamId?: string;
  team?: Partial<Team>;
  sport: Sport;
  ageGroup: AgeGroup;
  skillLevel: SkillLevel;
  totalMinutes: number;
  goals: string[];
  blocks: PracticeBlock[];
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
  templateName?: string;
  aiRationale?: string;
  warnings?: string[];
  status: "draft" | "saved" | "active" | "completed";
  generatorInput?: GeneratorInput;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export interface GeneratorInput {
  sport: Sport;
  ageGroup: AgeGroup;
  skillLevel: SkillLevel;
  competitiveLevel: CompetitiveLevel;
  environment: "indoor" | "outdoor";
  rosterSize: number;
  coachCount: number;
  durationMinutes: number;
  primaryGoals: DrillCategory[];
  secondaryGoals: DrillCategory[];
  equipment: string[];
  constraints?: string;
  notes?: string;
  practiceStyle: "high-energy" | "balanced" | "technical";
  stationPreference: "many-stations" | "few-stations";
  blockDuration: "short" | "mixed" | "long";
  includeWarmup: boolean;
  includeCooldown: boolean;
  includeMentalCoaching: boolean;
  emphasisMode: "repetition" | "instruction";
  teamId?: string;
}

// ─── Template ─────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  description: string;
  sport: Sport | "both";
  ageGroup: AgeGroup;
  skillLevel: SkillLevel;
  durationMinutes: number;
  focusAreas: DrillCategory[];
  environment: "indoor" | "outdoor" | "both";
  tags: string[];
  previewBlocks: string[];
  planSnapshot?: Partial<PracticePlan>;
  usageCount?: number;
}

// ─── Session Run State ────────────────────────────────────────────────────────

export interface SessionRunState {
  planId: string;
  currentBlockIndex: number;
  blockStartTime: number | null;
  elapsed: number;
  isRunning: boolean;
  isPaused: boolean;
  completedBlockIds: string[];
  extraTimeSeconds: number;
  startedAt: string | null;
}

// ─── AI / Recommendation ─────────────────────────────────────────────────────

export interface Recommendation {
  id: string;
  type:
    | "swap-drill"
    | "adjust-duration"
    | "add-drill"
    | "remove-drill"
    | "sequence"
    | "coaching-point";
  title: string;
  description: string;
  rationale: string;
  drillId?: string;
  blockId?: string;
  confidence: number; // 0-1
}

export interface AIAnalysis {
  planId: string;
  rationale: string;
  recommendations: Recommendation[];
  warnings: string[];
  estimatedEffectiveness: number; // 0-100
  generatedAt: string;
}

// ─── App State Helpers ────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}
