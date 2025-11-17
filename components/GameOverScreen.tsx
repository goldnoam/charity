import React from 'react';
import HighscoreTable from './HighscoreTable';

interface GameOverScreenProps {
  finalScore: number;
  highscores: number[];
  onPlayAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ finalScore, highscores, onPlayAgain }) => {
  const isNewHighscore = highscores.length < 5 || finalScore > highscores[highscores.length -1] || highscores.length === 0;

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-red-100 to-yellow-200 dark:from-red-900 dark:to-yellow-900">
        <div className="text-center mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl max-w-2xl w-full">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">Game Over</h1>
            <p className="mt-4 text-xl text-slate-700 dark:text-slate-200">Your final charity score is:</p>
            <p className="my-4 text-7xl font-mono font-bold text-red-500">{finalScore} NIS</p>
            {isNewHighscore && finalScore > 0 && (
                 <p className="p-3 bg-yellow-200 text-yellow-800 font-bold rounded-lg text-lg animate-pulse">
                    🎉 New Highscore! 🎉
                </p>
            )}
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="flex flex-col items-center gap-6">
                <button
                    onClick={onPlayAgain}
                    className="px-12 py-4 bg-blue-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    Play Again
                </button>
            </div>
            <HighscoreTable scores={highscores} title="Final Highscores" />
        </div>
    </div>
  );
};

export default GameOverScreen;
