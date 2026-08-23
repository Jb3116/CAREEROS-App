/**
 * CAREEROS - Real Language Learning Engine & Scalable Curriculum Architecture
 * Multi-type interactive exercises, strict prerequisite locking,
 * intelligent answer normalization, and 0% initial state for all new users.
 */

export type ExerciseType =
  | 'multiple_choice'
  | 'translation'
  | 'fill_in_the_blank'
  | 'word_ordering'
  | 'matching'
  | 'listening';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type SkillType = 'speaking' | 'listening' | 'reading' | 'writing';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  skillType: SkillType;
  prompt: string;
  instruction: string;
  explanation: string;
  audioText?: string;
  audioLang?: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple_choice';
  options: string[];
  correctIndex: number;
}

export interface TranslationExercise extends BaseExercise {
  type: 'translation';
  sourcePhrase: string;
  expectedAnswer: string;
  acceptableAnswers?: string[];
}

export interface FillInTheBlankExercise extends BaseExercise {
  type: 'fill_in_the_blank';
  sentenceWithBlank: string; // e.g. "Wir nutzen Redis, weil es sehr schnell [blank]."
  expectedAnswer: string;
  acceptableAnswers?: string[];
  options?: string[];
}

export interface WordOrderingExercise extends BaseExercise {
  type: 'word_ordering';
  words: string[];
  correctOrder: string[];
}

export interface MatchingExercise extends BaseExercise {
  type: 'matching';
  pairs: Array<{ term: string; match: string }>;
}

export interface ListeningExercise extends BaseExercise {
  type: 'listening';
  audioText: string;
  expectedAnswer: string;
  acceptableAnswers?: string[];
  options?: string[];
}

export type Exercise =
  | MultipleChoiceExercise
  | TranslationExercise
  | FillInTheBlankExercise
  | WordOrderingExercise
  | MatchingExercise
  | ListeningExercise;

export interface Lesson {
  id: string;
  lessonNumber: number;
  title: string;
  cefrLevel: CEFRLevel;
  category: 'vocabulary' | 'grammar' | 'speaking' | 'workplace' | 'checkpoint';
  description: string;
  prerequisiteLessonId?: string | null;
  exercises: Exercise[];
  passingScorePercent: number; // e.g., 70
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  title: string;
  cefrLevel: CEFRLevel;
  description: string;
  lessons: Lesson[];
}

export interface SkillMatrix {
  speaking: number;  // 0 - 100%
  listening: number; // 0 - 100%
  reading: number;   // 0 - 100%
  writing: number;   // 0 - 100%
}

export interface LanguageProfile {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  initialCefrLevel: CEFRLevel;
  targetRole: string;
  units: CurriculumUnit[];
  examReadiness?: {
    requiredCompletedLessons: number;
    requiredAccuracy: number;
    targetLevel: CEFRLevel;
    examNames: string[];
    officialBodies: string[];
    formatSummary: string;
    officialLinks: Array<{ name: string; url: string }>;
  };
}

export interface LanguageProgressState {
  cefrLevel: CEFRLevel;
  courseProgressPercent: number;
  streak: number;
  lastPracticed: string | null;
  completedLessonIds: string[];
  completedExerciseIds: string[];
  skillMatrix: SkillMatrix;
  totalQuestionsAnswered: number;
  correctAnswersCount: number;
}

// ---------------- CURRICULUM REGISTRY (Distinct, Real Lesson Trees) ----------------

