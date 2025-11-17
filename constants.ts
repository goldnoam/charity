export const MAX_HIGHSCORES = 5;
export const HIGHSCORE_STORAGE_KEY = 'charityDashHighscores';

export const DIFFICULTIES = {
  Easy: {
    baseBudget: 50,
    duration: 30,
    rewardMultiplier: 0.6,
    name: 'Easy',
    color: 'bg-green-500',
    hover: 'hover:bg-green-600',
    ring: 'focus:ring-green-300'
  },
  Medium: {
    baseBudget: 50,
    duration: 30,
    rewardMultiplier: 0.5,
    name: 'Medium',
    color: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600',
    ring: 'focus:ring-yellow-300'
  },
  Hard: {
    baseBudget: 40,
    duration: 25,
    rewardMultiplier: 0.4,
    name: 'Hard',
    color: 'bg-red-500',
    hover: 'hover:bg-red-600',
    ring: 'focus:ring-red-300'
  },
} as const;
