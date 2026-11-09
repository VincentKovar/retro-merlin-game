import React from 'react';
import { LedButton } from './LedButton';
import { ControlButtons } from './ControlButtons';
import { ColorTheme, LedMatrix } from '../types/merlin';
import { Power } from 'lucide-react';

interface MerlinDeviceProps {
  isPoweredOn: boolean;
  onTogglePower: () => void;
  leds: LedMatrix;
  colorTheme: ColorTheme;
  onButtonPress: (num: number) => void;
  onButtonRelease?: (num: number) => void;
  onNewGame: () => void;
  onSameGame: () => void;
  onHitMe: () => void;
  onCompTurn: () => void;
  activeControl?: string | null;
  hitMeLabel?: string;
  compTurnLabel?: string;
}

export const MerlinDevice: React.FC<MerlinDeviceProps> = ({
  isPoweredOn,
  onTogglePower,
  leds,
  colorTheme,
  onButtonPress,
  onButtonRelease,
  onNewGame,
  onSameGame,
  onHitMe,
  onCompTurn,
  activeControl = null,
  hitMeLabel = 'HIT ME',
  compTurnLabel = 'COMP TURN',
}) => {
  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[370px] sm:max-w-[400px]">
      {/* Handheld Case Shadow */}
      <div className="w-full relative rounded-[44px] sm:rounded-[48px] p-2.5 sm:p-3.5 bg-gradient-to-b from-[#8f1919] via-[#6f0e0e] to-[#450707] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_4px_10px_rgba(0,0,0,0.7),inset_0_2px_3px_rgba(255,255,255,0.35),inset_0_-4px_8px_rgba(0,0,0,0.85)] border-t border-red-400/30 border-b border-black/80">
        
        {/* Subtle plastic mold seam edge */}
        <div className="absolute inset-x-3 inset-y-3 rounded-[38px] border border-black/30 pointer-events-none" />

        {/* Top Section: Speaker Grille, Parker Brothers Logo & Power Switch */}
        <div className="relative w-full flex flex-col items-center pt-2 pb-1.5 px-3">
          
          {/* Hardware Header Bar: Parker Brothers Branding + Power Slide Switch */}
          <div className="w-full flex items-center justify-between mb-2">
            {/* Parker Brothers Vintage Circle Badge */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md border border-amber-200/50">
                <span className="text-[9px] font-black font-serif text-black leading-none">
                  PB
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-[#f5d996] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                PARKER BROTHERS
              </span>
            </div>

            {/* Tactile Power Switch Slider */}
            <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-full border border-neutral-700 shadow-inner">
              <span className="text-[9px] font-mono font-bold text-neutral-400">
                OFF
              </span>
              <button
                type="button"
                onClick={onTogglePower}
                aria-label={`Toggle power: currently ${isPoweredOn ? 'ON' : 'OFF'}`}
                className="relative w-8 h-4 bg-neutral-900 rounded-full cursor-pointer transition-colors focus:outline-none"
              >
                {/* Switch knob */}
                <div
                  className={`absolute top-0.5 w-3 h-3 rounded-full transition-transform duration-150 shadow-md ${
                    isPoweredOn
                      ? 'translate-x-4 bg-red-500 shadow-[0_0_8px_#ef4444]'
                      : 'translate-x-0.5 bg-neutral-500'
                  }`}
                />
              </button>
              <span className={`text-[9px] font-mono font-bold ${isPoweredOn ? 'text-red-400' : 'text-neutral-500'}`}>
                ON
              </span>
            </div>
          </div>

          {/* Authentic Speaker Grille (Horizontal Slats) */}
          <div className="w-full max-w-[200px] h-7 bg-[#161618] rounded-md p-1 border border-black/70 shadow-inner flex flex-col justify-between overflow-hidden">
            <div className="w-full h-0.5 bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
            <div className="w-full h-0.5 bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
            <div className="w-full h-0.5 bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
            <div className="w-full h-0.5 bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
            <div className="w-full h-0.5 bg-black/90 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
          </div>

          {/* Main "MERLIN" Title Plate */}
          <div className="mt-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-[#f5d996] font-mono drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] scale-y-110">
              MERLIN
            </h1>
            <div className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#d4af37] font-sans font-bold -mt-0.5 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              THE ELECTRONIC WIZARD
            </div>
          </div>
        </div>

        {/* Central Recessed Faceplate for Keypad Matrix */}
        <div className="w-full bg-[#121214] rounded-[28px] sm:rounded-[32px] p-3 sm:p-4 border-2 border-black shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_2px_4px_rgba(255,255,255,0.1)]">
          
          {/* Keypad Matrix (11 circular LED buttons) */}
          <div className="flex flex-col items-center gap-2 sm:gap-2.5">
            
            {/* Top Center: Button [ 0 ] */}
            <div className="flex justify-center">
              <LedButton
                number={0}
                label="0"
                subLabel="REST"
                isOn={isPoweredOn && (leds[0]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[0]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
            </div>

            {/* Row 1: Buttons [ 1 ] [ 2 ] [ 3 ] */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              <LedButton
                number={1}
                subLabel="DO"
                isOn={isPoweredOn && (leds[1]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[1]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
              <LedButton
                number={2}
                subLabel="RE"
                isOn={isPoweredOn && (leds[2]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[2]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
              <LedButton
                number={3}
                subLabel="MI"
                isOn={isPoweredOn && (leds[3]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[3]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
            </div>

            {/* Row 2: Buttons [ 4 ] [ 5 ] [ 6 ] */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              <LedButton
                number={4}
                subLabel="FA"
                isOn={isPoweredOn && (leds[4]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[4]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
              <LedButton
                number={5}
                subLabel="SOL"
                isOn={isPoweredOn && (leds[5]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[5]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
              <LedButton
                number={6}
                subLabel="LA"
                isOn={isPoweredOn && (leds[6]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[6]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
            </div>

            {/* Row 3: Buttons [ 7 ] [ 8 ] [ 9 ] */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              <LedButton
                number={7}
                subLabel="TI"
                isOn={isPoweredOn && (leds[7]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[7]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
              <LedButton
                number={8}
                subLabel="DO"
                isOn={isPoweredOn && (leds[8]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[8]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
              <LedButton
                number={9}
                subLabel="RE"
                isOn={isPoweredOn && (leds[9]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[9]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
            </div>

            {/* Bottom Center: Button [ 10 ] */}
            <div className="flex justify-center">
              <LedButton
                number={10}
                label="10"
                subLabel="MI"
                isOn={isPoweredOn && (leds[10]?.isOn ?? false)}
                isBlinking={isPoweredOn && (leds[10]?.isBlinking ?? false)}
                themeId={colorTheme}
                disabled={!isPoweredOn}
                onPress={onButtonPress}
                onRelease={onButtonRelease}
              />
            </div>

          </div>

          {/* Lower Control Buttons: NEW GAME, SAME GAME, HIT ME, COMP TURN */}
          <div className="mt-3 sm:mt-4 pt-2.5 border-t border-neutral-800">
            <ControlButtons
              onNewGame={onNewGame}
              onSameGame={onSameGame}
              onHitMe={onHitMe}
              onCompTurn={onCompTurn}
              disabled={!isPoweredOn}
              activeControl={activeControl}
              hitMeLabel={hitMeLabel}
              compTurnLabel={compTurnLabel}
            />
          </div>

        </div>

        {/* Lower Chin Branding */}
        <div className="w-full flex items-center justify-center pt-2 pb-1 text-center">
          <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-[#f5d996]/60 uppercase">
            PARKER BROTHERS © 1978 • BEVERLY, MASS.
          </span>
        </div>

      </div>
    </div>
  );
};
