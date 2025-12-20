'use client';

import React from 'react';
import useGameStore from '../../../stores/useGameStore';

export default function GameOver() {
  const setGameState = useGameStore((s) => s.setGameState);
  const resetGame = useGameStore((s) => s.resetGame);
  const score = useGameStore((s) => s.score);
  const stageId = useGameStore((s) => s.stageId);

  const onReturnToMenu = () => {
    setGameState('menu');
  };

  const onRestart = () => {
    resetGame(true);
    setGameState('playing');
  };

  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-75 z-40" />

      {/* Main content */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="text-center text-white max-w-lg mx-auto p-8 bg-black bg-opacity-60 rounded-xl shadow-2xl border border-red-500 border-opacity-50">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-7xl font-black text-red-500 mb-4 drop-shadow-2xl">GAME OVER</h1>
            <div className="w-32 h-1 bg-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Game info */}
          <div className="bg-black bg-opacity-50 rounded-lg p-6 mb-8 border border-gray-600">
            <div className="grid grid-cols-2 gap-4 text-lg">
              <div className="text-left">
                <p className="text-gray-400 text-sm uppercase tracking-wider">Stage</p>
                <p className="text-white font-semibold">
                  {stageId === 'stage0' ? 'Stage 1' : 'Stage 2'}
                </p>
              </div>
              <div className="text-left">
                <p className="text-gray-400 text-sm uppercase tracking-wider">Score</p>
                <p className="text-yellow-400 font-bold text-xl">{score.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={onRestart}
              className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition-all duration-200 shadow-lg border-2 border-blue-500"
            >
              RESTART GAME
            </button>
            <button
              onClick={onReturnToMenu}
              className="px-12 py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold text-lg rounded-lg transition-all duration-200 shadow-lg border-2 border-gray-500"
            >
              MAIN MENU
            </button>
          </div>

          {/* Additional message */}
          <p className="text-gray-400 text-sm mt-6">Better luck next time!</p>
        </div>
      </div>
    </>
  );
}
