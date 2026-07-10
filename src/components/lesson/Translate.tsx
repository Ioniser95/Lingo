import { useMemo } from "react";
import type { TranslateExercise } from "@/lib/course-data";

type Props = {
  exercise: TranslateExercise;
  selected: number[]; // indices into the shuffled bank
  onChange: (next: number[]) => void;
  locked: boolean;
  checkedResult: "correct" | "wrong" | null;
};

/** Deterministic shuffle keyed off the exercise id so bank order is stable per render session. */
function seededShuffle<T>(arr: T[], seed: string): T[] {
  const rand = mulberry32(hashCode(seed));
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function hashCode(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Translate({ exercise, selected, onChange, locked, checkedResult }: Props) {
  const bank = useMemo(() => seededShuffle(exercise.wordBank, exercise.id), [exercise]);
  const chosenSet = new Set(selected);

  const pick = (i: number) => !locked && !chosenSet.has(i) && onChange([...selected, i]);
  const unpick = (i: number) => !locked && onChange(selected.filter((x) => x !== i));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl">Translate this sentence</h1>
      <div className="flex items-start gap-3">
        <div className="text-5xl">🦉</div>
        <div className="relative bg-snow border-2 border-wolf rounded-2xl px-4 py-3 text-lg font-bold">
          {exercise.sentence}
        </div>
      </div>

      {/* answer line */}
      <div className="min-h-16 border-b-2 border-wolf pb-2 flex flex-wrap gap-2">
        {selected.map((i) => (
          <button key={`sel-${i}`} type="button" onClick={() => unpick(i)} className="duo-tile !py-2 !px-3" data-disabled={locked}>
            {bank[i]}
          </button>
        ))}
      </div>

      {/* word bank */}
      <div className="flex flex-wrap gap-2">
        {bank.map((word, i) => (
          <button
            key={`bank-${i}`}
            type="button"
            onClick={() => pick(i)}
            className="duo-tile !py-2 !px-3"
            data-disabled={chosenSet.has(i) || locked}
            style={chosenSet.has(i) ? { visibility: "hidden" } : undefined}
          >
            {word}
          </button>
        ))}
      </div>

      {checkedResult === "wrong" && (
        <p className="text-sm text-cardinal font-bold">Correct answer: {exercise.correctOrder.join(" ")}</p>
      )}
    </div>
  );
}
