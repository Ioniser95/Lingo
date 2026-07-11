import type { TypeAnswerExercise } from "@/lib/course-data";

type Props = {
  exercise: TypeAnswerExercise;
  value: string;
  onChange: (v: string) => void;
  locked: boolean;
  checkedResult: "correct" | "wrong" | null;
};

export function TypeAnswer({ exercise, value, onChange, locked, checkedResult }: Props) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl">Write this in Spanish</h1>
      <div className="flex items-start gap-3">
        <div className="text-5xl">🦉</div>
        <div className="bg-snow border-2 border-wolf rounded-2xl px-4 py-3 text-lg font-bold">
          {exercise.sentence}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={locked}
        rows={3}
        placeholder="Type in Spanish..."
        className={
          "w-full rounded-2xl border-2 p-4 text-lg font-bold outline-none resize-none transition " +
          (checkedResult === "correct"
            ? "border-owl bg-sea-sponge text-owl-shadow dark:bg-owl/20 dark:text-owl"
            : checkedResult === "wrong"
              ? "border-cardinal bg-humpback text-cardinal-shadow dark:bg-cardinal/20 dark:text-cardinal"
              : "border-wolf focus:border-macaw bg-snow text-eel dark:bg-eel dark:text-snow dark:border-wolf/50")
        }
      />
      {checkedResult === "wrong" && (
        <p className="text-sm text-cardinal font-bold">
          Correct answer: {exercise.correctAnswers[0]}
        </p>
      )}
    </div>
  );
}
