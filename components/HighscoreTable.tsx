import React from 'react';

interface HighscoreTableProps {
  scores: number[];
  title?: string;
}

const TrophyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v1h1a1 1 0 010 2h-1v1a1 1 0 01-1 1H6a1 1 0 01-1-1V8H4a1 1 0 010-2h1V5zM6 8v1h8V8H6z" clipRule="evenodd" />
        <path d="M18 11H2v2h16v-2zM2 15h16v2H2v-2z" />
    </svg>
);


const HighscoreTable: React.FC<HighscoreTableProps> = ({ scores, title = 'Highscores' }) => {
  return (
    <div className="w-full max-w-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-center text-slate-700 dark:text-slate-200 mb-4 flex items-center justify-center">
        <TrophyIcon />
        {title}
      </h2>
      {scores.length > 0 ? (
        <ol className="list-decimal list-inside space-y-2 text-lg text-slate-600 dark:text-slate-300">
          {scores.map((score, index) => (
            <li key={index} className="flex justify-between items-center p-2 rounded-md bg-sky-100/50 dark:bg-sky-900/50">
              <span className="font-semibold">{(index + 1)}.</span>
              <span className="font-mono">{score} NIS</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-center text-slate-500 dark:text-slate-400 italic">No highscores yet. Be the first!</p>
      )}
    </div>
  );
};

export default HighscoreTable;
