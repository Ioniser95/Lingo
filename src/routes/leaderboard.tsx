import { AppShell } from "@/components/layout/AppShell";
import { seededLeaderboard } from "@/lib/course-data";
import { useLearner } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { Trophy } from "lucide-react";

const BADGES = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const hydrated = useHydrated();
  const name = useLearner((s) => s.name);
  const avatar = useLearner((s) => s.avatar);
  const xp = useLearner((s) => s.xp);
  const combined = [
    ...seededLeaderboard,
    ...(hydrated ? [{ id: "me", name, avatar, xp }] : []),
  ].sort((a, b) => b.xp - a.xp);

  return (
    <AppShell>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-bee/20 mb-4">
          <Trophy className="w-14 h-14 text-bee-shadow" fill="currentColor" strokeWidth={0} />
        </div>
        <h1 className="text-3xl">Sapphire League</h1>
        <p className="text-hare font-semibold mt-1">Top 3 advance to the next league this week.</p>
        <div className="h-1 w-24 bg-macaw rounded-full mx-auto mt-4" />
      </div>

      <ul className="space-y-2">
        {combined.map((u, i) => {
          const isMe = u.id === "me";
          return (
            <li
              key={u.id}
              className={
                "duo-card flex items-center gap-4 p-3 pr-5 " +
                (isMe ? "border-macaw !border-b-4" : "")
              }
            >
              <div className="w-10 text-center font-black text-lg">
                {BADGES[i] ?? i + 1}
              </div>
              <div className="w-12 h-12 rounded-full bg-swan flex items-center justify-center text-2xl">
                {u.avatar}
              </div>
              <div className="flex-1 font-black">{isMe ? `${u.name} (You)` : u.name}</div>
              <div className="font-black text-macaw">{u.xp} XP</div>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
