import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PracticePlan,
  Team,
  GeneratorInput,
  SessionRunState,
  AppNotification,
} from "@/types";
import { SAMPLE_PRACTICES } from "@/data/practices";
import { TEAMS } from "@/data/teams";
import { generateId } from "@/lib/utils";

// ─── Practice Store ────────────────────────────────────────────────────────────

interface PracticeState {
  practices: PracticePlan[];
  activePracticeId: string | null;
  addPractice: (plan: PracticePlan) => void;
  updatePractice: (id: string, updates: Partial<PracticePlan>) => void;
  deletePractice: (id: string) => void;
  setActivePractice: (id: string | null) => void;
  getPracticeById: (id: string) => PracticePlan | undefined;
}

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      practices: SAMPLE_PRACTICES,
      activePracticeId: null,

      addPractice: (plan) =>
        set((state) => ({ practices: [plan, ...state.practices] })),

      updatePractice: (id, updates) =>
        set((state) => ({
          practices: state.practices.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),

      deletePractice: (id) =>
        set((state) => ({
          practices: state.practices.filter((p) => p.id !== id),
        })),

      setActivePractice: (id) => set({ activePracticeId: id }),

      getPracticeById: (id) => get().practices.find((p) => p.id === id),
    }),
    {
      name: "practiceflow-practices",
    }
  )
);

// ─── Team Store ────────────────────────────────────────────────────────────────

interface TeamState {
  teams: Team[];
  activeTeamId: string | null;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  setActiveTeam: (id: string | null) => void;
  getTeamById: (id: string) => Team | undefined;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      teams: TEAMS,
      activeTeamId: "team-1",

      addTeam: (team) =>
        set((state) => ({ teams: [...state.teams, team] })),

      updateTeam: (id, updates) =>
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),

      deleteTeam: (id) =>
        set((state) => ({ teams: state.teams.filter((t) => t.id !== id) })),

      setActiveTeam: (id) => set({ activeTeamId: id }),

      getTeamById: (id) => get().teams.find((t) => t.id === id),
    }),
    {
      name: "practiceflow-teams",
    }
  )
);

// ─── Generator Store ───────────────────────────────────────────────────────────

interface GeneratorState {
  input: Partial<GeneratorInput>;
  currentStep: number;
  isGenerating: boolean;
  draftPlanId: string | null;
  setInput: (input: Partial<GeneratorInput>) => void;
  setStep: (step: number) => void;
  setGenerating: (generating: boolean) => void;
  setDraftPlanId: (id: string | null) => void;
  reset: () => void;
}

const DEFAULT_INPUT: Partial<GeneratorInput> = {
  sport: "baseball",
  ageGroup: "14u",
  skillLevel: "intermediate",
  competitiveLevel: "travel",
  environment: "outdoor",
  rosterSize: 12,
  coachCount: 2,
  durationMinutes: 75,
  primaryGoals: [],
  secondaryGoals: [],
  equipment: ["baseballs", "gloves", "bases", "fungo-bat"],
  practiceStyle: "balanced",
  stationPreference: "many-stations",
  blockDuration: "mixed",
  includeWarmup: true,
  includeCooldown: true,
  includeMentalCoaching: false,
  emphasisMode: "repetition",
};

export const useGeneratorStore = create<GeneratorState>()((set) => ({
  input: DEFAULT_INPUT,
  currentStep: 0,
  isGenerating: false,
  draftPlanId: null,

  setInput: (input) =>
    set((state) => ({ input: { ...state.input, ...input } })),

  setStep: (step) => set({ currentStep: step }),
  setGenerating: (generating) => set({ isGenerating: generating }),
  setDraftPlanId: (id) => set({ draftPlanId: id }),
  reset: () => set({ input: DEFAULT_INPUT, currentStep: 0, draftPlanId: null }),
}));

// ─── Session Run Store ─────────────────────────────────────────────────────────

interface SessionState {
  session: SessionRunState | null;
  startSession: (planId: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  nextBlock: () => void;
  skipBlock: () => void;
  addExtraTime: (seconds: number) => void;
  endSession: () => void;
  tick: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  session: null,

  startSession: (planId) =>
    set({
      session: {
        planId,
        currentBlockIndex: 0,
        blockStartTime: Date.now(),
        elapsed: 0,
        isRunning: true,
        isPaused: false,
        completedBlockIds: [],
        extraTimeSeconds: 0,
        startedAt: new Date().toISOString(),
      },
    }),

  pauseSession: () =>
    set((state) => ({
      session: state.session ? { ...state.session, isRunning: false, isPaused: true } : null,
    })),

  resumeSession: () =>
    set((state) => ({
      session: state.session
        ? { ...state.session, isRunning: true, isPaused: false, blockStartTime: Date.now() }
        : null,
    })),

  nextBlock: () =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          currentBlockIndex: state.session.currentBlockIndex + 1,
          blockStartTime: Date.now(),
          elapsed: 0,
          extraTimeSeconds: 0,
        },
      };
    }),

  skipBlock: () =>
    set((state) => {
      if (!state.session) return state;
      return {
        session: {
          ...state.session,
          currentBlockIndex: state.session.currentBlockIndex + 1,
          blockStartTime: Date.now(),
          elapsed: 0,
          extraTimeSeconds: 0,
        },
      };
    }),

  addExtraTime: (seconds) =>
    set((state) => ({
      session: state.session
        ? { ...state.session, extraTimeSeconds: state.session.extraTimeSeconds + seconds }
        : null,
    })),

  endSession: () => set({ session: null }),

  tick: () =>
    set((state) => {
      if (!state.session || !state.session.isRunning) return state;
      return {
        session: {
          ...state.session,
          elapsed: state.session.elapsed + 1,
        },
      };
    }),
}));

// ─── UI / Notification Store ───────────────────────────────────────────────────

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  notifications: AppNotification[];
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  addNotification: (notification: Omit<AppNotification, "id">) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      notifications: [],

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            { ...notification, id: generateId() },
          ],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: "practiceflow-ui",
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);
