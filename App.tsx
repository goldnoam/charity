import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Difficulty } from './types';
import { DIFFICULTIES, MAX_HIGHSCORES, HIGHSCORE_STORAGE_KEY } from './constants';
import { playTransitionSound } from './utils/sounds';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import StageSummary from './components/StageSummary';
import GameOverScreen from './components/GameOverScreen';

const ThemeToggle: React.FC<{ theme: 'light' | 'dark'; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-yellow-300 flex items-center justify-center text-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
);

const AppFooter: React.FC = () => (
    <footer className="fixed bottom-0 left-0 right-0 p-2 text-center text-xs text-slate-500 dark:text-slate-400 bg-sky-50/80 dark:bg-slate-900/80 backdrop-blur-sm">
        (C) Noam Gold AI 2025 | <a href="mailto:gold.noam@gmail.com" className="underline hover:text-blue-500 dark:hover:text-blue-400">Send Feedback</a>
    </footer>
);


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [stage, setStage] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [highscores, setHighscores] = useState<number[]>([]);
  const [lastStageStats, setLastStageStats] = useState({ given: 0, returned: 0, remaining: 0 });
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentBudget, setCurrentBudget] = useState(0);

  useEffect(() => {
    try {
      const storedScores = localStorage.getItem(HIGHSCORE_STORAGE_KEY);
      if (storedScores) {
        setHighscores(JSON.parse(storedScores));
      }
      const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (storedTheme) {
          setTheme(storedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark');
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
      setTheme(prev => {
          const newTheme = prev === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme', newTheme);
          return newTheme;
      });
  }, []);

  const updateHighscores = useCallback((score: number) => {
    if (score === 0) return;
    const newScores = [...highscores, score]
      .sort((a, b) => b - a)
      .slice(0, MAX_HIGHSCORES);
    setHighscores(newScores);
    try {
      localStorage.setItem(HIGHSCORE_STORAGE_KEY, JSON.stringify(newScores));
    } catch (error) {
      console.error("Failed to save highscores to localStorage", error);
    }
  }, [highscores]);

  const startGame = (selectedDifficulty: Difficulty) => {
    playTransitionSound();
    setDifficulty(selectedDifficulty);
    setStage(1);
    setTotalScore(0);
    setCurrentBudget(DIFFICULTIES[selectedDifficulty].baseBudget);
    setGameState('playing');
  };
  
  const handleStageEnd = (charityGivenInStage: number, remainingBudget: number) => {
    if (!difficulty) return;
    const moneyReturned = Math.floor(Math.random() * (charityGivenInStage * DIFFICULTIES[difficulty].rewardMultiplier));
    setLastStageStats({ given: charityGivenInStage, returned: moneyReturned, remaining: remainingBudget });
    setTotalScore(prev => prev + charityGivenInStage);
    setGameState('stage-summary');
  };

  const handleNextStage = () => {
    if (!difficulty) return;
    playTransitionSound();
    setStage(prev => prev + 1);
    // New budget = base budget + kindness reward + money left from last stage
    setCurrentBudget(DIFFICULTIES[difficulty].baseBudget + lastStageStats.returned + lastStageStats.remaining);
    setGameState('playing');
  };

  const handleGameEnd = () => {
    updateHighscores(totalScore);
    setGameState('game-over');
  };

  const handlePlayAgain = () => {
    playTransitionSound();
    setGameState('start');
  };

  const renderContent = () => {
    if (!difficulty && gameState !== 'start') {
        // Fallback in case difficulty is not set
        return <StartScreen onStart={startGame} highscores={highscores} />;
    }
    
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={startGame} highscores={highscores} />;
      case 'playing':
        // Duration gets shorter each stage by 1 second, with a minimum of 10 seconds.
        const baseDuration = DIFFICULTIES[difficulty!].duration;
        const currentDuration = Math.max(10, baseDuration - (stage - 1));
        return <GameScreen 
                  stage={stage} 
                  totalScore={totalScore}
                  initialBudget={currentBudget}
                  duration={currentDuration}
                  onStageEnd={handleStageEnd}
                  onGameEnd={handleGameEnd} 
                />;
      case 'stage-summary':
        const nextBudget = DIFFICULTIES[difficulty!].baseBudget + lastStageStats.returned + lastStageStats.remaining;
        return <StageSummary 
                  stage={stage} 
                  charityGiven={lastStageStats.given} 
                  moneyReturned={lastStageStats.returned} 
                  nextBudget={nextBudget}
                  onNextStage={handleNextStage} 
                />;
      case 'game-over':
        return <GameOverScreen 
                  finalScore={totalScore} 
                  highscores={highscores} 
                  onPlayAgain={handlePlayAgain}
                />;
      default:
        return <StartScreen onStart={startGame} highscores={highscores} />;
    }
  };

  return (
    <div className={theme}>
        <div className="font-sans dark:bg-slate-900 dark:text-slate-200 min-h-screen pb-8">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {renderContent()}
            <AppFooter />
        </div>
    </div>
    );
};

export default App;