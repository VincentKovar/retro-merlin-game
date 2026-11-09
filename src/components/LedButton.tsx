import React from 'react';
import { ColorTheme } from '../types/merlin';
import { COLOR_THEMES } from '../data/merlinGames';

interface LedButtonProps {
  number: number;
  label?: string;
  subLabel?: string;
  isOn: boolean;
  isBlinking: boolean;
  themeId: ColorTheme;
  disabled?: boolean;
  isPressed?: boolean;
  onPress: (number: number) => void;
  onRelease?: (number: number) => void;
}

export const LedButton: React.FC<LedButtonProps> = ({
  number,
  label,
  subLabel,
  isOn,
  isBlinking,
  themeId,
  disabled = false,
  isPressed = false,
  onPress,
  onRelease,
}) => {
  const currentTheme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0];

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // ignore
      }
    }
    onPress(number);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    onRelease?.(number);
  };

  const activeLit = isOn || (isBlinking ? 'blink' : false);

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onPress(number);
        }
      }}
      aria-label={`Button ${number} ${subLabel ? `(${subLabel})` : ''}`}
      className={`
        relative select-none touch-manipulation outline-none
        w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20
        rounded-full flex flex-col items-center justify-center
        transition-all duration-75
        ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        ${isPressed ? 'scale-95 brightness-95' : ''}
        bg-gradient-to-b from-[#242426] via-[#1a1a1c] to-[#121214]
        border-2 border-[#38383c]
        shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-2px_4px_rgba(0,0,0,0.8)]
        hover:border-[#4a4a50]
      `}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Outer tactile ring groove */}
      <div className="absolute inset-1 rounded-full border border-black/60 pointer-events-none" />

      {/* Button Number Label */}
      <div className="text-[14px] sm:text-[15px] font-bold font-mono tracking-wider text-[#d0d0d4] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] -mt-1 leading-none">
        {label ?? number}
      </div>

      {/* The Central Iconic LED Light */}
      <div className="relative mt-1">
        {/* LED Lens Housing */}
        <div
          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-black/70 flex items-center justify-center shadow-inner overflow-hidden"
          style={{
            backgroundColor: isOn
              ? currentTheme.ledOn
              : currentTheme.ledOff,
            boxShadow: isOn
              ? `0 0 12px 3px ${currentTheme.ledGlow}, 0 0 24px 6px ${currentTheme.ledGlow}, inset 0 0 4px #ffffff`
              : 'inset 0 2px 4px rgba(0,0,0,0.8)',
            animation: isBlinking ? 'merlin-blink 0.5s infinite alternate ease-in-out' : 'none',
          }}
        >
          {/* LED Hot Core Filament */}
          {isOn && (
            <div
              className="w-2 h-2 rounded-full opacity-90 blur-[0.5px]"
              style={{ backgroundColor: currentTheme.ledCore }}
            />
          )}
        </div>
      </div>

      {/* Musical or Helper Sublabel */}
      {subLabel && (
        <span className="text-[9px] font-mono tracking-tighter text-[#888890] mt-0.5 leading-none">
          {subLabel}
        </span>
      )}
    </button>
  );
};
