/**
 * Seeded course content for a single Spanish course.
 * Structure: Course → Unit → Skill → Lesson → Exercise
 *
 * Exercise types:
 *  - "multiple_choice"  : pick 1 correct option from N
 *  - "translate"        : build a translation by tapping word tiles (word bank)
 *  - "match_pairs"      : match source words to target words
 *  - "fill_blank"       : pick the word that fills a blank in a sentence
 *  - "type_answer"      : freely type the target translation
 */

export type ExerciseBase = { id: string; prompt: string };

export type MultipleChoiceExercise = ExerciseBase & {
  type: "multiple_choice";
  question: string;      // e.g. "Which one is 'apple'?"
  options: string[];
  correctIndex: number;
};

export type TranslateExercise = ExerciseBase & {
  type: "translate";
  sentence: string;      // shown to translate
  wordBank: string[];    // tiles user taps, in random order
  correctOrder: string[];// the correct sequence of tiles
};

export type MatchPairsExercise = ExerciseBase & {
  type: "match_pairs";
  pairs: { left: string; right: string }[];
};

export type FillBlankExercise = ExerciseBase & {
  type: "fill_blank";
  sentenceParts: [string, string]; // rendered as `${a} ___ ${b}`
  options: string[];
  correctIndex: number;
};

export type TypeAnswerExercise = ExerciseBase & {
  type: "type_answer";
  sentence: string;
  correctAnswers: string[]; // accepted answers (case-insensitive, trimmed)
};

export type Exercise =
  | MultipleChoiceExercise
  | TranslateExercise
  | MatchPairsExercise
  | FillBlankExercise
  | TypeAnswerExercise;

export type Lesson = {
  id: string;
  title: string;
  exercises: Exercise[];
};

export type Skill = {
  id: string;
  title: string;
  icon: string;         // emoji as playful placeholder
  color: SkillColor;    // Duolingo-style hue for the node
  lessons: Lesson[];
};

export type Unit = {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  color: SkillColor;
  skills: Skill[];
};

export type Course = {
  id: string;
  language: string;
  flag: string;
  units: Unit[];
};

export type SkillColor = "owl" | "macaw" | "beetle" | "fox" | "cardinal" | "bee";

