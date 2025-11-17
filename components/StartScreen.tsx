import React, { useState } from 'react';
import HighscoreTable from './HighscoreTable';
import { Difficulty } from '../types';
import { DIFFICULTIES } from '../constants';


interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
  highscores: number[];
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, highscores }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-sky-100 to-blue-200 dark:from-slate-800 dark:to-blue-900">
        <div className="text-center mb-8">
            <h1 className="text-5xl sm:text-7xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">Charity Dash</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Select a difficulty, then give away your budget by pressing number keys (0-9).
                Give as much as you can to get the highest score!
            </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="flex flex-col items-center gap-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Choose a Difficulty</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {(Object.keys(DIFFICULTIES) as Difficulty[]).map(key => {
                        const diff = DIFFICULTIES[key];
                        const isSelected = selectedDifficulty === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedDifficulty(key)}
                                className={`px-6 py-2 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${diff.color} ${diff.hover} ${isSelected ? 'ring-4 ring-offset-2 dark:ring-offset-slate-900 ring-blue-400' : ''}`}
                            >
                                {diff.name}
                            </button>
                        )
                    })}
                </div>
                <button
                    onClick={() => selectedDifficulty && onStart(selectedDifficulty)}
                    disabled={!selectedDifficulty}
                    className="w-full mt-4 px-12 py-4 bg-green-500 text-white text-2xl font-bold rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:scale-100 disabled:cursor-not-allowed"
                >
                    Start Game
                </button>
            </div>
            <HighscoreTable scores={highscores} />
        </div>
    </div>
  );
};

export default StartScreen;
