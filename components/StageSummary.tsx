import React from 'react';

interface StageSummaryProps {
  stage: number;
  charityGiven: number;
  moneyReturned: number;
  nextBudget: number;
  onNextStage: () => void;
}

const StageSummary: React.FC<StageSummaryProps> = ({ stage, charityGiven, moneyReturned, nextBudget, onNextStage }) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-900">
      <div className="text-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-8 sm:p-12 rounded-2xl shadow-2xl max-w-lg w-full">
        <h2 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">Stage {stage} Complete!</h2>
        
        <div className="my-8 space-y-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <p className="text-lg text-green-800 dark:text-green-200">You gave <span className="font-bold text-2xl">{charityGiven} NIS</span> to charity. Amazing!</p>
          </div>
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
            <p className="text-lg text-yellow-800 dark:text-yellow-200">Kindness is rewarding! You received <span className="font-bold text-2xl">{moneyReturned} NIS</span> back.</p>
          </div>
          <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <p className="text-lg text-blue-800 dark:text-blue-200">Your next budget is <span className="font-bold text-2xl">{nextBudget} NIS</span>.</p>
          </div>
        </div>
        
        <button
          onClick={onNextStage}
          className="w-full px-8 py-4 bg-indigo-500 text-white text-xl font-bold rounded-xl shadow-lg hover:bg-indigo-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Start Stage {stage + 1}
        </button>
      </div>
    </div>
  );
};

export default StageSummary;
