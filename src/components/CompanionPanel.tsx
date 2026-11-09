import React from 'react';
import { 
  Volume2, VolumeX, BookOpen, RotateCcw, 
  Palette, Play, Sparkles, HelpCircle 
} from 'lucide-react';
import { GameId, ColorTheme, SongPreset } from '../types/merlin';
import { MERLIN_GAMES, COLOR_THEMES } from '../data/merlinGames';
import { SAMPLE_SONGS } from '../games/musicMachine';

interface CompanionPanelProps {
  activeGameId: GameId;
  onSelectGame: (gameId: GameId) => void;
  onOpenManual: () => void;
  colorTheme: ColorTheme;
  onChangeColorTheme: (theme: ColorTheme) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  statusText: string;
  subStatusText?: string;
  onLoadSong?: (song: SongPreset) => void;
  musicNoteCount?: number;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
}

export const CompanionPanel: React.FC<CompanionPanelProps> = ({
  activeGameId,
  onSelectGame,
  onOpenManual,
  colorTheme,
  onChangeColorTheme,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  statusText,
  subStatusText,
  onLoadSong,
  musicNoteCount = 0,
  scanlinesEnabled,
  onToggleScanlines,
}) => {
  const currentGame = MERLIN_GAMES[activeGameId];

  return (
    <div className="w-full max-w-md lg:max-w-xs flex flex-col gap-3 font-mono text-xs text-neutral-300">
      {/* Status LCD Readout Box */}
      <div className="bg-[#111315] border-2 border-[#2c3238] rounded-lg p-3 shadow-lg relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#222b35_1px,transparent_1px)] [background-size:8px_8px] opacity-40 pointer-events-none" />
        
        <div className="flex items-center justify-between border-b border-[#222830] pb-1.5 mb-2 relative">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[11px] text-neutral-400 uppercase tracking-widest">
              STATUS DISPLAY
            </span>
          </div>
          <span className="text-[10px] text-red-400 font-bold">
            {activeGameId === 'none' ? 'STANDBY' : `GAME ${currentGame.number}`}
          </span>
        </div>

        <div className="space-y-1 relative">
          <div className="text-sm font-bold text-amber-300 leading-snug">
            {statusText}
          </div>
          {subStatusText && (
            <div className="text-xs text-neutral-400 leading-normal">
              {subStatusText}
            </div>
          )}
        </div>
      </div>

      {/* Game Selection Quick Bar */}
      <div className="bg-[#181a1d] border border-neutral-800 rounded-lg p-3 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[11px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            Built-in Games (1–6)
          </span>
          <button
            onClick={onOpenManual}
            className="text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 underline underline-offset-2"
          >
            <HelpCircle className="w-3 h-3" />
            Rules
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'tictactoe' as GameId, num: 1, name: 'Tic-Tac-Toe' },
            { id: 'music' as GameId, num: 2, name: 'Music Machine' },
            { id: 'echo' as GameId, num: 3, name: 'Echo' },
            { id: 'blackjack' as GameId, num: 4, name: 'Blackjack 13' },
            { id: 'magicsquare' as GameId, num: 5, name: 'Magic Square' },
            { id: 'mindbender' as GameId, num: 6, name: 'Mindbender' },
          ].map(g => (
            <button
              key={g.id}
              onClick={() => onSelectGame(g.id)}
              className={`px-2 py-1.5 rounded text-left flex items-center justify-between border transition-all ${
                activeGameId === g.id
                  ? 'bg-red-950/70 border-red-700 text-red-200 font-bold shadow-[0_0_8px_rgba(220,38,38,0.3)]'
                  : 'bg-[#222428] border-neutral-700/60 text-neutral-300 hover:bg-[#2b2d33] hover:text-white'
              }`}
            >
              <span className="truncate">{g.name}</span>
              <span className="text-[10px] opacity-60 ml-1">#{g.num}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Music Machine Quick Songbook (shown if Game 2 is active) */}
      {activeGameId === 'music' && onLoadSong && (
        <div className="bg-[#181a1d] border border-neutral-800 rounded-lg p-3 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Play className="w-3.5 h-3.5 text-amber-400" />
              Song Library (Load & Play)
            </span>
            <span className="text-[10px] text-amber-400">
              {musicNoteCount}/48 Notes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {SAMPLE_SONGS.map(song => (
              <button
                key={song.id}
                onClick={() => onLoadSong(song)}
                className="px-2 py-1 bg-[#222428] hover:bg-[#2e3137] border border-neutral-700 text-neutral-300 rounded text-[11px] truncate text-left transition-colors"
                title={song.title}
              >
                {song.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hardware Settings: Color Theme & Sound */}
      <div className="bg-[#181a1d] border border-neutral-800 rounded-lg p-3 shadow-md space-y-3">
        {/* Color Theme Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-neutral-400" />
              Display Color Mode
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {COLOR_THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => onChangeColorTheme(theme.id)}
                className={`px-2 py-1 rounded text-[10px] flex items-center gap-1.5 border transition-all ${
                  colorTheme === theme.id
                    ? 'bg-neutral-800 text-white font-bold border-neutral-500'
                    : 'bg-[#222428] text-neutral-400 border-neutral-800 hover:bg-[#2b2d33]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: theme.ledOn }}
                />
                <span className="truncate">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Volume & Mute */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-3">
          <button
            onClick={onToggleMute}
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Audio On</span>
              </>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            disabled={isMuted}
            value={volume}
            onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
            className="w-24 accent-red-600 cursor-pointer"
            aria-label="Volume slider"
          />
        </div>

        {/* Scanlines Overlay Toggle */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-[10px] text-neutral-400">Retro CRT Scanlines</span>
          <button
            onClick={onToggleScanlines}
            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
              scanlinesEnabled
                ? 'bg-red-900/80 text-red-200 border border-red-700'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}
          >
            {scanlinesEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
