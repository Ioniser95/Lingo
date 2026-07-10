import { useEffect } from "react";
import { Flame, Gem, Heart } from "lucide-react";
import { useLearner } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { spanishCourse } from "@/lib/course-data";

/** Top status bar — streak · flag · gems · hearts. Mirrors Duolingo's header. */
export function TopBar() {
  const hydrated = useHydrated();
  const streak = useLearner((s) => s.streak);
  const gems = useLearner((s) => s.gems);
  const hearts = useLearner((s) => s.hearts);
  const tickHearts = useLearner((s) => s.tickHearts);

  useEffect(() => {
    tickHearts();
    const id = setInterval(tickHearts, 30_000);
    return () => clearInterval(id);
  }, [tickHearts]);

  const values = hydrated ? { streak, gems, hearts } : { streak: 0, gems: 500, hearts: 5 };

  return (
    <header className="sticky top-0 z-30 bg-snow/90 backdrop-blur border-b-2 border-wolf">
      <div className="max-w-3xl mx-auto flex items-center justify-end gap-5 px-4 py-3">
        <Stat icon={<span className="text-2xl leading-none">{spanishCourse.flag}</span>} value="" />
        <Stat
          icon={<Flame className="w-6 h-6" strokeWidth={2.5} fill={values.streak > 0 ? "currentColor" : "none"} />}
          value={values.streak}
          color={values.streak > 0 ? "text-fox" : "text-hare"}
        />
        <Stat icon={<Gem className="w-6 h-6" strokeWidth={2.5} fill="currentColor" />} value={values.gems} color="text-macaw" />
        <Stat
          icon={<Heart className="w-6 h-6" strokeWidth={2.5} fill={values.hearts > 0 ? "currentColor" : "none"} />}
          value={values.hearts}
          color={values.hearts > 0 ? "text-cardinal" : "text-hare"}
        />
      </div>
    </header>
  );
}

function Stat({ icon, value, color = "" }: { icon: React.ReactNode; value: React.ReactNode; color?: string }) {
  return (
    <div className={"flex items-center gap-1.5 font-black text-lg " + color}>
      {icon}
      {value !== "" && <span>{value}</span>}
    </div>
  );
}
