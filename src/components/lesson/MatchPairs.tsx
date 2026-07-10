import { useMemo, useState, useEffect } from "react";
import type { MatchPairsExercise } from "@/lib/course-data";

type Props = {
  exercise: MatchPairsExercise;
  onComplete: (allCorrect: boolean) => void;
  locked: boolean;
};

/**
 * Match pairs mini-game.
 * The user taps a left tile, then a right tile — if they match, both are marked correct.
 * When every pair is matched, onComplete(true) fires so the parent can advance the lesson.
 * A wrong pick briefly flashes red but doesn't end the exercise (matches Duolingo behavior).
 */
export function MatchPairs({ exercise, onComplete, locked }: Props) {
  const leftItems = useMemo(
    () => shuffleStable(exercise.pairs.map((p, i) => ({ id: `L${i}`, text: p.left, pairKey: i })), exercise.id + "L"),
    [exercise],
  );
  const rightItems = useMemo(
    () => shuffleStable(exercise.pairs.map((p, i) => ({ id: `R${i}`, text: p.right, pairKey: i })), exercise.id + "R"),
    [exercise],
  );

  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<{ left: string; right: string } | null>(null);

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;
    const l = leftItems.find((x) => x.id === selectedLeft)!;
    const r = rightItems.find((x) => x.id === selectedRight)!;
    if (l.pairKey === r.pairKey) {
      const next = new Set(matched);
      next.add(l.pairKey);
      setMatched(next);
      setSelectedLeft(null);
      setSelectedRight(null);
      if (next.size === exercise.pairs.length) {
        setTimeout(() => onComplete(true), 250);
      }
    } else {
      setWrongFlash({ left: selectedLeft, right: selectedRight });
      const t = setTimeout(() => {
        setWrongFlash(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [selectedLeft, selectedRight, leftItems, rightItems, exercise.pairs.length, matched, onComplete]);

  const tileState = (id: string, side: "L" | "R", pairKey: number) => {
    if (matched.has(pairKey)) return { correct: true, disabled: true };
    if (wrongFlash && (wrongFlash.left === id || wrongFlash.right === id)) return { wrong: true, disabled: true };
    const selected = side === "L" ? selectedLeft === id : selectedRight === id;
    return { selected, disabled: false };
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl">Tap the matching pairs</h1>
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <div className="space-y-3">
          {leftItems.map((it) => {
            const st = tileState(it.id, "L", it.pairKey);
            return (
              <button
                key={it.id}
                type="button"
                className="duo-tile w-full !py-4 text-lg"
                data-selected={st.selected}
                data-correct={st.correct || undefined}
                data-wrong={st.wrong || undefined}
                data-disabled={locked || st.disabled}
                onClick={() => !locked && !st.disabled && setSelectedLeft(it.id)}
              >
                {it.text}
              </button>
            );
          })}
        </div>
        <div className="space-y-3">
          {rightItems.map((it) => {
            const st = tileState(it.id, "R", it.pairKey);
            return (
              <button
                key={it.id}
                type="button"
                className="duo-tile w-full !py-4 text-lg"
                data-selected={st.selected}
                data-correct={st.correct || undefined}
                data-wrong={st.wrong || undefined}
                data-disabled={locked || st.disabled}
                onClick={() => !locked && !st.disabled && setSelectedRight(it.id)}
              >
                {it.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function shuffleStable<T>(arr: T[], seed: string): T[] {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
