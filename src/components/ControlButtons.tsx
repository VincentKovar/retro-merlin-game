import React from 'react';

interface ControlButtonsProps {
  onNewGame: () => void;
  onSameGame: () => void;
  onHitMe: () => void;
  onCompTurn: () => void;
  disabled?: boolean;
  activeControl?: string | null;
  hitMeLabel?: string;
  compTurnLabel?: string;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  onNewGame,
  onSameGame,
  onHitMe,
  onCompTurn,
  disabled = false,
  activeControl = null,
  hitMeLabel = 'HIT ME',
  compTurnLabel = 'COMP TURN',
}) => {
  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // ignore
      }
    }
  };

  const buttonStyle = `
    relative select-none touch-manipulation outline-none
    h-11 sm:h-12 px-2 sm:px-3
    rounded-md flex flex-col items-center justify-center
    bg-gradient-to-b from-[#252528] via-[#1c1c1e] to-[#111113]
    border border-[#3d3d42]
    shadow-[0_3px_6px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.9)]
    active:scale-95 active:border-[#55555c]
    cursor-pointer transition-all duration-75
  `;

  return (
    <div className="w-full grid grid-cols-4 gap-1.5 sm:gap-2 px-2 pt-2">
      {/* NEW GAME */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          triggerHaptic();
          onNewGame();
        }}
        className={buttonStyle}
        title="Start a new game or game selection"
      >
        <span className="text-[10px] sm:text-[11px] font-bold font-mono tracking-wider text-[#e2b755] uppercase text-center leading-tight">
          NEW<br />GAME
        </span>
      </button>

      {/* SAME GAME */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          triggerHaptic();
          onSameGame();
        }}
        className={buttonStyle}
        title="Replay or restart current game"
      >
        <span className="text-[10px] sm:text-[11px] font-bold font-mono tracking-wider text-[#e2b755] uppercase text-center leading-tight">
          SAME<br />GAME
        </span>
      </button>

      {/* HIT ME */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          triggerHaptic();
          onHitMe();
        }}
        className={`${buttonStyle} ${activeControl === 'hitMe' ? 'border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : ''}`}
        title="Draw card in Blackjack 13 or test"
      >
        <span className="text-[10px] sm:text-[11px] font-bold font-mono tracking-wider text-[#e2b755] uppercase text-center leading-tight">
          {hitMeLabel.includes(' ') ? (
            <>
              {hitMeLabel.split(' ')[0]}<br />{hitMeLabel.split(' ')[1]}
            </>
          ) : (
            hitMeLabel
          )}
        </span>
      </button>

      {/* COMP TURN (Merlin) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          triggerHaptic();
          onCompTurn();
        }}
        className={`${buttonStyle} ${activeControl === 'compTurn' ? 'border-red-400/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}
        title="Hand turn to Merlin / Submit move / Play tune"
      >
        <span className="text-[10px] sm:text-[11px] font-bold font-mono tracking-wider text-[#e2b755] uppercase text-center leading-tight">
          {compTurnLabel.includes(' ') ? (
            <>
              {compTurnLabel.split(' ')[0]}<br />{compTurnLabel.split(' ')[1]}
            </>
          ) : (
            compTurnLabel
          )}
        </span>
      </button>
    </div>
  );
};
