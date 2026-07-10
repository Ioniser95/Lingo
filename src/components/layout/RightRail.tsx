import { useLearner, DAILY_XP_GOAL, useTimeToNextHeart, MAX_HEARTS } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { Zap, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function DailyGoalCard() {
  const hydrated = useHydrated();
  const todayXp = useLearner((s) => s.todayXp);
  const hearts = useLearner((s) => s.hearts);
  const timeLeft = useTimeToNextHeart();

  const xp = hydrated ? todayXp : 0;
  const pct = Math.min(100, Math.round((xp / DAILY_XP_GOAL) * 100));

  return (
    <div className="space-y-4">
      <section className="duo-card p-5">
        <h3 className="text-sm uppercase font-black text-hare tracking-wide mb-3">Daily Goal</h3>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-bee/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-bee-shadow" fill="currentColor" strokeWidth={0} />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <span className="font-black text-lg">{xp} / {DAILY_XP_GOAL} XP</span>
              <span className="text-xs text-hare font-bold">{pct}%</span>
            </div>
            <div className="mt-1.5 h-3 bg-swan rounded-full overflow-hidden border-2 border-wolf">
              <div className="h-full bg-bee transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="duo-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm uppercase font-black text-hare tracking-wide">Hearts</h3>
          <span className="font-black text-cardinal flex items-center gap-1">
            <Heart className="w-5 h-5" fill="currentColor" strokeWidth={0} />
            {hydrated ? hearts : MAX_HEARTS}
          </span>
        </div>
        {hydrated && hearts < MAX_HEARTS ? (
          <>
            <p className="text-sm text-hare font-semibold mb-3">
              Next heart in {formatMs(timeLeft)}
            </p>
            <Link
              to="/shop"
              className="duo-btn w-full bg-snow text-macaw border-2 border-wolf"
              style={{ ["--btn-shadow" as string]: "var(--color-wolf)" }}
            >
              Refill
            </Link>
          </>
        ) : (
          <p className="text-sm text-hare font-semibold">You're all set — hearts are full!</p>
        )}
      </section>
    </div>
  );
}

function formatMs(ms: number): string {
  if (ms <= 0) return "0m";
  const totalMin = Math.ceil(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
