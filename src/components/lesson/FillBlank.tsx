import type { FillBlankExercise } from "@/lib/course-data";

type Props = {
  exercise: FillBlankExercise;
  selectedIndex: number | null;
  onSelect: (i: number) => void;
  locked: boolean;
  checkedResult: "correct" | "wrong" | null;
};

export function FillBlank({ exercise, selectedIndex, onSelect, locked, checkedResult }: Props) {
  const [before, after] = exercise.sentenceParts;
  const chosen = selectedIndex !== null ? exercise.options[selectedIndex] : null;
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl">Fill in the blank</h1>
      <div className="text-2xl md:text-3xl font-bold flex flex-wrap items-center gap-2">
        <span>{before}</span>
        <span
          className={
            "inline-flex min-w-32 px-4 py-2 border-b-4 border-wolf rounded-md " +
            (chosen ? "text-macaw border-macaw" : "text-transparent")
          }
        >
          {chosen ?? "____"}
        </span>
        <span>{after}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {exercise.options.map((opt, i) => {
          const selected = selectedIndex === i;
          const showCorrect = checkedResult && i === exercise.correctIndex;
          const showWrong = checkedResult === "wrong" && selected;
          return (
            <button
              key={i}
              type="button"
              className="duo-tile !py-4 text-lg"
              data-selected={selected && !checkedResult}
              data-correct={showCorrect || undefined}
              data-wrong={showWrong || undefined}
              data-disabled={locked}
              onClick={() => !locked && onSelect(i)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
