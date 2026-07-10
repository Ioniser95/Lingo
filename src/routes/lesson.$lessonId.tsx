import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Heart, X } from "lucide-react";

import { findLesson, type Exercise } from "@/lib/course-data";
import { useLearner } from "@/lib/store";
import { useHydrated } from "@/hooks/use-hydrated";
import { MultipleChoice } from "@/components/lesson/MultipleChoice";
import { Translate } from "@/components/lesson/Translate";
import { MatchPairs } from "@/components/lesson/MatchPairs";
import { FillBlank } from "@/components/lesson/FillBlank";
import { TypeAnswer } from "@/components/lesson/TypeAnswer";

type CheckResult = "correct" | "wrong" | null;

/** Per-exercise answer state — one entry keyed by exercise index. */
type AnswerState = {
  choiceIndex: number | null;   // for MC + fill-blank
  translateOrder: number[];     // for translate
  typed: string;                // for type_answer
};
const emptyAnswer: AnswerState = { choiceIndex: null, translateOrder: [], typed: "" };

export default function LessonPage() {
  const { lessonId } = useParams();
  const found = findLesson(lessonId || "");
  if (!found) return <Navigate to="/" replace />;
  const { unit, skill, lesson } = found;
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const hearts = useLearner((s) => s.hearts);
  const loseHeart = useLearner((s) => s.loseHeart);
  const completeLesson = useLearner((s) => s.completeLesson);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>(() => lesson.exercises.map(() => ({ ...emptyAnswer })));
  const [checked, setChecked] = useState<CheckResult>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [failed, setFailed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [quitOpen, setQuitOpen] = useState(false);

  const exercise = lesson.exercises[step];
  const total = lesson.exercises.length;
  const progressPct = ((step + (checked ? 1 : 0)) / total) * 100;

  // Redirect to out-of-hearts if we run out mid-lesson (uses live store hearts).
  useEffect(() => {
    if (hydrated && hearts <= 0 && !completed && !failed) setFailed(true);
  }, [hearts, hydrated, completed, failed]);

  const setCurrentAnswer = useCallback(
    (patch: Partial<AnswerState>) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = { ...next[step], ...patch };
        return next;
      });
    },
    [step],
  );

  const current = answers[step];
  const canCheck = useMemo(() => canSubmit(exercise, current), [exercise, current]);

  function onCheck() {
    if (!canCheck || checked) return;
    const ok = isCorrect(exercise, current);
    setChecked(ok ? "correct" : "wrong");
    if (ok) setCorrectCount((c) => c + 1);
    else {
      setWrongCount((c) => c + 1);
      loseHeart();
    }
  }

  function onContinue() {
    if (!checked) return;
    setChecked(null);
    if (step + 1 >= total) finish();
    else setStep(step + 1);
  }

  // Match Pairs auto-completes when all pairs are matched.
  const onMatchComplete = useCallback((allCorrect: boolean) => {
    setChecked(allCorrect ? "correct" : "wrong");
    if (allCorrect) setCorrectCount((c) => c + 1);
  }, []);

  function finish() {
    // XP: 10 per lesson base, +2 per correct-first-try (correctCount roughly), minus 0 for wrong
    const accuracy = correctCount / total;
    const xpEarned = Math.max(5, Math.round(10 + accuracy * 10));
    completeLesson(lesson.id, xpEarned);
    setCompleted(true);
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header: quit + progress + hearts */}
      <header className="sticky top-0 z-20 bg-background border-b border-transparent">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-4">
          <button
            type="button"
            onClick={() => setQuitOpen(true)}
            className="text-hare hover:text-eel"
            aria-label="Quit lesson"
          >
            <X className="w-7 h-7" strokeWidth={3} />
          </button>
          <div className="flex-1 h-4 bg-swan rounded-full overflow-hidden border-2 border-wolf">
            <div className="h-full bg-owl transition-all rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="flex items-center gap-1 text-cardinal font-black">
            <Heart className="w-6 h-6" fill="currentColor" strokeWidth={0} />
            <span>{hydrated ? hearts : 5}</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="pt-6"
          >
            <ExerciseView
              exercise={exercise}
              answer={current}
              setAnswer={setCurrentAnswer}
              checked={checked}
              onMatchComplete={onMatchComplete}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer feedback bar */}
      <FeedbackBar
        exercise={exercise}
        checked={checked}
        canCheck={canCheck}
        onCheck={onCheck}
        onContinue={onContinue}
      />

      {/* Modals */}
      {quitOpen && (
        <QuitModal
          onCancel={() => setQuitOpen(false)}
          onConfirm={() => navigate("/")}
        />
      )}
      {completed && (
        <CompleteModal
          correct={correctCount}
          total={total}
          onNext={() => {
            toast.success("Lesson saved!", { description: `${skill.title} · ${unit.title}` });
            navigate("/");
          }}
        />
      )}
      {failed && (
        <OutOfHeartsModal
          onExit={() => navigate("/")}
          onShop={() => navigate("/shop")}
        />
      )}
    </div>
  );
}