export const LANGUAGES_DATA: Record<string, LanguageProfile> = {
  german: {
    id: 'german',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    initialCefrLevel: 'A1',
    targetRole: 'European Tech Hubs (Berlin, Munich, Zurich)',
    examReadiness: {
      requiredCompletedLessons: 4,
      requiredAccuracy: 75,
      targetLevel: 'A2',
      examNames: ['Goethe-Zertifikat A2', 'telc Deutsch A2'],
      officialBodies: ['Goethe-Institut e.V.', 'telc gGmbH (The European Language Certificates)'],
      formatSummary:
        '4 Standard CEFR Examination Modules: Lesen (Reading - 30 mins), Hören (Listening - 30 mins), Schreiben (Writing - 30 mins), and Sprechen (Speaking Oral Group Exam - 15 mins). Officially accredited for German EU Blue Card & Work Visa applications.',
      officialLinks: [
        { name: 'Goethe-Institut Official Portal', url: 'https://www.goethe.de/' },
        { name: 'telc Deutsch Certification Center', url: 'https://www.telc.net/' },
      ],
    },
    units: [
      {
        id: 'de-unit-1',
        unitNumber: 1,
        title: 'Unit 1: Engineering Foundations & Tech Vocabulary',
        cefrLevel: 'A1',
        description: 'Core greetings, numbers, and basic engineering workplace terms.',
        lessons: [
          {
            id: 'de-lesson-1',
            lessonNumber: 1,
            title: 'Technical Roles & Workplace Greetings',
            cefrLevel: 'A1',
            category: 'vocabulary',
            description: 'Learn German nouns for developer roles and daily greetings.',
            prerequisiteLessonId: null, // First lesson is unlocked
            passingScorePercent: 70,
            exercises: [
              {
                id: 'de-ex-1',
                type: 'multiple_choice',
                skillType: 'reading',
                prompt: 'What is the German term for "Software Developer"?',
                instruction: 'Select the correct technical noun.',
                options: ['Der Softwareentwickler', 'Der Bauingenieur', 'Der Rechtsanwalt', 'Der Buchhalter'],
                correctIndex: 0,
                explanation: '"Der Softwareentwickler" is the standard German noun for software engineer/developer.',
                audioText: 'Der Softwareentwickler',
                audioLang: 'de-DE',
              },
              {
                id: 'de-ex-2',
                type: 'translation',
                skillType: 'writing',
                prompt: 'Translate to German: "I work as a developer"',
                instruction: 'Type your German translation.',
                sourcePhrase: 'I work as a developer',
                expectedAnswer: 'Ich arbeite als Entwickler',
                acceptableAnswers: [
                  'Ich arbeite als Entwickler',
                  'Ich arbeite als Softwareentwickler',
                  'Ich bin als Entwickler tätig',
                ],
                explanation: '"Ich arbeite als Entwickler" uses the preposition "als" to denote professional role.',
                audioText: 'Ich arbeite als Entwickler',
                audioLang: 'de-DE',
              },
              {
                id: 'de-ex-3',
                type: 'matching',
                skillType: 'reading',
                prompt: 'Match the German technical terms with their English definitions:',
                instruction: 'Connect each German word with its correct English meaning.',
                pairs: [
                  { term: 'Die Datenbank', match: 'Database' },
                  { term: 'Der Quellcode', match: 'Source Code' },
                  { term: 'Das Netzwerk', match: 'Network' },
                ],
                explanation: 'Accurate vocabulary association for database, source code, and network.',
              },
            ],
          },
          {
            id: 'de-lesson-2',
            lessonNumber: 2,
            title: 'System Architecture & Infrastructure Vocabulary',
            cefrLevel: 'A1',
            category: 'vocabulary',
            description: 'Learn terminology for servers, cloud infrastructure, and databases.',
            prerequisiteLessonId: 'de-lesson-1', // Locked until Lesson 1 is completed!
            passingScorePercent: 70,
            exercises: [
              {
                id: 'de-ex-4',
                type: 'fill_in_the_blank',
                skillType: 'reading',
                prompt: 'Fill in the blank with the correct noun:',
                instruction: 'Complete the sentence with the appropriate German tech word.',
                sentenceWithBlank: 'Unsere Daten werden in der [blank] gespeichert.',
                expectedAnswer: 'Datenbank',
                acceptableAnswers: ['Datenbank', 'Cloud'],
                options: ['Datenbank', 'Tastatur', 'Maus', 'Schreibtisch'],
                explanation: '"in der Datenbank gespeichert" means "stored in the database".',
                audioText: 'Unsere Daten werden in der Datenbank gespeichert.',
                audioLang: 'de-DE',
              },
              {
                id: 'de-ex-5',
                type: 'listening',
                skillType: 'listening',
                prompt: 'Listen to the audio and transcribe the German technical sentence:',
                instruction: 'Click listen and write the sentence accurately.',
                audioText: 'Der Server ist online',
                audioLang: 'de-DE',
                expectedAnswer: 'Der Server ist online',
                acceptableAnswers: ['Der Server ist online', 'Der Server ist online.'],
                explanation: '"Der Server ist online" is the standard phrase for server availability.',
              },
            ],
          },
        ],
      },
      {
        id: 'de-unit-2',
        unitNumber: 2,
        title: 'Unit 2: German Grammar & Word Order in Tech',
        cefrLevel: 'A2',
        description: 'Master V2 verb rules, subordinate clauses (weil, obwohl), and modal verbs.',
        lessons: [
          {
            id: 'de-lesson-3',
            lessonNumber: 3,
            title: 'Subordinate Clauses & Tech Connectors (weil / dass)',
            cefrLevel: 'A2',
            category: 'grammar',
            description: 'Understand how German subordinate clauses move the conjugated verb to the end.',
            prerequisiteLessonId: 'de-lesson-2', // Locked until Lesson 2 is completed!
            passingScorePercent: 70,
            exercises: [
              {
                id: 'de-ex-6',
                type: 'word_ordering',
                skillType: 'writing',
                prompt: 'Arrange the scrambled words into the correct German subordinate clause order:',
                instruction: 'Click the chips in order to construct the sentence.',
                words: ['Wir', 'nutzen', 'Redis,', 'weil', 'es', 'sehr', 'schnell', 'ist.'],
                correctOrder: ['Wir', 'nutzen', 'Redis,', 'weil', 'es', 'sehr', 'schnell', 'ist.'],
                explanation: 'Conjunction "weil" sends the conjugated verb "ist" to the final position of the clause.',
                audioText: 'Wir nutzen Redis, weil es sehr schnell ist.',
                audioLang: 'de-DE',
              },
              {
                id: 'de-ex-7',
                type: 'multiple_choice',
                skillType: 'reading',
                prompt: 'Which modal verb expresses strict requirement in API documentation ("The API must respond in 50ms")?',
                instruction: 'Select the appropriate conjugated modal verb.',
                options: ['muss', 'kann', 'will', 'darf'],
                correctIndex: 0,
                explanation: '"Müssen" (muss) expresses strict requirement/necessity in technical documentation.',
                audioText: 'Die API muss in 50 Millisekunden antworten.',
                audioLang: 'de-DE',
              },
            ],
          },
          {
            id: 'de-lesson-4',
            lessonNumber: 4,
            title: 'Scrum Standups & Sprint Communication',
            cefrLevel: 'A2',
            category: 'workplace',
            description: 'Speak fluently about completed tasks, current PRs, and blockers in German standups.',
            prerequisiteLessonId: 'de-lesson-3', // Locked until Lesson 3 is completed!
            passingScorePercent: 70,
            exercises: [
              {
                id: 'de-ex-8',
                type: 'word_ordering',
                skillType: 'speaking',
                prompt: 'Build the German daily standup status update:',
                instruction: 'Order the words properly according to German Time-Manner-Place structure.',
                words: ['Gestern', 'habe', 'ich', 'den', 'Bug', 'behoben.'],
                correctOrder: ['Gestern', 'habe', 'ich', 'den', 'Bug', 'behoben.'],
                explanation: 'German V2 word order places the auxiliary verb "habe" in second position after time indicator "Gestern".',
                audioText: 'Gestern habe ich den Bug behoben.',
                audioLang: 'de-DE',
              },
            ],
          },
        ],
      },
    ],
  },

  english: {
    id: 'english',
    name: 'English',
    nativeName: 'English (US/UK)',
    flag: '🇺🇸',
    initialCefrLevel: 'B2',
    targetRole: 'Global Tier-1 Placements & Tech Giants',
    units: [
      {
        id: 'en-unit-1',
        unitNumber: 1,
        title: 'Unit 1: Executive Action Verbs & System Architecture',
        cefrLevel: 'B2',
        description: 'Replace passive language with high-impact Tier-1 engineering action verbs.',
        lessons: [
          {
            id: 'en-lesson-1',
            lessonNumber: 1,
            title: 'Action Verbs for System Design & Performance',
            cefrLevel: 'B2',
            category: 'vocabulary',
            description: 'Master powerful engineering verbs (architected, benchmarked, orchestrated, mitigated).',
            prerequisiteLessonId: null, // First lesson is unlocked
            passingScorePercent: 70,
            exercises: [
              {
                id: 'en-ex-1',
                type: 'multiple_choice',
                skillType: 'reading',
                prompt: 'Which verb most powerfully replaces "I made the database faster"?',
                instruction: 'Choose the highest-impact action verb phrase.',
                options: [
                  'Optimized and benchmarked query execution plans',
                  'Did some fast database work',
                  'Helped with SQL speed',
                  'Created faster tables',
                ],
                correctIndex: 0,
                explanation: '"Optimized and benchmarked" proves rigorous technical measurement and execution.',
              },
              {
                id: 'en-ex-2',
                type: 'translation',
                skillType: 'writing',
                prompt: 'Refactor this sentence for an SDE resume: "I handled the servers when they failed"',
                instruction: 'Type an impactful engineering statement using "mitigated" or "orchestrated".',
                sourcePhrase: 'I handled the servers when they failed',
                expectedAnswer: 'Mitigated server downtime and orchestrated automated failover',
                acceptableAnswers: [
                  'Mitigated server downtime and orchestrated automated failover',
                  'Mitigated downtime and orchestrated automated failover',
                  'Orchestrated automated failover and mitigated downtime',
                ],
                explanation: '"Mitigated downtime and orchestrated automated failover" conveys high-reliability engineering.',
              },
            ],
          },
          {
            id: 'en-lesson-2',
            lessonNumber: 2,
            title: 'STAR Method Storytelling & Behavioral Fluency',
            cefrLevel: 'C1',
            category: 'speaking',
            description: 'Structure 90-second behavioral answers with quantifiable metrics and engineering depth.',
            prerequisiteLessonId: 'en-lesson-1', // Locked until Lesson 1 is completed!
            passingScorePercent: 70,
            exercises: [
              {
                id: 'en-ex-3',
                type: 'multiple_choice',
                skillType: 'speaking',
                prompt: 'What is the most critical element of the "Result" in a STAR interview response?',
                instruction: 'Select the defining trait of top-tier behavioral answers.',
                options: [
                  'Quantifiable business or technical metrics (% improvement, latency reduction, user count)',
                  'Saying that everyone was happy',
                  'Listing every tool used',
                  'Talking about future plans',
                ],
                correctIndex: 0,
                explanation: 'Quantified metrics prove the real business impact of your engineering actions.',
              },
            ],
          },
        ],
      },
    ],
  },

  spanish: {
    id: 'spanish',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    initialCefrLevel: 'A1',
    targetRole: 'Latin America & European Tech Teams',
    units: [
      {
        id: 'es-unit-1',
        unitNumber: 1,
        title: 'Unit 1: Vocabulario Técnico y Desarrollo Web',
        cefrLevel: 'A1',
        description: 'Learn Spanish terminology for frontend components, backend APIs, and databases.',
        lessons: [
          {
            id: 'es-lesson-1',
            lessonNumber: 1,
            title: 'Conceptos Básicos de Servidores y APIs',
            cefrLevel: 'A1',
            category: 'vocabulary',
            description: 'Vocabulario esencial de desarrollo web y respuestas HTTP.',
            prerequisiteLessonId: null,
            passingScorePercent: 70,
            exercises: [
              {
                id: 'es-ex-1',
                type: 'multiple_choice',
                skillType: 'reading',
                prompt: 'How do you say "The server is responding with status 200 OK"?',
                instruction: 'Select the proper technical Spanish phrase.',
                options: [
                  'El servidor está respondiendo con estado 200 OK',
                  'La computadora está apagada',
                  'No hay internet en la oficina',
                  'El código tiene muchos errores',
                ],
                correctIndex: 0,
                explanation: '"El servidor está respondiendo con estado 200 OK" is proper technical Spanish.',
                audioText: 'El servidor está respondiendo con estado 200 OK',
                audioLang: 'es-ES',
              },
            ],
          },
        ],
      },
    ],
  },

  french: {
    id: 'french',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    initialCefrLevel: 'A1',
    targetRole: 'French Tech Hubs (Paris, Lyon, Montreal)',
    units: [
      {
        id: 'fr-unit-1',
        unitNumber: 1,
        title: 'Unit 1: Bases Techniques et Collaboration',
        cefrLevel: 'A1',
        description: 'Core French greetings, programming terms, and daily team interactions.',
        lessons: [
          {
            id: 'fr-lesson-1',
            lessonNumber: 1,
            title: 'Introduction au Génie Logiciel',
            cefrLevel: 'A1',
            category: 'vocabulary',
            description: 'Vocabulaire informatique et communication d’équipe.',
            prerequisiteLessonId: null,
            passingScorePercent: 70,
            exercises: [
              {
                id: 'fr-ex-1',
                type: 'multiple_choice',
                skillType: 'listening',
                prompt: 'What is the French term for "software engineering"?',
                instruction: 'Select the correct professional term.',
                options: ['Le génie logiciel', 'La cuisine française', 'Le droit civil', 'La comptabilité'],
                correctIndex: 0,
                explanation: '"Le génie logiciel" is software engineering in French.',
                audioText: 'Le génie logiciel',
                audioLang: 'fr-FR',
              },
            ],
          },
        ],
      },
    ],
  },

  japanese: {
    id: 'japanese',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    initialCefrLevel: 'A1',
    targetRole: 'Tokyo Tech Firms & Remote Global Teams',
    units: [
      {
        id: 'ja-unit-1',
        unitNumber: 1,
        title: 'Unit 1: IT Japanese & Workplace Greetings',
        cefrLevel: 'A1',
        description: 'Business Japanese (Keigo), morning standups, and IT terminology.',
        lessons: [
          {
            id: 'ja-lesson-1',
            lessonNumber: 1,
            title: 'Daily Standup & Problem Resolution',
            cefrLevel: 'A1',
            category: 'vocabulary',
            description: 'Phrases for debugging and reporting task status.',
            prerequisiteLessonId: null,
            passingScorePercent: 70,
            exercises: [
              {
                id: 'ja-ex-1',
                type: 'multiple_choice',
                skillType: 'reading',
                prompt: 'What does "Kaiketsu shimashita" (解決しました) mean after debugging?',
                instruction: 'Select the accurate meaning.',
                options: [
                  'I have resolved / solved the issue',
                  'The system crashed',
                  'I am starting now',
                  'Please help me',
                ],
                correctIndex: 0,
                explanation: '"Kaiketsu shimashita" means "It has been solved / resolved".',
                audioText: '解決しました',
                audioLang: 'ja-JP',
              },
            ],
          },
        ],
      },
    ],
  },
};

