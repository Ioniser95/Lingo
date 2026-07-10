import type { MultipleChoiceExercise } from "@/lib/course-data";

type Props = {
  exercise: MultipleChoiceExercise;
  selectedIndex: number | null;
  onSelect: (i: number) => void;
  locked: boolean;
  checkedResult: "correct" | "wrong" | null;
};

export function MultipleChoice({ exercise, selectedIndex, onSelect, locked, checkedResult }: Props) {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl">Which one of these is <span className="text-macaw">“{exercise.question}”</span>?</h1>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {exercise.options.map((opt, i) => {
          const selected = selectedIndex === i;
          const showCorrect = checkedResult && i === exercise.correctIndex;
          const showWrong = checkedResult === "wrong" && selected;
          return (
            <button
              key={i}
              type="button"
              className="duo-tile !p-6 flex-col gap-3 min-h-32"
              data-selected={selected && !checkedResult}
              data-correct={showCorrect || undefined}
              data-wrong={showWrong || undefined}
              data-disabled={locked}
              onClick={() => !locked && onSelect(i)}
            >
              <div className="text-4xl">{["🍎", "🍞", "🥛", "💧", "🎨", "✈️"][i] ?? "✨"}</div>
              <div className="text-base md:text-lg">{opt}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
