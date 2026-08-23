/**
 * CAREEROS - Centralized Difficulty-Aware Coding Rewards Engine
 * Enforces strict reward tiers: Easy = 10 XP, Medium = 20 XP, Hard = 30 XP.
 * Awards points strictly upon passing all test cases. Failed/empty attempts award 0 points and allow retries.
 */

export interface RewardEvaluation {
  pointsAwarded: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isPassed: boolean;
  status: 'passed' | 'retry_allowed';
  message: string;
}

export function getDifficultyPoints(difficulty: string = 'Easy'): number {
  const diff = String(difficulty || '').trim().toLowerCase();
  if (diff === 'hard') return 30;
  if (diff === 'medium') return 20;
  return 10; // Easy = 10
}

export function evaluateCodingSubmissionReward(params: {
  difficulty: string;
  isCorrect: boolean;
  testCasesPassed: number;
  totalTestCases: number;
  executionStatus?: string;
}): RewardEvaluation {
  const diffStr = String(params.difficulty || 'Easy').trim();
  const normalizedDiff: 'Easy' | 'Medium' | 'Hard' =
    diffStr.toLowerCase() === 'hard' ? 'Hard' : diffStr.toLowerCase() === 'medium' ? 'Medium' : 'Easy';

  const isAllPassed =
    params.isCorrect &&
    params.testCasesPassed > 0 &&
    params.testCasesPassed >= params.totalTestCases &&
    params.executionStatus === 'passed';

  if (isAllPassed) {
    const points = getDifficultyPoints(normalizedDiff);
    return {
      pointsAwarded: points,
      difficulty: normalizedDiff,
      isPassed: true,
      status: 'passed',
      message: `🎉 Challenge Cleared! +${points} XP Awarded (${normalizedDiff} Tier).`,
    };
  }

  return {
    pointsAwarded: 0,
    difficulty: normalizedDiff,
    isPassed: false,
    status: 'retry_allowed',
    message: 'Test case validation incomplete. 0 points awarded. Review your logic and retry.',
  };
}