// ---------------- HELPER FUNCTIONS & EXERCISE EVALUATOR ----------------

/**
 * Normalizes strings for intelligent case-insensitive, punctuation-tolerant comparison
 */
export function normalizeString(str: string = ''): string {
  return str
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'äÄöÖüÜß]/g, (match) => {
      // Preserve German umlauts mapping
      if (match === 'ä' || match === 'Ä') return 'ae';
      if (match === 'ö' || match === 'Ö') return 'oe';
      if (match === 'ü' || match === 'Ü') return 'ue';
      if (match === 'ß') return 'ss';
      return '';
    })
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligent Exercise Evaluation Engine
 */
export function evaluateExerciseAnswer(exercise: Exercise, userAnswer: any): {
  isCorrect: boolean;
  feedback: string;
} {
  switch (exercise.type) {
    case 'multiple_choice': {
      const isCorrect = Number(userAnswer) === exercise.correctIndex;
      return {
        isCorrect,
        feedback: isCorrect
          ? `✓ Correct! ${exercise.explanation}`
          : `✗ Incorrect. Expected: "${exercise.options[exercise.correctIndex]}". ${exercise.explanation}`,
      };
    }

    case 'translation': {
      const userNorm = normalizeString(String(userAnswer || ''));
      const expectedNorm = normalizeString(exercise.expectedAnswer);
      const acceptableNorms = (exercise.acceptableAnswers || []).map(normalizeString);

      const isCorrect = userNorm === expectedNorm || acceptableNorms.includes(userNorm);
      return {
        isCorrect,
        feedback: isCorrect
          ? `✓ Outstanding translation! ${exercise.explanation}`
          : `✗ Expected: "${exercise.expectedAnswer}". ${exercise.explanation}`,
      };
    }

    case 'fill_in_the_blank': {
      const userNorm = normalizeString(String(userAnswer || ''));
      const expectedNorm = normalizeString(exercise.expectedAnswer);
      const acceptableNorms = (exercise.acceptableAnswers || []).map(normalizeString);

      const isCorrect = userNorm === expectedNorm || acceptableNorms.includes(userNorm);
      return {
        isCorrect,
        feedback: isCorrect
          ? `✓ Correct word! ${exercise.explanation}`
          : `✗ Expected: "${exercise.expectedAnswer}". ${exercise.explanation}`,
      };
    }

    case 'word_ordering': {
      const userWords: string[] = Array.isArray(userAnswer) ? userAnswer : [];
      const userStr = userWords.map(normalizeString).join(' ');
      const targetStr = exercise.correctOrder.map(normalizeString).join(' ');

      const isCorrect = userStr === targetStr;
      return {
        isCorrect,
        feedback: isCorrect
          ? `✓ Perfect word order! ${exercise.explanation}`
          : `✗ Correct sequence: "${exercise.correctOrder.join(' ')}". ${exercise.explanation}`,
      };
    }

    case 'matching': {
      // userAnswer: Record<string, string> where term -> match
      const userMatches = typeof userAnswer === 'object' && userAnswer !== null ? userAnswer : {};
      let matchesAll = true;
      for (const pair of exercise.pairs) {
        if (userMatches[pair.term] !== pair.match) {
          matchesAll = false;
          break;
        }
      }
      return {
        isCorrect: matchesAll,
        feedback: matchesAll
          ? `✓ All pairs matched correctly! ${exercise.explanation}`
          : `✗ Some matches were incorrect. ${exercise.explanation}`,
      };
    }

    case 'listening': {
      const userNorm = normalizeString(String(userAnswer || ''));
      const expectedNorm = normalizeString(exercise.expectedAnswer);
      const acceptableNorms = (exercise.acceptableAnswers || []).map(normalizeString);

      const isCorrect = userNorm === expectedNorm || acceptableNorms.includes(userNorm);
      return {
        isCorrect,
        feedback: isCorrect
          ? `✓ Great listening comprehension! ${exercise.explanation}`
          : `✗ Expected: "${exercise.expectedAnswer}". ${exercise.explanation}`,
      };
    }

    default:
      return { isCorrect: false, feedback: 'Unsupported exercise type.' };
  }
}