/** The Spanish course — small but complete: enough content to feel real without noise. */
export const spanishCourse: Course = {
  id: "es",
  language: "Spanish",
  flag: "🇪🇸",
  units: [
    {
      id: "u1",
      order: 1,
      title: "Unit 1",
      subtitle: "Form basic sentences, greet people",
      color: "owl",
      skills: [
        {
          id: "s1",
          title: "Basics",
          icon: "⭐",
          color: "owl",
          lessons: [
            {
              id: "s1l1",
              title: "Basics · Lesson 1",
              exercises: [
                {
                  id: "e1",
                  type: "multiple_choice",
                  prompt: "Which one is “the apple”?",
                  question: "the apple",
                  options: ["la manzana", "el pan", "la leche", "el agua"],
                  correctIndex: 0,
                },
                {
                  id: "e2",
                  type: "translate",
                  prompt: "Translate this sentence",
                  sentence: "I am a boy",
                  wordBank: ["soy", "un", "niño", "una", "niña", "es"],
                  correctOrder: ["soy", "un", "niño"],
                },
                {
                  id: "e3",
                  type: "fill_blank",
                  prompt: "Fill in the blank",
                  sentenceParts: ["Yo", "una manzana."],
                  options: ["como", "bebo", "soy", "tengo"],
                  correctIndex: 0,
                },
                {
                  id: "e4",
                  type: "type_answer",
                  prompt: "Write this in Spanish",
                  sentence: "I am a girl",
                  correctAnswers: ["soy una niña", "yo soy una niña"],
                },
                {
                  id: "e5",
                  type: "match_pairs",
                  prompt: "Tap the matching pairs",
                  pairs: [
                    { left: "hola", right: "hello" },
                    { left: "adiós", right: "goodbye" },
                    { left: "gracias", right: "thank you" },
                    { left: "sí", right: "yes" },
                  ],
                },
              ],
            },
            {
              id: "s1l2",
              title: "Basics · Lesson 2",
              exercises: [
                {
                  id: "e1",
                  type: "multiple_choice",
                  prompt: "Which one is “bread”?",
                  question: "bread",
                  options: ["el pan", "la leche", "la manzana", "el agua"],
                  correctIndex: 0,
                },
                {
                  id: "e2",
                  type: "translate",
                  prompt: "Translate this sentence",
                  sentence: "The woman drinks water",
                  wordBank: ["la", "mujer", "bebe", "come", "agua", "leche"],
                  correctOrder: ["la", "mujer", "bebe", "agua"],
                },
                {
                  id: "e3",
                  type: "type_answer",
                  prompt: "Write this in Spanish",
                  sentence: "I eat bread",
                  correctAnswers: ["como pan", "yo como pan"],
                },
              ],
            },
          ],
        },
        {
          id: "s2",
          title: "Greetings",
          icon: "👋",
          color: "macaw",
          lessons: [
            {
              id: "s2l1",
              title: "Greetings · Lesson 1",
              exercises: [
                {
                  id: "e1",
                  type: "multiple_choice",
                  prompt: "How do you say “good morning”?",
                  question: "good morning",
                  options: ["buenos días", "buenas noches", "hola", "adiós"],
                  correctIndex: 0,
                },
                {
                  id: "e2",
                  type: "match_pairs",
                  prompt: "Tap the matching pairs",
                  pairs: [
                    { left: "buenos días", right: "good morning" },
                    { left: "buenas tardes", right: "good afternoon" },
                    { left: "buenas noches", right: "good night" },
                    { left: "hasta luego", right: "see you later" },
                  ],
                },
                {
                  id: "e3",
                  type: "translate",
                  prompt: "Translate this sentence",
                  sentence: "Hello, how are you?",
                  wordBank: ["hola", "cómo", "estás", "qué", "eres", "adiós"],
                  correctOrder: ["hola", "cómo", "estás"],
                },
                {
                  id: "e4",
                  type: "fill_blank",
                  prompt: "Fill in the blank",
                  sentenceParts: ["Mucho", ", me llamo Ana."],
                  options: ["gusto", "gracias", "adiós", "bien"],
                  correctIndex: 0,
                },
              ],
            },
          ],
        },
        {
          id: "s3",
          title: "Family",
          icon: "👨‍👩‍👧",
          color: "beetle",
          lessons: [
            {
              id: "s3l1",
              title: "Family · Lesson 1",
              exercises: [
                {
                  id: "e1",
                  type: "multiple_choice",
                  prompt: "Which one is “mother”?",
                  question: "mother",
                  options: ["madre", "padre", "hermano", "hija"],
                  correctIndex: 0,
                },
                {
                  id: "e2",
                  type: "match_pairs",
                  prompt: "Tap the matching pairs",
                  pairs: [
                    { left: "padre", right: "father" },
                    { left: "madre", right: "mother" },
                    { left: "hermano", right: "brother" },
                    { left: "hermana", right: "sister" },
                  ],
                },
                {
                  id: "e3",
                  type: "type_answer",
                  prompt: "Write this in Spanish",
                  sentence: "My mother",
                  correctAnswers: ["mi madre"],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "u2",
      order: 2,
      title: "Unit 2",
      subtitle: "Order food, describe things",
      color: "fox",
      skills: [
        {
          id: "s4",
          title: "Food",
          icon: "🍎",
          color: "fox",
          lessons: [
            {
              id: "s4l1",
              title: "Food · Lesson 1",
              exercises: [
                {
                  id: "e1",
                  type: "multiple_choice",
                  prompt: "Which one is “water”?",
                  question: "water",
                  options: ["el agua", "el pan", "la leche", "el queso"],
                  correctIndex: 0,
                },
                {
                  id: "e2",
                  type: "translate",
                  prompt: "Translate this sentence",
                  sentence: "I want an apple",
                  wordBank: ["quiero", "una", "manzana", "un", "pan", "agua"],
                  correctOrder: ["quiero", "una", "manzana"],
                },
                {
                  id: "e3",
                  type: "fill_blank",
                  prompt: "Fill in the blank",
                  sentenceParts: ["Ella", "leche."],
                  options: ["bebe", "come", "es", "tiene"],
                  correctIndex: 0,
                },
              ],
            },
          ],
        },
        {
          id: "s5",
          title: "Colors",
          icon: "🎨",
          color: "cardinal",
          lessons: [
            {
              id: "s5l1",
              title: "Colors · Lesson 1",
              exercises: [
                {
                  id: "e1",
                  type: "match_pairs",
                  prompt: "Tap the matching pairs",
                  pairs: [
                    { left: "rojo", right: "red" },
                    { left: "azul", right: "blue" },
                    { left: "verde", right: "green" },
                    { left: "amarillo", right: "yellow" },
                  ],
                },
                {
                  id: "e2",
                  type: "multiple_choice",
                  prompt: "Which one is “black”?",
                  question: "black",
                  options: ["negro", "blanco", "gris", "rojo"],
                  correctIndex: 0,
                },
              ],
            },
          ],
        },
        {
          id: "s6",
          title: "Travel",
          icon: "✈️",
          color: "bee",
          lessons: [
            {
              id: "s6l1",
              title: "Travel · Lesson 1",
              exercises: [
                {
                  id: "e1",
                  type: "type_answer",
                  prompt: "Write this in Spanish",
                  sentence: "Where is the airport?",
                  correctAnswers: ["dónde está el aeropuerto", "donde esta el aeropuerto"],
                },
                {
                  id: "e2",
                  type: "multiple_choice",
                  prompt: "Which one is “ticket”?",
                  question: "ticket",
                  options: ["el boleto", "el hotel", "la calle", "el mapa"],
                  correctIndex: 0,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/** Flatten helpers used across the app. */
export function findLesson(lessonId: string): { unit: Unit; skill: Skill; lesson: Lesson } | null {
  for (const unit of spanishCourse.units) {
    for (const skill of unit.skills) {
      const lesson = skill.lessons.find((l) => l.id === lessonId);
      if (lesson) return { unit, skill, lesson };
    }
  }
  return null;
}

/** All skills in order, so we can compute lock/unlock progression. */
export function allSkillsOrdered(): Array<{ unit: Unit; skill: Skill }> {
  return spanishCourse.units.flatMap((unit) => unit.skills.map((skill) => ({ unit, skill })));
}

/** Seed leaderboard data — feels alive without a real backend. */
export const seededLeaderboard: Array<{ id: string; name: string; avatar: string; xp: number }> = [
  { id: "u1", name: "Sofia", avatar: "🦉", xp: 1240 },
  { id: "u2", name: "Marco", avatar: "🐼", xp: 980 },
  { id: "u3", name: "Aisha", avatar: "🦊", xp: 830 },
  { id: "u4", name: "Kenji", avatar: "🐧", xp: 720 },
  { id: "u5", name: "Priya", avatar: "🦜", xp: 615 },
  { id: "u6", name: "Diego", avatar: "🐨", xp: 480 },
  { id: "u7", name: "Zara", avatar: "🦁", xp: 360 },
  { id: "u8", name: "Luca", avatar: "🐸", xp: 210 },
];
