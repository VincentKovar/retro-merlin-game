import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GameId, ColorTheme, LedMatrix, SongPreset } from './types/merlin';
import { merlinAudio } from './audio/merlinAudio';
import { MERLIN_GAMES } from './data/merlinGames';

// Games
import { 
  TttState, createInitialTttState, checkTttWinner, getMerlinTttMove 
} from './games/ticTacToe';
import { 
  MusicMachineState, createInitialMusicState, MAX_NOTES, SAMPLE_SONGS 
} from './games/musicMachine';
import { 
  EchoState, createInitialEchoState, generateRandomEchoSequence 
} from './games/echo';
import { 
  BlackjackState, createInitialBlackjackState, startNewBlackjackRound, 
  drawCard, calculateTotal 
} from './games/blackjack';
import { 
  MagicSquareState, createInitialMagicSquareState, toggleSquare, 
  isMagicSquareSolved 
} from './games/magicSquare';
import { 
  MindbenderState, createInitialMindbenderState, evaluateMindbenderGuess 
} from './games/mindbender';

// Components
import { MerlinDevice } from './components/MerlinDevice';
import { CompanionPanel } from './components/CompanionPanel';
import { InstructionManual } from './components/InstructionManual';

export default function App() {
  // --- Global Device & Hardware State ---
  const [isPoweredOn, setIsPoweredOn] = useState<boolean>(true);
  const [colorTheme, setColorTheme] = useState<ColorTheme>('ruby');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(false);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);

  // Active game mode
  const [activeGameId, setActiveGameId] = useState<GameId>('none');
  const [statusText, setStatusText] = useState<string>('MERLIN READY: PRESS NEW GAME THEN 1–6');
  const [subStatusText, setSubStatusText] = useState<string>('Select one of 6 classic electronic games.');

  // LED Matrix display state (Buttons 0 to 10)
  const [leds, setLeds] = useState<LedMatrix>(() => {
    const init: LedMatrix = {};
    for (let i = 0; i <= 10; i++) {
      init[i] = { isOn: false, isBlinking: false };
    }
    return init;
  });

  // Active highlighted control button (e.g. for user cues)
  const [activeControl, setActiveControl] = useState<string | null>(null);

  // --- Individual Game States ---
  const [tttState, setTttState] = useState<TttState>(createInitialTttState);
  const [musicState, setMusicState] = useState<MusicMachineState>(createInitialMusicState);
  const [echoState, setEchoState] = useState<EchoState>(createInitialEchoState);
  const [blackjackState, setBlackjackState] = useState<BlackjackState>(createInitialBlackjackState);
  const [magicSquareState, setMagicSquareState] = useState<MagicSquareState>(createInitialMagicSquareState);
  const [mindbenderState, setMindbenderState] = useState<MindbenderState>(createInitialMindbenderState);

  // Playback timer ref for music & echo
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all LEDs helper
  const clearLeds = useCallback(() => {
    setLeds(() => {
      const empty: LedMatrix = {};
      for (let i = 0; i <= 10; i++) {
        empty[i] = { isOn: false, isBlinking: false };
      }
      return empty;
    });
  }, []);

  // Update specific LED
  const setLed = useCallback((num: number, isOn: boolean, isBlinking: boolean = false) => {
    setLeds(prev => ({
      ...prev,
      [num]: { isOn, isBlinking },
    }));
  }, []);

  // --- Power On/Off Handler ---
  const handleTogglePower = () => {
    if (isPoweredOn) {
      // Powering down
      merlinAudio.playClick();
      setIsPoweredOn(false);
      clearLeds();
      setStatusText('DEVICE OFF');
      setSubStatusText('Slide switch to ON to begin.');
      if (playbackTimeoutRef.current) {
        clearTimeout(playbackTimeoutRef.current);
      }
    } else {
      // Powering on
      setIsPoweredOn(true);
      merlinAudio.playClick();
      merlinAudio.playPowerOn();
      setStatusText('MERLIN THE ELECTRONIC WIZARD');
      setSubStatusText('Press NEW GAME and choose 1–6.');

      // Power-on flash sequence
      const sequence = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      sequence.forEach((num, index) => {
        setTimeout(() => {
          setLed(num, true, false);
          setTimeout(() => {
            setLed(num, false, false);
          }, 120);
        }, index * 40);
      });

      setActiveGameId('none');
    }
  };

  // --- Start Game Mode Transition ---
  const startSelectedGame = useCallback((gameId: GameId) => {
    if (!isPoweredOn) return;
    merlinAudio.playClick();
    if (playbackTimeoutRef.current) {
      clearTimeout(playbackTimeoutRef.current);
    }
    clearLeds();
    setActiveGameId(gameId);
    setActiveControl(null);

    switch (gameId) {
      case 'none':
        setStatusText('SELECT GAME (1–6)');
        setSubStatusText('1: Tic-Tac-Toe | 2: Music | 3: Echo | 4: Blackjack | 5: Magic Sq | 6: Mindbender');
        // Flash 1-6 lightly
        for (let i = 1; i <= 6; i++) {
          setLed(i, true, true);
        }
        break;

      case 'tictactoe': {
        const freshTtt = createInitialTttState();
        setTttState(freshTtt);
        setStatusText('GAME 1: TIC-TAC-TOE');
        setSubStatusText('Touch an unlit square (1–9) to make your blinking mark.');
        break;
      }

      case 'music': {
        const freshMusic = createInitialMusicState();
        setMusicState(freshMusic);
        setStatusText('GAME 2: MUSIC MACHINE');
        setSubStatusText('Play notes 1–10 (0 is Rest). Press COMP TURN to play back!');
        break;
      }

      case 'echo': {
        const freshEcho = createInitialEchoState();
        const initialSeq = generateRandomEchoSequence(3);
        freshEcho.targetSequence = initialSeq;
        freshEcho.sequenceLength = 3;
        freshEcho.status = 'merlin_playing';
        setEchoState(freshEcho);
        setStatusText('GAME 3: ECHO (Length 3)');
        setSubStatusText('Listen & watch Merlin play the sequence...');
        playEchoSequence(initialSeq);
        break;
      }

      case 'blackjack': {
        const freshBj = startNewBlackjackRound(5);
        setBlackjackState(freshBj);
        setStatusText(`GAME 4: BLACKJACK 13 (Chips: 5)`);
        setSubStatusText(`You were dealt ${freshBj.playerTotal}. Press HIT ME to draw or COMP TURN to stand.`);
        // Light up starting chips (1 to 5) and the dealt card
        const newLeds: LedMatrix = {};
        for (let i = 0; i <= 10; i++) newLeds[i] = { isOn: false, isBlinking: false };
        // Show player chips count on LEDs 1..5
        for (let i = 1; i <= 5; i++) {
          newLeds[i] = { isOn: true, isBlinking: false };
        }
        // Blink the dealt card
        if (freshBj.lastDrawnCard) {
          newLeds[freshBj.lastDrawnCard] = { isOn: true, isBlinking: true };
        }
        setLeds(newLeds);
        merlinAudio.playNote(freshBj.lastDrawnCard || 1, 0.2);
        break;
      }

      case 'magicsquare': {
        const freshMs = createInitialMagicSquareState(8);
        setMagicSquareState(freshMs);
        setStatusText('GAME 5: MAGIC SQUARE');
        setSubStatusText('Goal: Light 8 perimeter buttons (1-4, 6-9) ON; center 5 OFF.');
        // Show scrambled grid
        const newLeds: LedMatrix = {};
        for (let i = 0; i <= 10; i++) {
          newLeds[i] = { isOn: freshMs.grid[i] ?? false, isBlinking: false };
        }
        setLeds(newLeds);
        break;
      }

      case 'mindbender': {
        const freshMb = createInitialMindbenderState(3);
        setMindbenderState(freshMb);
        setStatusText('GAME 6: MINDBENDER (3 Digits)');
        setSubStatusText('Enter 3 digits (1–9), then press COMP TURN to submit guess.');
        break;
      }
    }
  }, [isPoweredOn, clearLeds, setLed]);

  // --- GAME 1: TIC-TAC-TOE LOGIC ---
  const handleTttButtonPress = (num: number) => {
    if (num < 1 || num > 9) return;
    if (tttState.winner) {
      // Game already ended, prompt same game
      setStatusText('Game Over! Press SAME GAME for rematch.');
      return;
    }
    if (tttState.board[num] !== 'empty') {
      merlinAudio.playBuzzer();
      return;
    }

    merlinAudio.playNote(num, 0.15);

    // If there was an unconfirmed pending player move, revert it
    const newBoard = { ...tttState.board };
    if (tttState.pendingPlayerMove && tttState.pendingPlayerMove !== num) {
      newBoard[tttState.pendingPlayerMove] = 'empty';
    }

    newBoard[num] = 'player';
    setTttState(prev => ({
      ...prev,
      board: newBoard,
      pendingPlayerMove: num,
    }));

    // Update LED display: player marks blink!
    setLeds(prev => {
      const updated = { ...prev };
      if (tttState.pendingPlayerMove && tttState.pendingPlayerMove !== num) {
        updated[tttState.pendingPlayerMove] = { isOn: false, isBlinking: false };
      }
      updated[num] = { isOn: true, isBlinking: true };
      return updated;
    });

    setStatusText(`Square ${num} selected (Blinking)`);
    setSubStatusText('Press COMP TURN for Merlin to make his move!');
    setActiveControl('compTurn');
  };

  const handleTttCompTurn = () => {
    if (tttState.winner) return;

    if (!tttState.pendingPlayerMove) {
      // Prompt player to pick square
      merlinAudio.playBuzzer();
      setStatusText('Choose your square first (1–9)!');
      return;
    }

    // Check if player won with this move
    const afterPlayerWin = checkTttWinner(tttState.board);
    if (afterPlayerWin.winner === 'player') {
      merlinAudio.playVictory();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      setTttState(prev => ({
        ...prev,
        winner: 'player',
        winningLine: afterPlayerWin.line,
        pendingPlayerMove: null,
        score: { ...prev.score, player: prev.score.player + 1 },
      }));
      setStatusText('YOU WIN! FANTASTIC!');
      setSubStatusText('Press SAME GAME for another round.');
      // Flash winning line
      if (afterPlayerWin.line) {
        setLeds(prev => {
          const updated = { ...prev };
          afterPlayerWin.line?.forEach(cell => {
            updated[cell] = { isOn: true, isBlinking: true };
          });
          return updated;
        });
      }
      return;
    }

    if (afterPlayerWin.winner === 'draw') {
      merlinAudio.playNote(1, 0.3);
      setTttState(prev => ({
        ...prev,
        winner: 'draw',
        pendingPlayerMove: null,
        score: { ...prev.score, draws: prev.score.draws + 1 },
      }));
      setStatusText('IT IS A DRAW!');
      setSubStatusText('Press SAME GAME to rematch.');
      return;
    }

    // Merlin's aggressive AI move
    merlinAudio.playComputerBeep();
    const merlinMove = getMerlinTttMove(tttState.board);
    if (merlinMove !== null) {
      const boardAfterMerlin = {
        ...tttState.board,
        [merlinMove]: 'merlin' as const,
      };

      merlinAudio.playNote(merlinMove, 0.2);

      const afterMerlinWin = checkTttWinner(boardAfterMerlin);

      setTttState(prev => ({
        ...prev,
        board: boardAfterMerlin,
        pendingPlayerMove: null,
        winner: afterMerlinWin.winner,
        winningLine: afterMerlinWin.line,
        score: afterMerlinWin.winner === 'merlin'
          ? { ...prev.score, merlin: prev.score.merlin + 1 }
          : afterMerlinWin.winner === 'draw'
          ? { ...prev.score, draws: prev.score.draws + 1 }
          : prev.score,
      }));

      // Update LEDs: Merlin moves are solid lights!
      setLeds(prev => ({
        ...prev,
        [merlinMove]: { isOn: true, isBlinking: false },
      }));

      if (afterMerlinWin.winner === 'merlin') {
        merlinAudio.playBuzzer();
        setStatusText('MERLIN WINS!');
        setSubStatusText('Merlin got 3 in a row! Press SAME GAME to try again.');
      } else if (afterMerlinWin.winner === 'draw') {
        setStatusText('DRAW GAME!');
        setSubStatusText('All squares filled. Press SAME GAME to play again.');
      } else {
        setStatusText(`Merlin took square ${merlinMove} (Solid)`);
        setSubStatusText('Your turn: tap an unlit square (1–9).');
        setActiveControl(null);
      }
    }
  };

  // --- GAME 2: MUSIC MACHINE LOGIC ---
  const handleMusicButtonPress = (num: number) => {
    if (musicState.notes.length >= MAX_NOTES) {
      merlinAudio.playBuzzer();
      setStatusText('MEMORY FULL (48 Notes)');
      setSubStatusText('Press COMP TURN to listen, or SAME GAME to clear.');
      return;
    }

    // Play note sound (0 is rest / silence)
    if (num > 0) {
      merlinAudio.playNote(num, 0.25);
    } else {
      merlinAudio.playClick();
    }

    // Flash LED
    setLed(num, true, false);
    setTimeout(() => {
      setLed(num, false, false);
    }, 200);

    const newNotes = [...musicState.notes, num];
    setMusicState(prev => ({
      ...prev,
      notes: newNotes,
    }));

    setStatusText(`Recorded note #${newNotes.length}: [${num === 0 ? 'REST' : num}]`);
    setSubStatusText(`${MAX_NOTES - newNotes.length} notes remaining. Press COMP TURN to playback.`);
  };

  const playMusicNotes = useCallback(async (notes: number[], tempoMs: number) => {
    setMusicState(prev => ({ ...prev, isPlaying: true }));
    setStatusText('PLAYING COMPOSITION...');

    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      setMusicState(prev => ({ ...prev, currentPlayIndex: i }));
      
      if (note > 0) {
        merlinAudio.playNote(note, (tempoMs * 0.8) / 1000);
        setLed(note, true, false);
      } else {
        setLed(0, true, false);
      }

      await new Promise(r => setTimeout(r, tempoMs));
      setLed(note, false, false);
    }

    setMusicState(prev => ({ ...prev, isPlaying: false, currentPlayIndex: null }));
    setStatusText('PLAYBACK COMPLETE');
    setSubStatusText('Press COMP TURN to play again, or add more notes.');
  }, [setLed]);

  const handleMusicCompTurn = () => {
    if (musicState.isPlaying) {
      // Stop playback
      setMusicState(prev => ({ ...prev, isPlaying: false }));
      clearLeds();
      return;
    }

    if (musicState.notes.length === 0) {
      merlinAudio.playBuzzer();
      setStatusText('NO NOTES RECORDED');
      setSubStatusText('Press buttons 1–10 to record notes or choose a preset song.');
      return;
    }

    playMusicNotes(musicState.notes, musicState.tempo);
  };

  const handleLoadSongPreset = (song: SongPreset) => {
    merlinAudio.playClick();
    setMusicState(prev => ({
      ...prev,
      notes: [...song.notes],
      tempo: song.tempo,
    }));
    setStatusText(`LOADED: "${song.title}"`);
    setSubStatusText('Press COMP TURN to hear Merlin play this tune!');
    setActiveControl('compTurn');
  };

  // --- GAME 3: ECHO LOGIC ---
  const playEchoSequence = useCallback(async (sequence: number[]) => {
    setEchoState(prev => ({
      ...prev,
      status: 'merlin_playing',
      currentStep: 0,
      playerSequence: [],
    }));
    setStatusText(`ECHO: WATCH & LISTEN (${sequence.length} Notes)`);
    setSubStatusText('Merlin is demonstrating...');

    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < sequence.length; i++) {
      const note = sequence[i];
      merlinAudio.playNote(note, 0.28);
      setLed(note, true, false);
      await new Promise(r => setTimeout(r, 380));
      setLed(note, false, false);
      await new Promise(r => setTimeout(r, 120));
    }

    setEchoState(prev => ({
      ...prev,
      status: 'player_turn',
    }));
    setStatusText('YOUR TURN: REPEAT SEQUENCE');
    setSubStatusText(`Press note 1 of ${sequence.length}.`);
  }, [setLed]);

  const handleEchoButtonPress = (num: number) => {
    if (echoState.status !== 'player_turn') return;

    const expected = echoState.targetSequence[echoState.currentStep];
    merlinAudio.playNote(num, 0.2);

    // Flash player's button
    setLed(num, true, false);
    setTimeout(() => {
      setLed(num, false, false);
    }, 180);

    if (num === expected) {
      const nextStep = echoState.currentStep + 1;
      const newPlayerSeq = [...echoState.playerSequence, num];

      if (nextStep >= echoState.targetSequence.length) {
        // Completed sequence successfully!
        merlinAudio.playVictory();
        confetti({ particleCount: 50, spread: 50 });
        const nextLen = Math.min(9, echoState.sequenceLength + 1);

        setEchoState(prev => ({
          ...prev,
          status: 'success',
          highScore: Math.max(prev.highScore, prev.targetSequence.length),
          sequenceLength: nextLen,
        }));
        setStatusText(`EXCELLENT! LEVEL ${echoState.sequenceLength} CLEARED!`);
        setSubStatusText(
          echoState.sequenceLength >= 9
            ? 'YOU MASTERED ECHO! Maximum 9-note sequence reached!'
            : `Next round: ${nextLen} notes incoming in 1.5s...`
        );

        if (echoState.sequenceLength < 9) {
          setTimeout(() => {
            const nextSeq = generateRandomEchoSequence(nextLen);
            setEchoState(prev => ({
              ...prev,
              targetSequence: nextSeq,
            }));
            playEchoSequence(nextSeq);
          }, 1500);
        }
      } else {
        // Correct so far, continue
        setEchoState(prev => ({
          ...prev,
          currentStep: nextStep,
          playerSequence: newPlayerSeq,
        }));
        setStatusText(`Note ${nextStep} Correct!`);
        setSubStatusText(`Now enter note ${nextStep + 1} of ${echoState.targetSequence.length}`);
      }
    } else {
      // Mistake!
      merlinAudio.playBuzzer();
      // Flash both what they pressed and what was expected
      setLed(num, true, true);
      setLed(expected, true, false);
      setEchoState(prev => ({
        ...prev,
        status: 'failure',
      }));
      setStatusText('MISSED NOTE! BUZZZZ!');
      setSubStatusText(`Expected [${expected}], but you touched [${num}]. Press SAME GAME to retry.`);
    }
  };

  // --- GAME 4: BLACKJACK 13 LOGIC ---
  const handleBlackjackHitMe = () => {
    if (blackjackState.phase !== 'player_turn') {
      merlinAudio.playBuzzer();
      return;
    }

    const card = drawCard();
    merlinAudio.playNote(card, 0.25);
    const newCards = [...blackjackState.playerCards, card];
    const newTotal = calculateTotal(newCards);

    // Flash the new card on LED
    setLed(card, true, true);
    setTimeout(() => {
      setLed(card, false, false);
    }, 400);

    if (newTotal > 13) {
      // BUST!
      merlinAudio.playBuzzer();
      const updatedChips = blackjackState.playerChips - 1;
      const isGameOver = updatedChips <= 0;

      setBlackjackState(prev => ({
        ...prev,
        playerCards: newCards,
        playerTotal: newTotal,
        lastDrawnCard: card,
        playerChips: updatedChips,
        phase: isGameOver ? 'game_lost' : 'round_over',
        roundResult: 'player_bust',
        message: `BUSTED with ${newTotal}! (${newCards.join(' + ')})`,
      }));

      // Update LED chips display
      const newLeds: LedMatrix = {};
      for (let i = 0; i <= 10; i++) newLeds[i] = { isOn: false, isBlinking: false };
      for (let i = 1; i <= Math.max(0, updatedChips); i++) {
        newLeds[i] = { isOn: true, isBlinking: false };
      }
      setLeds(newLeds);

      setStatusText(`BUST! Total ${newTotal} exceeds 13.`);
      setSubStatusText(
        isGameOver
          ? 'GAME OVER! All chips lost to Merlin. Press SAME GAME to restart.'
          : `You lost 1 chip (${updatedChips} remaining). Press SAME GAME for next hand.`
      );
    } else {
      // Safe, can hit again or stand
      setBlackjackState(prev => ({
        ...prev,
        playerCards: newCards,
        playerTotal: newTotal,
        lastDrawnCard: card,
        message: `Hit ${card}. Total is now ${newTotal}.`,
      }));
      setStatusText(`DREW ${card} — YOUR TOTAL: ${newTotal}`);
      setSubStatusText('Press HIT ME for another card, or COMP TURN to stand.');
    }
  };

  const handleBlackjackCompTurn = async () => {
    if (blackjackState.phase !== 'player_turn') return;

    merlinAudio.playComputerBeep();
    setStatusText('MERLIN (DEALER) TAKES TURN...');
    setSubStatusText('Dealer is revealing hidden card and playing...');

    setBlackjackState(prev => ({ ...prev, phase: 'dealer_turn' }));

    // Dealer turn simulation
    let dCards = [...blackjackState.dealerCards];
    let dTotal = calculateTotal(dCards);

    // Reveal hidden card sound & LED
    await new Promise(r => setTimeout(r, 600));
    merlinAudio.playNote(dCards[0], 0.2);
    setLed(dCards[0], true, false);

    // Dealer hits while total <= 9; stands on 10, 11, 12, 13
    while (dTotal <= 9) {
      await new Promise(r => setTimeout(r, 700));
      const newCard = drawCard();
      dCards.push(newCard);
      dTotal = calculateTotal(dCards);
      merlinAudio.playNote(newCard, 0.2);
      setLed(newCard, true, false);
      setStatusText(`Merlin drew ${newCard} (Dealer Total: ${dTotal})`);
    }

    await new Promise(r => setTimeout(r, 600));

    // Determine hand winner
    const pTotal = blackjackState.playerTotal;
    let newChips = blackjackState.playerChips;
    let result: 'player_win' | 'dealer_win' | 'push' | 'dealer_bust';
    let outcomeText = '';

    if (dTotal > 13) {
      // Dealer busts!
      result = 'dealer_bust';
      newChips = Math.min(10, newChips + 1);
      merlinAudio.playVictory();
      confetti({ particleCount: 60, spread: 55 });
      outcomeText = `MERLIN BUSTED (${dTotal})! YOU WIN THE HAND!`;
    } else if (pTotal > dTotal) {
      // Player higher
      result = 'player_win';
      newChips = Math.min(10, newChips + 1);
      merlinAudio.playVictory();
      outcomeText = `YOU WIN! Your ${pTotal} beats Merlin's ${dTotal}!`;
    } else if (dTotal > pTotal) {
      // Dealer higher
      result = 'dealer_win';
      newChips = Math.max(0, newChips - 1);
      merlinAudio.playBuzzer();
      outcomeText = `MERLIN WINS! Dealer ${dTotal} beats your ${pTotal}.`;
    } else {
      // Tie
      result = 'push';
      merlinAudio.playNote(5, 0.25);
      outcomeText = `PUSH / TIE! Both have ${pTotal}. Chips unchanged.`;
    }

    const wonGame = newChips >= 10;
    const lostGame = newChips <= 0;

    setBlackjackState(prev => ({
      ...prev,
      dealerCards: dCards,
      dealerTotal: dTotal,
      playerChips: newChips,
      phase: wonGame ? 'game_won' : lostGame ? 'game_lost' : 'round_over',
      roundResult: result,
      message: outcomeText,
    }));

    // Update chips display on LEDs (1 to newChips)
    const newLeds: LedMatrix = {};
    for (let i = 0; i <= 10; i++) newLeds[i] = { isOn: false, isBlinking: false };
    for (let i = 1; i <= newChips; i++) {
      newLeds[i] = { isOn: true, isBlinking: false };
    }
    setLeds(newLeds);

    if (wonGame) {
      merlinAudio.playVictory();
      confetti({ particleCount: 100, spread: 80 });
      setStatusText('GRAND CHAMPION! 10 CHIPS!');
      setSubStatusText('You beat Merlin at Blackjack 13! Press SAME GAME to play again.');
    } else if (lostGame) {
      setStatusText('OUT OF CHIPS! MERLIN WINS TOURNAMENT.');
      setSubStatusText('Press SAME GAME to start a new 5-chip bankroll.');
    } else {
      setStatusText(outcomeText);
      setSubStatusText(`Chips: ${newChips} / 10. Press SAME GAME to deal next hand.`);
    }
  };

  // --- GAME 5: MAGIC SQUARE LOGIC ---
  const handleMagicSquareButtonPress = (num: number) => {
    if (num < 1 || num > 9) return;
    if (magicSquareState.isSolved) {
      setStatusText('Already Solved! Press SAME GAME for a new puzzle.');
      return;
    }

    merlinAudio.playNote(num, 0.15);
    const updatedGrid = toggleSquare(magicSquareState.grid, num);
    const solved = isMagicSquareSolved(updatedGrid);

    // Update LED display
    const newLeds: LedMatrix = {};
    for (let i = 0; i <= 10; i++) {
      newLeds[i] = { isOn: updatedGrid[i] ?? false, isBlinking: false };
    }
    setLeds(newLeds);

    setMagicSquareState(prev => ({
      ...prev,
      grid: updatedGrid,
      moveCount: prev.moveCount + 1,
      isSolved: solved,
      history: [...prev.history, num],
    }));

    if (solved) {
      merlinAudio.playVictory();
      confetti({ particleCount: 80, spread: 70 });
      setStatusText(`MAGIC SQUARE SOLVED IN ${magicSquareState.moveCount + 1} MOVES!`);
      setSubStatusText('All 8 perimeter lights ON, center 5 OFF! Press SAME GAME for another.');
    } else {
      setStatusText(`Toggled Button [${num}] — Move #${magicSquareState.moveCount + 1}`);
      setSubStatusText('Aim for 1–4, 6–9 ON; 5 OFF.');
    }
  };

  // --- GAME 6: MINDBENDER LOGIC ---
  const handleMindbenderButtonPress = (num: number) => {
    if (num < 1 || num > 9) return;
    if (mindbenderState.status !== 'playing') return;

    if (mindbenderState.currentInput.length >= mindbenderState.codeLength) {
      merlinAudio.playBuzzer();
      setStatusText(`Guess complete (${mindbenderState.currentInput.join('')})`);
      setSubStatusText('Press COMP TURN to submit guess, or wait to re-enter.');
      return;
    }

    merlinAudio.playNote(num, 0.18);
    const newInput = [...mindbenderState.currentInput, num];

    // Light up button
    setLed(num, true, false);

    setMindbenderState(prev => ({
      ...prev,
      currentInput: newInput,
    }));

    setStatusText(`Entered digit: ${newInput.join(' - ')} (${newInput.length}/${mindbenderState.codeLength})`);
    if (newInput.length === mindbenderState.codeLength) {
      setSubStatusText('Code entered! Now press COMP TURN to check against Merlin.');
      setActiveControl('compTurn');
    } else {
      setSubStatusText(`Enter ${mindbenderState.codeLength - newInput.length} more digit(s)...`);
    }
  };

  const handleMindbenderCompTurn = () => {
    if (mindbenderState.currentInput.length < mindbenderState.codeLength) {
      merlinAudio.playBuzzer();
      setStatusText(`Enter ${mindbenderState.codeLength} digits first!`);
      return;
    }

    merlinAudio.playComputerBeep();
    const feedback = evaluateMindbenderGuess(mindbenderState.currentInput, mindbenderState.secretCode);
    const newGuesses = [
      ...mindbenderState.guesses,
      { guess: mindbenderState.currentInput, feedback },
    ];

    const isCracked = feedback.exactMatches === mindbenderState.codeLength;
    const isOut = !isCracked && newGuesses.length >= mindbenderState.maxAttempts;

    // Display feedback on LEDs using authentic Merlin rules:
    // Solid LED: button is in code AND correct position
    // Blinking LED: button is in code BUT wrong position
    // Off: not in code
    const newLeds: LedMatrix = {};
    for (let i = 0; i <= 10; i++) {
      newLeds[i] = { isOn: false, isBlinking: false };
    }
    feedback.solidLeds.forEach(b => {
      newLeds[b] = { isOn: true, isBlinking: false };
    });
    feedback.blinkingLeds.forEach(b => {
      newLeds[b] = { isOn: true, isBlinking: true };
    });
    setLeds(newLeds);

    setMindbenderState(prev => ({
      ...prev,
      guesses: newGuesses,
      currentInput: [],
      status: isCracked ? 'won' : isOut ? 'lost' : 'playing',
      lastFeedback: feedback,
    }));

    if (isCracked) {
      merlinAudio.playVictory();
      confetti({ particleCount: 90, spread: 75 });
      setStatusText(`CODE CRACKED IN ${newGuesses.length} ATTEMPTS!`);
      setSubStatusText(`Secret was [${mindbenderState.secretCode.join(' ')}]. Press SAME GAME to play again.`);
    } else if (isOut) {
      merlinAudio.playBuzzer();
      setStatusText(`OUT OF TURNS! Secret was [${mindbenderState.secretCode.join(' ')}]`);
      setSubStatusText('Press SAME GAME to start a new mystery code.');
    } else {
      setStatusText(
        `Attempt ${newGuesses.length}/${mindbenderState.maxAttempts}: ${feedback.exactMatches} Solid, ${feedback.blinkingLeds.length} Blinking`
      );
      setSubStatusText('SOLID = Right position | BLINK = Wrong position. Enter next guess.');
    }
  };

  // --- Master Button Press Dispatcher (Buttons 0 to 10) ---
  const handleKeypadPress = (num: number) => {
    if (!isPoweredOn) return;

    // If on game selection standby, buttons 1-6 select the game!
    if (activeGameId === 'none') {
      if (num >= 1 && num <= 6) {
        const gameMap: Record<number, GameId> = {
          1: 'tictactoe',
          2: 'music',
          3: 'echo',
          4: 'blackjack',
          5: 'magicsquare',
          6: 'mindbender',
        };
        startSelectedGame(gameMap[num]);
      } else {
        merlinAudio.playBuzzer();
      }
      return;
    }

    // Active game dispatch
    switch (activeGameId) {
      case 'tictactoe':
        handleTttButtonPress(num);
        break;
      case 'music':
        handleMusicButtonPress(num);
        break;
      case 'echo':
        handleEchoButtonPress(num);
        break;
      case 'blackjack':
        // In blackjack, pressing a button shows chip count or plays tone
        merlinAudio.playNote(num, 0.15);
        break;
      case 'magicsquare':
        handleMagicSquareButtonPress(num);
        break;
      case 'mindbender':
        handleMindbenderButtonPress(num);
        break;
    }
  };

  // --- Master Control Buttons Dispatchers ---
  const handleNewGame = () => {
    if (!isPoweredOn) return;
    merlinAudio.playClick();
    startSelectedGame('none');
  };

  const handleSameGame = () => {
    if (!isPoweredOn) return;
    merlinAudio.playClick();

    if (activeGameId === 'none') {
      return;
    }

    // Restart current game
    startSelectedGame(activeGameId);
  };

  const handleHitMe = () => {
    if (!isPoweredOn) return;
    merlinAudio.playClick();

    if (activeGameId === 'blackjack') {
      handleBlackjackHitMe();
    } else {
      // In other games, play tactile sound
      merlinAudio.playClick();
    }
  };

  const handleCompTurn = () => {
    if (!isPoweredOn) return;

    switch (activeGameId) {
      case 'none':
        // Default to Tic-Tac-Toe
        startSelectedGame('tictactoe');
        break;
      case 'tictactoe':
        handleTttCompTurn();
        break;
      case 'music':
        handleMusicCompTurn();
        break;
      case 'echo':
        if (echoState.targetSequence.length > 0) {
          playEchoSequence(echoState.targetSequence);
        }
        break;
      case 'blackjack':
        handleBlackjackCompTurn();
        break;
      case 'magicsquare':
        merlinAudio.playNote(5, 0.2);
        setStatusText(
          magicSquareState.isSolved
            ? 'Already solved!'
            : `Puzzle in progress (${magicSquareState.moveCount} moves). Check 1–4, 6–9 ON; 5 OFF.`
        );
        break;
      case 'mindbender':
        handleMindbenderCompTurn();
        break;
    }
  };

  // Audio settings handlers
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    merlinAudio.setMuted(nextMuted);
  };

  const handleChangeVolume = (vol: number) => {
    setVolume(vol);
    merlinAudio.setVolume(vol);
  };

  return (
    <div className={`min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col justify-between relative selection:bg-red-800 selection:text-white ${scanlinesEnabled ? 'scanlines' : ''}`}>
      
      {/* Vintage Desk Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full border-b border-neutral-800 bg-[#0e0e11]/90 backdrop-blur px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-red-700 border border-red-500 flex items-center justify-center font-bold text-xs text-amber-200 shadow-md">
            M
          </div>
          <div>
            <span className="font-mono font-bold tracking-wider text-sm sm:text-base text-amber-100 uppercase">
              MERLIN
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-neutral-400 font-sans">
              The Electronic Wizard (1978 Parker Brothers)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Manual Button */}
          <button
            onClick={() => setIsManualOpen(true)}
            className="px-3 py-1 bg-[#1c1c22] hover:bg-[#282830] border border-neutral-700 text-amber-300 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            Manual & Rules
          </button>
        </div>
      </header>

      {/* Main Play Area: Centered Merlin Handheld + Companion HUD */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 p-3 sm:p-6 max-w-6xl mx-auto w-full">
        
        {/* The Authentic 1978 Merlin Handheld Device */}
        <div className="flex justify-center items-center py-1">
          <MerlinDevice
            isPoweredOn={isPoweredOn}
            onTogglePower={handleTogglePower}
            leds={leds}
            colorTheme={colorTheme}
            onButtonPress={handleKeypadPress}
            onNewGame={handleNewGame}
            onSameGame={handleSameGame}
            onHitMe={handleHitMe}
            onCompTurn={handleCompTurn}
            activeControl={activeControl}
            hitMeLabel={activeGameId === 'blackjack' ? 'HIT ME' : 'HIT ME'}
            compTurnLabel={
              activeGameId === 'music'
                ? 'PLAY TUNE'
                : activeGameId === 'blackjack'
                ? 'STAND'
                : 'COMP TURN'
            }
          />
        </div>

        {/* Companion HUD Panel (Status readout, Game selector, Songbook, Settings) */}
        <div className="flex justify-center w-full lg:w-auto">
          <CompanionPanel
            activeGameId={activeGameId}
            onSelectGame={startSelectedGame}
            onOpenManual={() => setIsManualOpen(true)}
            colorTheme={colorTheme}
            onChangeColorTheme={setColorTheme}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            volume={volume}
            onChangeVolume={handleChangeVolume}
            statusText={statusText}
            subStatusText={subStatusText}
            onLoadSong={handleLoadSongPreset}
            musicNoteCount={musicState.notes.length}
            scanlinesEnabled={scanlinesEnabled}
            onToggleScanlines={() => setScanlinesEnabled(prev => !prev)}
          />
        </div>

      </main>

      {/* Operating Manual Modal */}
      <InstructionManual
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        activeGameId={activeGameId}
        onSelectGame={startSelectedGame}
      />

      {/* Subtle Bottom Credits Bar */}
      <footer className="relative z-10 w-full border-t border-neutral-900 bg-[#0a0a0c] px-4 py-2 text-center font-mono text-[11px] text-neutral-500">
        Merlin was invented in 1978 by Bob Doyle, Holly Doyle, and Wendl Thomis • Parker Brothers
      </footer>

    </div>
  );
}