/**
 * Get all lessons flat array for a given language
 */
export function getAllLessonsForLanguage(languageId: string): Lesson[] {
  const profile = LANGUAGES_DATA[languageId] || LANGUAGES_DATA.german;
  return profile.units.flatMap((u) => u.lessons);
}

/**
 * Storage key for isolated per-language progression
 */
export function getLanguageStorageKey(languageId: string, studentId: string = 's123'): string {
  return `careeros_lang_curriculum_${languageId}_${studentId}`;
}

/**
 * Load isolated language progress.
 * CRITICAL RULE: Starts at 0% for all new users!
 */
export function loadLanguageProgress(languageId: string, studentId: string = 's123'): LanguageProgressState {
  const profile = LANGUAGES_DATA[languageId] || LANGUAGES_DATA.german;

  const defaultFreshState: LanguageProgressState = {
    cefrLevel: profile.initialCefrLevel,
    courseProgressPercent: 0, // Starts strictly at 0%
    streak: 0,
    lastPracticed: null,
    completedLessonIds: [],   // No pre-completed lessons for new users
    completedExerciseIds: [],
    skillMatrix: {
      speaking: 0,
      listening: 0,
      reading: 0,
      writing: 0,
    },
    totalQuestionsAnswered: 0,
    correctAnswersCount: 0,
  };

  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(getLanguageStorageKey(languageId, studentId));
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure progress percentage is strictly derived from completed lessons
        const allLessons = getAllLessonsForLanguage(languageId);
        const completedCount = (parsed.completedLessonIds || []).length;
        parsed.courseProgressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
        return parsed;
      }
    }
  } catch {}

  return defaultFreshState;
}

/**
 * Save isolated language progress
 */
export function saveLanguageProgress(
  languageId: string,
  progress: LanguageProgressState,
  studentId: string = 's123'
): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(getLanguageStorageKey(languageId, studentId), JSON.stringify(progress));
    }
  } catch {}
}

/**
 * Check if a lesson is locked based on prerequisite completion
 */
export function isLessonLocked(lesson: Lesson, completedLessonIds: string[]): boolean {
  if (!lesson.prerequisiteLessonId) {
    return false; // Root lessons with no prerequisites are unlocked
  }
  return !completedLessonIds.includes(lesson.prerequisiteLessonId);
}

/**
 * Check if user has reached German A2 certification readiness
 */
export function checkGermanA2Readiness(progress: LanguageProgressState): boolean {
  const accuracy =
    progress.totalQuestionsAnswered > 0
      ? (progress.correctAnswersCount / progress.totalQuestionsAnswered) * 100
      : 0;
  return progress.completedLessonIds.length >= 4 && accuracy >= 75;
}
