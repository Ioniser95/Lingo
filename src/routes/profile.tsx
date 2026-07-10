import { AppShell } from "@/components/layout/AppShell";
import { useLearner } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { spanishCourse, allSkillsOrdered } from "@/lib/course-data";
import { useSkillStatus } from "@/lib/store";
import { Flame, Zap, Award, Sparkles, Star } from "lucide-react";
import type { ReactNode } from "react";

export default function ProfilePage() {
  const hydrated = useHydrated();
  const name = useLearner((s) => s.name);
  const avatar = useLearner((s) => s.avatar);
  const joined = useLearner((s) => s.joined);
  const xp = useLearner((s) => s.xp);
  const streak = useLearner((s) => s.streak);
  const statusMap = useSkillStatus();

  const totalSkills = allSkillsOrdered().length;
  const completed = hydrated
    ? Object.values(statusMap).filter((s) => s.status === "completed").length
    : 0;
  const totalCrowns = hydrated
    ? Object.values(statusMap).reduce((sum, s) => sum + s.progress.crown, 0)
    : 0;

  const joinedLabel = hydrated
    ? new Date(joined).toLocaleDateString(undefined, { month: "long", year: "numeric" })
    : "";

  const stats = [
    { label: "Day streak", value: hydrated ? streak : 0, icon: <Flame className="w-6 h-6" fill="currentColor" strokeWidth={0} />, color: "text-fox" },
    { label: "Total XP", value: hydrated ? xp : 0, icon: <Zap className="w-6 h-6" fill="currentColor" strokeWidth={0} />, color: "text-bee-shadow" },
    { label: "Crowns", value: totalCrowns, icon: <Star className="w-6 h-6" fill="currentColor" strokeWidth={0} />, color: "text-macaw" },
    { label: "Skills mastered", value: `${completed}/${totalSkills}`, icon: <Award className="w-6 h-6" fill="currentColor" strokeWidth={0} />, color: "text-owl" },
  ];

  const achievements = [
    { icon: "🔥", title: "Wildfire", subtitle: "Reach a 3-day streak", earned: (hydrated ? streak : 0) >= 3 },
    { icon: "🎯", title: "Sharpshooter", subtitle: "Complete a full lesson", earned: (hydrated ? xp : 0) > 0 },
    { icon: "🌟", title: "Scholar", subtitle: "Master your first skill", earned: completed >= 1 },
    { icon: "💎", title: "Sage", subtitle: "Earn 100 XP", earned: (hydrated ? xp : 0) >= 100 },
  ];

  return (
    <AppShell>
      <header className="flex items-center gap-5 mb-8">
        <div className="w-24 h-24 rounded-full bg-macaw/20 flex items-center justify-center text-5xl border-4 border-macaw">
          {avatar}
        </div>
        <div>
          <h1 className="text-3xl">{name}</h1>
          <p className="text-hare font-semibold">Learning {spanishCourse.flag} {spanishCourse.language}</p>
          {joinedLabel && <p className="text-sm text-hare font-semibold">Joined {joinedLabel}</p>}
        </div>
      </header>

      <Section title="Statistics">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="duo-card p-4">
              <div className={"flex items-center gap-2 " + s.color}>{s.icon}<span className="text-2xl font-black">{s.value}</span></div>
              <div className="text-xs uppercase font-black text-hare tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Achievements" icon={<Sparkles className="w-5 h-5 text-beetle" />}>
        <div className="grid gap-3">
          {achievements.map((a) => (
            <div
              key={a.title}
              className={
                "duo-card p-4 flex items-center gap-4 " +
                (a.earned ? "!border-bee" : "opacity-60")
              }
            >
              <div className={"text-3xl w-12 h-12 rounded-full flex items-center justify-center " + (a.earned ? "bg-bee/20" : "bg-swan grayscale")}>{a.icon}</div>
              <div className="flex-1">
                <div className="font-black">{a.title}</div>
                <div className="text-sm text-hare font-semibold">{a.subtitle}</div>
              </div>
              {a.earned && <div className="text-xs uppercase font-black text-bee-shadow">Earned</div>}
            </div>
          ))}
        </div>
      </Section>
    </AppShell>
  );
}

function Section({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg uppercase tracking-wide font-black mb-3 flex items-center gap-2">
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}
