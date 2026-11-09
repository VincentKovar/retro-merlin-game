import React, { useState } from 'react';
import { X, BookOpen, Music, Grid3X3, Disc, Sparkles, Cpu, Layers } from 'lucide-react';
import { GameId } from '../types/merlin';
import { MERLIN_GAMES } from '../data/merlinGames';

interface InstructionManualProps {
  isOpen: boolean;
  onClose: () => void;
  activeGameId: GameId;
  onSelectGame: (gameId: GameId) => void;
}

export const InstructionManual: React.FC<InstructionManualProps> = ({
  isOpen,
  onClose,
  activeGameId,
  onSelectGame,
}) => {
  const [selectedTab, setSelectedTab] = useState<GameId | 'history'>(
    activeGameId !== 'none' ? activeGameId : 'history'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#141416] text-[#e0e0e0] border-2 border-[#801c1c] rounded-xl shadow-2xl overflow-hidden font-mono">
        {/* Vintage Manual Header */}
        <div className="bg-gradient-to-r from-[#590e0e] via-[#851616] to-[#590e0e] px-4 py-3 flex items-center justify-between border-b border-[#a82222]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-wider text-amber-200 uppercase font-sans">
                MERLIN OPERATING MANUAL
              </h2>
              <p className="text-[10px] text-red-200">
                Parker Brothers Electronic Game • Model 1978
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-red-200 hover:text-white hover:bg-red-900/60 transition-colors"
            aria-label="Close Manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto bg-[#1b1b1e] border-b border-[#2e2e34] p-1.5 gap-1 text-xs">
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === 'history'
                ? 'bg-[#801c1c] text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#25252a]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Origin (1978)
          </button>
          <button
            onClick={() => setSelectedTab('tictactoe')}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === 'tictactoe'
                ? 'bg-[#801c1c] text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#25252a]'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            1. Tic-Tac-Toe
          </button>
          <button
            onClick={() => setSelectedTab('music')}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === 'music'
                ? 'bg-[#801c1c] text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#25252a]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            2. Music Machine
          </button>
          <button
            onClick={() => setSelectedTab('echo')}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === 'echo'
                ? 'bg-[#801c1c] text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#25252a]'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            3. Echo
          </button>
          <button
            onClick={() => setSelectedTab('blackjack')}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === 'blackjack'
                ? 'bg-[#801c1c] text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#25252a]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            4. Blackjack 13
          </button>
          <button
            onClick={() => setSelectedTab('magicsquare')}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === 'magicsquare'
                ? 'bg-[#801c1c] text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#25252a]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            5. Magic Square
          </button>
          <button
            onClick={() => setSelectedTab('mindbender')}
            className={`px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedTab === 'mindbender'
                ? 'bg-[#801c1c] text-white font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#25252a]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            6. Mindbender
          </button>
        </div>

        {/* Manual Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm leading-relaxed bg-[#121214]">
          {selectedTab === 'history' && (
            <div className="space-y-4">
              <div className="border border-amber-900/60 bg-amber-950/20 p-3 rounded-lg text-amber-200">
                <h3 className="font-bold text-amber-300 font-sans text-base">
                  Meet Merlin — The Electronic Wizard
                </h3>
                <p className="mt-1">
                  Invented in 1978 by former NASA astrophysicist <strong>Bob Doyle</strong>, his wife <strong>Holly Doyle</strong>, and <strong>Wendl Thomis</strong>, and manufactured by Parker Brothers, Merlin became one of the best-selling handheld electronic games of all time, selling over 5 million units!
                </p>
              </div>

              <div>
                <h4 className="font-bold text-red-400 text-sm font-sans mb-1 uppercase tracking-wide">
                  The Iconic 11-Button Touchpad
                </h4>
                <p className="text-neutral-300">
                  Merlin’s faceplate features 11 circular push-buttons with embedded red light-emitting diodes (LEDs). The 11 buttons serve as both input keyboard and output display:
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 max-w-xs mx-auto text-center font-mono py-2 bg-black/40 border border-neutral-800 rounded p-2">
                  <div className="col-span-3 text-red-400 font-bold">[ 0 ] (Rest / Top)</div>
                  <div className="text-neutral-300">[ 1 ]</div>
                  <div className="text-neutral-300">[ 2 ]</div>
                  <div className="text-neutral-300">[ 3 ]</div>
                  <div className="text-neutral-300">[ 4 ]</div>
                  <div className="text-neutral-300">[ 5 ]</div>
                  <div className="text-neutral-300">[ 6 ]</div>
                  <div className="text-neutral-300">[ 7 ]</div>
                  <div className="text-neutral-300">[ 8 ]</div>
                  <div className="text-neutral-300">[ 9 ]</div>
                  <div className="col-span-3 text-red-400 font-bold">[ 10 ] (High Note / Bottom)</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-red-400 text-sm font-sans mb-1 uppercase tracking-wide">
                  The Four Control Buttons
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                  <li><strong>NEW GAME:</strong> Resets Merlin and puts it in Game Select mode. Press 1 to 6 to start any game.</li>
                  <li><strong>SAME GAME:</strong> Restarts the current game or replays the current puzzle/composition.</li>
                  <li><strong>HIT ME:</strong> Draws a new card in Blackjack 13.</li>
                  <li><strong>COMP TURN:</strong> Hands control to Merlin to make its move, stand in Blackjack, play back recorded music, or submit a guess.</li>
                </ul>
              </div>
            </div>
          )}

          {selectedTab !== 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div>
                  <h3 className="font-bold text-base text-red-400 font-sans uppercase">
                    Game {MERLIN_GAMES[selectedTab].number}: {MERLIN_GAMES[selectedTab].name}
                  </h3>
                  <p className="text-neutral-400 text-xs">
                    {MERLIN_GAMES[selectedTab].subtitle}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectGame(selectedTab);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-[#801c1c] hover:bg-[#a02424] text-white rounded text-xs font-bold font-sans transition-colors"
                >
                  Play Game {MERLIN_GAMES[selectedTab].number}
                </button>
              </div>

              <div className="bg-neutral-900/80 p-3 rounded border border-neutral-800">
                <h4 className="text-amber-300 font-bold uppercase text-xs mb-1">Objective</h4>
                <p className="text-neutral-200">{MERLIN_GAMES[selectedTab].goal}</p>
              </div>

              <div>
                <h4 className="text-amber-300 font-bold uppercase text-xs mb-2">How to Play</h4>
                <ul className="space-y-2">
                  {MERLIN_GAMES[selectedTab].instructions.map((inst, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-neutral-300">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-neutral-800 pt-3">
                <h4 className="text-amber-300 font-bold uppercase text-xs mb-2">Control Guide</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-300 text-xs">
                  <div className="p-2 bg-black/30 rounded border border-neutral-800">
                    <span className="font-bold text-amber-200">COMP TURN:</span>{' '}
                    {MERLIN_GAMES[selectedTab].controls.compTurn}
                  </div>
                  <div className="p-2 bg-black/30 rounded border border-neutral-800">
                    <span className="font-bold text-amber-200">SAME GAME:</span>{' '}
                    {MERLIN_GAMES[selectedTab].controls.sameGame}
                  </div>
                  {MERLIN_GAMES[selectedTab].controls.hitMe && (
                    <div className="p-2 bg-black/30 rounded border border-neutral-800 sm:col-span-2">
                      <span className="font-bold text-amber-200">HIT ME:</span>{' '}
                      {MERLIN_GAMES[selectedTab].controls.hitMe}
                    </div>
                  )}
                </div>
              </div>

              {selectedTab === 'music' && (
                <div className="p-3 bg-red-950/30 border border-red-900/50 rounded text-xs space-y-1">
                  <div className="font-bold text-red-300">Note Scale Mapping:</div>
                  <div className="text-neutral-300">
                    0: Rest | 1: Low C | 2: D | 3: E | 4: F | 5: G | 6: A | 7: B | 8: C | 9: D | 10: High E
                  </div>
                </div>
              )}

              {selectedTab === 'magicsquare' && (
                <div className="p-3 bg-red-950/30 border border-red-900/50 rounded text-xs space-y-1">
                  <div className="font-bold text-red-300">Secret Toggle Formulas:</div>
                  <div className="text-neutral-300">
                    Corners (1, 3, 7, 9) flip 4 lights (quadrant). Edges (2, 4, 6, 8) flip 3 lights (outer strip). Center 5 flips 5 lights (+ cross).
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#18181c] px-4 py-2.5 border-t border-[#2e2e34] flex items-center justify-between text-xs text-neutral-400">
          <span>Parker Brothers • 1978</span>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded font-sans transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
