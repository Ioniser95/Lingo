import { create } from "zustand";
import { allSkillsOrdered, findLesson } from "./course-data";

export const MAX_HEARTS = 5;
export const HEART_REFILL_MINUTES = 30; // 1 heart every 30 min
export const DAILY_XP_GOAL = 30;

export type SkillProgress = {
  /** Index of the next lesson to complete (0 = none done). */
  lessonsCompleted: number;
  /** "Crowns" — capped by lesson count; matches Duolingo's per-skill crown level. */
  crown: number;
};

export type LearnerState = {
  name: string;
  avatar: string;
  joined: string;             // ISO date
  xp: number;
  streak: number;
  gems: number;               // mocked currency
  hearts: number;
  heartsUpdatedAt: number;    // epoch ms — used to refill hearts over time
  lastActiveDate: string;     // YYYY-MM-DD in local tz
  todayXp: number;            // resets when lastActiveDate rolls over
  progress: Record<string, SkillProgress>;

  // async actions
  fetchLearner: () => Promise<void>;
  tickHearts: () => Promise<void>;
  gainXp: (amount: number) => Promise<void>;
  loseHeart: () => Promise<void>;
  refillHeartsWithGems: () => Promise<boolean>;
  completeLesson: (lessonId: string, xpEarned: number) => Promise<void>;
};

const initial: Omit<
  LearnerState,
  "fetchLearner" | "tickHearts" | "gainXp" | "loseHeart" | "refillHeartsWithGems" | "completeLesson"
> = {
  name: "You",
  avatar: "🐤",
  joined: new Date().toISOString(),
  xp: 0,
  streak: 0,
  gems: 500,
  hearts: MAX_HEARTS,
  heartsUpdatedAt: Date.now(),
  lastActiveDate: "",
  todayXp: 0,
  progress: {},
};

const API_BASE = import.meta.env.VITE_API_URL || '';

export const useLearner = create<LearnerState>()(
  (set, get) => ({
    ...initial,

    fetchLearner: async () => {
      try {
        const res = await fetch(`${API_BASE}/api/learner`);
        if (res.ok) {
          const data = await res.json();
          set(data);
        }
      } catch (e) {
        console.error("Failed to fetch learner", e);
      }
    },

    tickHearts: async () => {
      try {
        const res = await fetch(`${API_BASE}/api/learner`);
        if (res.ok) set(await res.json());
      } catch (e) {}
    },

    gainXp: async (amount) => {
      set((s) => ({ xp: s.xp + amount, todayXp: s.todayXp + amount }));
      try {
        const res = await fetch(`${API_BASE}/api/learner/xp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
        });
        if (res.ok) set(await res.json());
      } catch (e) {}
    },

    loseHeart: async () => {
      set((s) => ({
        hearts: Math.max(0, s.hearts - 1),
        heartsUpdatedAt: s.hearts === MAX_HEARTS ? Date.now() : s.heartsUpdatedAt,
      }));
      try {
        const res = await fetch(`${API_BASE}/api/learner/heart/lose`, { method: 'POST' });
        if (res.ok) set(await res.json());
      } catch (e) {}
    },

    refillHeartsWithGems: async () => {
      const cost = 350;
      const s = get();
      if (s.hearts >= MAX_HEARTS || s.gems < cost) return false;
      set({ hearts: MAX_HEARTS, gems: s.gems - cost, heartsUpdatedAt: Date.now() });
      try {
        const res = await fetch(`${API_BASE}/api/learner/heart/refill`, { method: 'POST' });
        if (res.ok) {
          set(await res.json());
          return true;
        }
      } catch (e) {}
      return false;
    },

    completeLesson: async (lessonId, xpEarned) => {
      const found = findLesson(lessonId);
      if (!found) return;
      const { skill } = found;
      const prev = get().progress[skill.id] ?? { lessonsCompleted: 0, crown: 0 };
      const lessonIndex = skill.lessons.findIndex((l) => l.id === lessonId);
      const advances = lessonIndex === prev.lessonsCompleted;
      const nextProgress: SkillProgress = advances
        ? {
            lessonsCompleted: Math.min(skill.lessons.length, prev.lessonsCompleted + 1),
            crown: Math.min(skill.lessons.length, prev.crown + 1),
          }
        : prev;

      set((s) => ({
        xp: s.xp + xpEarned,
        todayXp: s.todayXp + xpEarned,
        progress: { ...s.progress, [skill.id]: nextProgress },
      }));

      try {
        const res = await fetch(`${API_BASE}/api/learner/lesson/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            xpEarned,
            skillId: skill.id,
            lessonsCompleted: nextProgress.lessonsCompleted,
            crown: nextProgress.crown
          })
        });
        if (res.ok) set(await res.json());
      } catch (e) {}
    },
  })
);

// Client-side initialization
if (typeof window !== "undefined") {
  void useLearner.getState().fetchLearner();
}

export type SkillStatus = "locked" | "available" | "in_progress" | "completed";
export function useSkillStatus(): Record<string, { status: SkillStatus; progress: SkillProgress }> {
  const progress = useLearner((s) => s.progress);
  const ordered = allSkillsOrdered();
  const out: Record<string, { status: SkillStatus; progress: SkillProgress }> = {};
  let previousDone = true;
  for (const { skill } of ordered) {
    const p = progress[skill.id] ?? { lessonsCompleted: 0, crown: 0 };
    const done = p.lessonsCompleted >= skill.lessons.length;
    let status: SkillStatus;
    if (done) status = "completed";
    else if (!previousDone) status = "locked";
    else if (p.lessonsCompleted > 0) status = "in_progress";
    else status = "available";
    out[skill.id] = { status, progress: p };
    previousDone = done;
  }
  return out;
}

export function useTimeToNextHeart(): number {
  const hearts = useLearner((s) => s.hearts);
  const heartsUpdatedAt = useLearner((s) => s.heartsUpdatedAt);
  if (hearts >= MAX_HEARTS) return 0;
  const next = heartsUpdatedAt + HEART_REFILL_MINUTES * 60_000;
  return Math.max(0, next - Date.now());
}
