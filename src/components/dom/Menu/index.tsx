'use client';

import React, { useState } from 'react';
import useGameStore from '../../../stores/useGameStore';
import StartScreen from './StartScreen';
import StageSelect from './StageSelect';

export default function Menu() {
  const setGameState = useGameStore((s) => s.setGameState);
  const stageId = useGameStore((s) => s.stageId);
  const setStageId = useGameStore((s) => s.setStageId);
  const resetGame = useGameStore((s) => s.resetGame);
  const setLevel = useGameStore((s) => s.setLevel);

  const [step, setStep] = useState<'title' | 'stage' | 'level'>('title');
  const [localStage, setLocalStage] = useState(stageId);

  const goToStageSelect = () => setStep('stage');
  const goToTitle = () => setStep('title');
  const goToLevelSelect = () => setStep('level');

  const onStartGame = () => {
    // 選択ステージを反映してゲーム開始
    setStageId(localStage);
    resetGame(true);
    setGameState('playing');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.8))',
        zIndex: 40,
        color: 'white',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {step === 'title' && <StartScreen onStart={goToStageSelect} />}

      {step === 'stage' && (
        <StageSelect
          localStage={localStage}
          setLocalStage={setLocalStage}
          onNext={goToLevelSelect}
          onBack={goToTitle}
        />
      )}

      {step === 'level' && (
        <>
          {/* Level select full-screen layout with background image - show full image without dark overlay */}
          <div
            style={{
              position: 'relative',
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // set background via CSS so it behaves as a fixed cover background
              backgroundImage: "url('/textures/2D_UI/level.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
            }}
          >
            {/* Content wrapper (no descriptive text) */}
            <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
              {/* Invisible hit zones for levels (percent-based) */}
              <button
                aria-label="Level-1"
                onClick={() => {
                  setLevel(1);
                  onStartGame();
                }}
                style={{
                  position: 'absolute',
                  left: '33%',
                  top: '26%',
                  width: '16%',
                  height: '22%',
                  background: 'transparent',
                  border: 'none',
                  zIndex: 3,
                  cursor: 'pointer',
                }}
              />
              <button
                aria-label="Level-2"
                onClick={() => {
                  setLevel(2);
                  onStartGame();
                }}
                style={{
                  position: 'absolute',
                  right: '33%',
                  top: '26%',
                  width: '16%',
                  height: '22%',
                  background: 'transparent',
                  border: 'none',
                  zIndex: 3,
                  cursor: 'pointer',
                }}
              />

              <button
                aria-label="Level-3"
                onClick={() => {
                  setLevel(3);
                  onStartGame();
                }}
                style={{
                  position: 'absolute',
                  left: '33%',
                  bottom: '26%',
                  width: '16%',
                  height: '22%',
                  background: 'transparent',
                  border: 'none',
                  zIndex: 3,
                  cursor: 'pointer',
                }}
              />

              <button
                aria-label="Level-4"
                onClick={() => {
                  setLevel(4);
                  onStartGame();
                }}
                style={{
                  position: 'absolute',
                  right: '33%',
                  bottom: '26%',
                  width: '16%',
                  height: '22%',
                  background: 'transparent',
                  border: 'none',
                  zIndex: 3,
                  cursor: 'pointer',
                }}
              />

              {/* Back hit area centered bottom (percent-based) */}
              <button
                aria-label="LevelBack"
                onClick={() => setStep('stage')}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: '10%',
                  width: '5%',
                  height: '8%',
                  background: 'transparent',
                  border: 'none',
                  zIndex: 3,
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
