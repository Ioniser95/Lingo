import { useNavigate } from "react-router-dom";
import { spanishCourse, type Skill, type SkillColor, type Unit } from "@/lib/course-data";
import { useSkillStatus, useLearner, MAX_HEARTS } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { AppShell } from "@/components/layout/AppShell";
import { Check, Lock, Star } from "lucide-react";
import { useState } from "react";

const COLOR_MAP: Record<SkillColor, { bg: string; shadow: string; ring: string }> = {
  owl:      { bg: "bg-owl",      shadow: "var(--color-owl-shadow)",      ring: "ring-owl-shadow" },
  macaw:    { bg: "bg-macaw",    shadow: "var(--color-macaw-shadow)",    ring: "ring-macaw-shadow" },
  beetle:   { bg: "bg-beetle",   shadow: "var(--color-beetle-shadow)",   ring: "ring-beetle-shadow" },
  fox:      { bg: "bg-fox",      shadow: "var(--color-fox-shadow)",      ring: "ring-fox-shadow" },
  cardinal: { bg: "bg-cardinal", shadow: "var(--color-cardinal-shadow)", ring: "ring-cardinal-shadow" },
  bee:      { bg: "bg-bee",      shadow: "var(--color-bee-shadow)",      ring: "ring-bee-shadow" },
};

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-14">
        {spanishCourse.units.map((unit) => (
          <UnitSection key={unit.id} unit={unit} />
        ))}
      </div>
    </AppShell>
  );
}

function UnitSection({ unit }: { unit: Unit }) {
  const c = COLOR_MAP[unit.color];
  return (
    <section>
      <div className={"rounded-2xl border-b-4 border-transparent p-5 flex items-center justify-between text-snow " + c.bg}
        style={{ borderBottomColor: c.shadow.replace("var(", "").replace(")", "") ? undefined : undefined }}>
        <div>
          <div className="uppercase text-xs font-black tracking-widest opacity-80">Section 1 · {unit.title}</div>
          <div className="text-xl md:text-2xl mt-1">{unit.subtitle}</div>
        </div>
        <div className="text-4xl">{unit.color === "owl" ? "🦉" : unit.color === "fox" ? "🦊" : "✨"}</div>
      </div>

      <div className="flex flex-col items-center mt-8 gap-6">
        {unit.skills.map((skill, i) => (
          <SkillNode key={skill.id} skill={skill} indexInUnit={i} />
        ))}
      </div>
    </section>
  );
}

function SkillNode({ skill, indexInUnit }: { skill: Skill; indexInUnit: number }) {
  const hydrated = useHydrated();
  const statusMap = useSkillStatus();
  const hearts = useLearner((s) => s.hearts);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Zig-zag path offset like Duolingo.
  const offset = [0, 60, 90, 60, 0, -60, -90, -60][indexInUnit % 8];
  const entry = hydrated ? statusMap[skill.id] : { status: "available" as const, progress: { lessonsCompleted: 0, crown: 0 } };
  const { status, progress } = entry;
  const total = skill.lessons.length;
  const done = progress.lessonsCompleted;
  const nextLessonId = skill.lessons[Math.min(done, total - 1)]?.id;

  const c = COLOR_MAP[skill.color];
  const locked = status === "locked";
  const completed = status === "completed";

  const ringPct = Math.round((done / total) * 100);

  return (
    <div className={`relative flex flex-col items-center ${open ? 'z-30' : ''}`} style={{ transform: `translateX(${offset}px)` }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative group"
        aria-label={skill.title}
      >
        {/* Progress ring */}
        <svg viewBox="0 0 100 100" className="w-24 h-24">
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-wolf)" strokeWidth="6" />
          {!locked && (
            <circle
              cx="50" cy="50" r="46" fill="none"
              stroke={completed ? "var(--color-bee)" : `var(--color-${skill.color})`}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - ringPct / 100)}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 400ms ease" }}
            />
          )}
        </svg>
        {/* Inner node */}
        <div
          className={
            "absolute inset-2 rounded-full flex items-center justify-center text-3xl border-b-[6px] transition-transform " +
            (locked ? "bg-swan border-wolf text-hare" : `${c.bg} text-snow group-hover:scale-105`)
          }
          style={locked ? { borderBottomColor: "var(--color-wolf)" } : { borderBottomColor: c.shadow }}
        >
          {locked ? <Lock className="w-7 h-7" strokeWidth={3} /> : completed ? <Check className="w-8 h-8" strokeWidth={4} /> : skill.icon}
        </div>
      </button>
      <div className="mt-2 text-xs uppercase font-black text-hare tracking-wider text-center">{skill.title}</div>

      {open && !locked && (
        <div className="absolute top-full mt-3 z-20 w-72 duo-card p-4 text-left animate-pop"
          style={{ borderBottomColor: c.shadow, ["--btn-shadow" as string]: c.shadow }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{skill.icon}</span>
            <div className="font-black text-lg">{skill.title}</div>
          </div>
          <p className="text-sm text-hare font-semibold mb-3">
            Lesson {Math.min(done + 1, total)} of {total}
            {completed && " · Mastered ⭐"}
          </p>
          {hearts <= 0 && hydrated ? (
            <p className="text-sm text-cardinal font-bold mb-3">
              You're out of hearts! Refill from the shop to keep learning.
            </p>
          ) : null}
          <button
            type="button"
            disabled={!nextLessonId || (hydrated && hearts <= 0)}
            onClick={() => nextLessonId && navigate(`/lesson/${nextLessonId}`)}
            className={"duo-btn w-full text-snow " + c.bg}
            style={{ ["--btn-shadow" as string]: c.shadow }}
          >
            {completed ? "Practice" : done > 0 ? "Continue" : "Start"}
          </button>
          {completed && (
            <div className="mt-3 flex items-center justify-center gap-1 text-bee-shadow font-black">
              <Star className="w-5 h-5" fill="currentColor" strokeWidth={0} /> Crown level {progress.crown}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// keep MAX_HEARTS reachable so tree-shaking is explicit about the store shape used here
void MAX_HEARTS;
