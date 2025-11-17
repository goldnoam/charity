import React, { useState, useEffect, useCallback } from 'react';
import { playSuccessSound, playErrorSound } from '../utils/sounds';

interface GameScreenProps {
  stage: number;
  totalScore: number;
  initialBudget: number;
  duration: number;
  onStageEnd: (charityGiven: number, remainingBudget: number) => void;
  onGameEnd: () => void;
}

const StatCard: React.FC<{ label: string; value: string | number; color: string; icon: React.ReactNode }> = ({ label, value, color, icon }) => (
    <div className={`flex-1 min-w-[120px] p-4 rounded-xl shadow-md text-white ${color}`}>
        <div className="flex items-center gap-3">
            <div className="text-3xl">{icon}</div>
            <div>
                <div className="text-sm uppercase font-bold opacity-80">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    </div>
);

const BudgetBar: React.FC<{ current: number; max: number }> = ({ current, max }) => {
    const percentage = max > 0 ? (current / max) * 100 : 0;
    let barColor = 'bg-green-500';
    if (percentage < 60) barColor = 'bg-yellow-500';
    if (percentage < 30) barColor = 'bg-red-500';

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 shadow-inner overflow-hidden">
            <div
                className={`h-4 rounded-full ${barColor} transition-all duration-300 ease-in-out`}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={0}
                aria-valuemax={max}
            ></div>
        </div>
    );
};


const GameScreen: React.FC<GameScreenProps> = ({ stage, totalScore, initialBudget, duration, onStageEnd, onGameEnd }) => {
  const [time, setTime] = useState(duration);
  const [budget, setBudget] = useState(initialBudget);
  const [personId, setPersonId] = useState(1);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  
  useEffect(() => {
    setBudget(initialBudget);
    setTime(duration);
  }, [initialBudget, duration, stage]);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => setTime(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else {
      onStageEnd(initialBudget - budget, budget);
    }
  }, [time, onStageEnd, initialBudget, budget]);
  
  const handleDonation = useCallback((amount: number) => {
    if (budget - amount >= 0) {
      setBudget(b => b - amount);
      setPersonId(id => id + 1);
      setFeedback('success');
      playSuccessSound();
    } else {
      setFeedback('error');
      playErrorSound();
    }
    setTimeout(() => setFeedback(null), 400);
  }, [budget]);

  // Handle keyboard input for giving charity
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const num = parseInt(event.key, 10);
      if (!isNaN(num) && num >= 0 && num <= 9) {
        handleDonation(num);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleDonation]);

  const feedbackBorderStyle = feedback === 'success' ? 'border-green-500' : feedback === 'error' ? 'border-red-500' : 'border-transparent dark:border-slate-700';
  const feedbackAnimationClass = feedback === 'success' ? 'animate-success-pulse' : feedback === 'error' ? 'animate-error-shake' : '';
  
  const donationAmounts = [1, 5, 10, 25];
  const buttonColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500'];
  const buttonHoverColors = ['hover:bg-green-600', 'hover:bg-blue-600', 'hover:bg-yellow-600', 'hover:bg-purple-600'];
  const buttonRingColors = ['focus:ring-green-300', 'focus:ring-blue-300', 'focus:ring-yellow-300', 'focus:ring-purple-300'];

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-slate-800">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-slate-700 dark:text-slate-200">Stage {stage}</h1>
            <button
              onClick={onGameEnd}
              className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg shadow hover:bg-red-600 transition-colors"
            >
                Stop
            </button>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-4">
            <StatCard label="Time Left" value={`${time}s`} color="bg-blue-500" icon={<span>⏳</span>} />
            <StatCard label="Stage Budget" value={`${budget} NIS`} color="bg-yellow-500" icon={<span>💰</span>} />
            <StatCard label="Total Charity" value={`${totalScore + (initialBudget - budget)} NIS`} color="bg-green-500" icon={<span>💖</span>} />
        </div>
        
        <div className="mb-6">
            <BudgetBar current={budget} max={initialBudget} />
        </div>

        <div className="text-center">
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">Give charity by pressing a number key (0-9) or clicking a button below.</p>
          <div className={`relative w-64 h-80 mx-auto bg-slate-200 dark:bg-slate-600 rounded-2xl shadow-xl overflow-hidden border-4 transition-all duration-200 ${feedbackBorderStyle} ${feedbackAnimationClass}`}>
              <img 
                  key={personId}
                  src={`https://picsum.photos/seed/${personId + stage * 100}/256/320`} 
                  alt="A person on the street" 
                  className="w-full h-full object-cover animate-fade-in"
              />
               <style>{`
                  .animate-fade-in { animation: fadeIn 0.5s; } @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
                  .animate-success-pulse { animation: successPulse 0.3s ease-in-out; }
                  @keyframes successPulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                  }
                  .animate-error-shake { animation: errorShake 0.4s; }
                  @keyframes errorShake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-8px); }
                    40%, 80% { transform: translateX(8px); }
                  }
                `}</style>
          </div>
          {feedback === 'error' && <p className="text-red-500 font-bold mt-2 animate-bounce">Not enough money!</p>}
          <div className="mt-6 flex justify-center flex-wrap gap-2 sm:gap-4">
             {donationAmounts.map((amount, index) => (
                <button
                key={amount}
                onClick={() => handleDonation(amount)}
                disabled={budget < amount}
                className={`px-5 py-3 ${buttonColors[index]} text-white text-xl font-bold rounded-full shadow-lg ${buttonHoverColors[index]} transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 ${buttonRingColors[index]} disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:scale-100 disabled:cursor-not-allowed`}
                >
                {amount} NIS
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;