/* ---------------------------- sub-components ---------------------------- */

function ExerciseView({
  exercise,
  answer,
  setAnswer,
  checked,
  onMatchComplete,
}: {
  exercise: Exercise;
  answer: AnswerState;
  setAnswer: (patch: Partial<AnswerState>) => void;
  checked: CheckResult;
  onMatchComplete: (ok: boolean) => void;
}) {
  const locked = checked !== null;
  switch (exercise.type) {
    case "multiple_choice":
      return (
        <MultipleChoice
          exercise={exercise}
          selectedIndex={answer.choiceIndex}
          onSelect={(i) => setAnswer({ choiceIndex: i })}
          locked={locked}
          checkedResult={checked}
        />
      );
    case "translate":
      return (
        <Translate
          exercise={exercise}
          selected={answer.translateOrder}
          onChange={(next) => setAnswer({ translateOrder: next })}
          locked={locked}
          checkedResult={checked}
        />
      );
    case "match_pairs":
      return <MatchPairs exercise={exercise} onComplete={onMatchComplete} locked={locked} />;
    case "fill_blank":
      return (
        <FillBlank
          exercise={exercise}
          selectedIndex={answer.choiceIndex}
          onSelect={(i) => setAnswer({ choiceIndex: i })}
          locked={locked}
          checkedResult={checked}
        />
      );
    case "type_answer":
      return (
        <TypeAnswer
          exercise={exercise}
          value={answer.typed}
          onChange={(v) => setAnswer({ typed: v })}
          locked={locked}
          checkedResult={checked}
        />
      );
  }
}

function FeedbackBar({
  exercise,
  checked,
  canCheck,
  onCheck,
  onContinue,
}: {
  exercise: Exercise;
  checked: CheckResult;
  canCheck: boolean;
  onCheck: () => void;
  onContinue: () => void;
}) {
  const isCorrect = checked === "correct";
  const isWrong = checked === "wrong";
  const bg = isCorrect ? "bg-sea-sponge" : isWrong ? "bg-humpback" : "bg-snow";
  const btnBg = isCorrect
    ? "bg-owl text-snow"
    : isWrong
      ? "bg-cardinal text-snow"
      : canCheck
        ? "bg-owl text-snow"
        : "";
  const btnShadow = isCorrect
    ? "var(--color-owl-shadow)"
    : isWrong
      ? "var(--color-cardinal-shadow)"
      : "var(--color-owl-shadow)";
  return (
    <footer className={"fixed bottom-0 inset-x-0 border-t-2 border-wolf transition-colors " + bg}>
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          {isCorrect && (
            <div>
              <div className="font-black text-owl-shadow text-lg">Nicely done!</div>
            </div>
          )}
          {isWrong && (
            <div>
              <div className="font-black text-cardinal-shadow text-lg">Not quite.</div>
              <div className="text-sm text-cardinal-shadow font-semibold">
                {correctText(exercise)}
              </div>
            </div>
          )}
        </div>
        {checked === null ? (
          <button
            type="button"
            className={"duo-btn " + (canCheck ? btnBg : "")}
            style={canCheck ? { ["--btn-shadow" as string]: btnShadow } : undefined}
            disabled={!canCheck}
            onClick={onCheck}
          >
            Check
          </button>
        ) : (
          <button
            type="button"
            className={"duo-btn " + btnBg}
            style={{ ["--btn-shadow" as string]: btnShadow }}
            onClick={onContinue}
          >
            Continue
          </button>
        )}
      </div>
    </footer>
  );
}

function correctText(ex: Exercise): string {
  switch (ex.type) {
    case "multiple_choice": return `Correct answer: ${ex.options[ex.correctIndex]}`;
    case "translate": return `Correct answer: ${ex.correctOrder.join(" ")}`;
    case "fill_blank": return `Correct answer: ${ex.options[ex.correctIndex]}`;
    case "type_answer": return `Correct answer: ${ex.correctAnswers[0]}`;
    case "match_pairs": return "Match each pair correctly to continue.";
  }
}

/* ------------------------------- modals -------------------------------- */

function QuitModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal>
      <div className="text-6xl mb-4">😢</div>
      <h2 className="text-2xl mb-2">Wait, don't go!</h2>
      <p className="text-hare font-semibold mb-6">You'll lose your progress in this lesson.</p>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="duo-btn bg-owl text-snow w-full"
          style={{ ["--btn-shadow" as string]: "var(--color-owl-shadow)" }}
          onClick={onCancel}
        >
          Keep learning
        </button>
        <button
          type="button"
          className="duo-btn bg-snow text-cardinal border-2 border-wolf w-full"
          style={{ ["--btn-shadow" as string]: "var(--color-wolf)" }}
          onClick={onConfirm}
        >
          End session
        </button>
      </div>
    </Modal>
  );
}

function CompleteModal({ correct, total, onNext }: { correct: number; total: number; onNext: () => void }) {
  const accuracy = Math.round((correct / total) * 100);
  const xp = Math.max(5, Math.round(10 + (correct / total) * 10));
  return (
    <Modal>
      <div className="text-6xl mb-4 animate-pop">🎉</div>
      <h2 className="text-3xl mb-2 text-owl">Lesson Complete!</h2>
      <p className="text-hare font-semibold mb-6">You're on fire. Keep the streak going!</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatPill label="XP" value={`+${xp}`} color="text-bee-shadow" bg="bg-bee/15" />
        <StatPill label="Accuracy" value={`${accuracy}%`} color="text-owl-shadow" bg="bg-owl/15" />
        <StatPill label="Correct" value={`${correct}/${total}`} color="text-macaw-shadow" bg="bg-macaw/15" />
      </div>
      <button
        type="button"
        className="duo-btn bg-owl text-snow w-full"
        style={{ ["--btn-shadow" as string]: "var(--color-owl-shadow)" }}
        onClick={onNext}
      >
        Continue
      </button>
    </Modal>
  );
}

function OutOfHeartsModal({ onExit, onShop }: { onExit: () => void; onShop: () => void }) {
  return (
    <Modal>
      <div className="text-6xl mb-4">💔</div>
      <h2 className="text-2xl mb-2 text-cardinal">You ran out of hearts!</h2>
      <p className="text-hare font-semibold mb-6">Refill in the shop or wait for hearts to regenerate.</p>
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="duo-btn bg-macaw text-snow w-full"
          style={{ ["--btn-shadow" as string]: "var(--color-macaw-shadow)" }}
          onClick={onShop}
        >
          Get Hearts
        </button>
        <button
          type="button"
          className="duo-btn bg-snow text-eel border-2 border-wolf w-full"
          style={{ ["--btn-shadow" as string]: "var(--color-wolf)" }}
          onClick={onExit}
        >
          No thanks
        </button>
      </div>
    </Modal>
  );
}

function StatPill({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div className={"rounded-xl p-3 " + bg}>
      <div className="text-[10px] uppercase font-black text-hare tracking-wide">{label}</div>
      <div className={"text-xl font-black " + color}>{value}</div>
    </div>
  );
}

function Modal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-snow rounded-3xl border-2 border-wolf border-b-4 max-w-md w-full p-6 text-center animate-pop">
        {children}
      </div>
    </div>
  );
}



/* ----------------------- exercise submission logic ---------------------- */

function canSubmit(ex: Exercise, a: AnswerState): boolean {
  switch (ex.type) {
    case "multiple_choice":
    case "fill_blank":
      return a.choiceIndex !== null;
    case "translate":
      return a.translateOrder.length > 0;
    case "type_answer":
      return a.typed.trim().length > 0;
    case "match_pairs":
      return false; // auto-completes
  }
}

function isCorrect(ex: Exercise, a: AnswerState): boolean {
  switch (ex.type) {
    case "multiple_choice":
    case "fill_blank":
      return a.choiceIndex === ex.correctIndex;
    case "translate": {
      // Compare the words the user picked (in order) against the correct sequence.
      // Selected indices refer to the shuffled bank the Translate component built —
      // we need the same shuffle here. To avoid coupling, we accept any ordering that
      // produces the correct target words when read against the raw wordBank via the
      // shuffled bank the child rendered. Since we don't have that map here, we compare
      // by resolving indices through wordBank AFTER re-shuffling with the same seed.
      const bank = seededShuffle(ex.wordBank, ex.id);
      const chosen = a.translateOrder.map((i) => bank[i]);
      return arraysEqual(chosen, ex.correctOrder);
    }
    case "type_answer": {
      const norm = a.typed.trim().toLowerCase().replace(/\s+/g, " ");
      return ex.correctAnswers.some((c) => c.toLowerCase() === norm);
    }
    case "match_pairs":
      return true;
  }
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}
function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  let s = h >>> 0;
  const rand = () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
