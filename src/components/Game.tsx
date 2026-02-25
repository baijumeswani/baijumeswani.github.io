import React, { useEffect, useRef } from 'react';
import { useGame } from '../hooks/useGameLoop';

interface GameProps {
  onExit: () => void;
}

const Game: React.FC<GameProps> = ({ onExit }) => {
  const { state, dispatch } = useGame();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation(); // prevent terminal from handling it

    if (state.isGameOver) {
        if (e.key === 'Enter') dispatch({ type: 'RESTART' });
        if (e.key === 'q' || e.key === 'Q') onExit();
        return;
    }

    if (e.key === 'Escape' || e.key === 'p') {
        if (state.isPaused) dispatch({ type: 'RESUME' });
        else dispatch({ type: 'PAUSE' });
        return;
    }

    if (state.isPaused) return;

    if (e.key === 'ArrowUp' || e.key === 'w') dispatch({ type: 'MOVE_PLAYER', dx: 0, dy: 1 });
    else if (e.key === 'ArrowDown' || e.key === 's') dispatch({ type: 'MOVE_PLAYER', dx: 0, dy: -1 });
    else if (e.key === 'ArrowLeft' || e.key === 'a') dispatch({ type: 'MOVE_PLAYER', dx: -1, dy: 0 });
    else if (e.key === 'ArrowRight' || e.key === 'd') dispatch({ type: 'MOVE_PLAYER', dx: 1, dy: 0 });
    else if (e.key === 'c' && e.ctrlKey) onExit();
  };

  const renderGrid = () => {
      const rows = [];
      const { width, height, cameraY, player, obstacles } = state;
      
      // HUD
      rows.push(` Score: ${state.score}  |  Floor: ${state.floor}  |  High: ${state.highScore} `);
      rows.push('─'.repeat(width));

      for (let y = height - 1; y >= 0; y--) {
          let rowStr = '';
          const worldY = y + Math.floor(cameraY);
          
          for (let x = 0; x < width; x++) {
              let char = ' ';
              
              // Borders
              if (x === 0 || x === width - 1) {
                  char = '|';
              } else {
                  // Game Objects
                  if (Math.round(player.x) === x && Math.round(player.y) === worldY) {
                      char = '@';
                  } else {
                      const obstacle = obstacles.find(o => Math.round(o.pos.x) === x && Math.round(o.pos.y) === worldY);
                      if (obstacle) {
                          char = obstacle.type === 'bird' ? (obstacle.state > 0 ? '>' : '<') : '*';
                      } else {
                          // Background pattern
                          if (x % 10 === 0) {
                              if (worldY % 5 === 2) char = '[';
                              else if (worldY % 5 === 3) char = ']';
                          }
                      }
                  }
              }
              rowStr += char;
          }
          rows.push(rowStr);
      }
      return rows.join('\n');
  };

  if (state.isGameOver) {
      return (
        <div 
          ref={containerRef} 
          tabIndex={0} 
          onKeyDown={handleKeyDown} 
          className="w-full h-full flex flex-col items-center justify-center bg-black text-white outline-none absolute inset-0 z-50"
        >
            <div className="text-center font-mono px-4">
                <div className="text-red-500 font-bold mb-4 text-4xl">GAME OVER</div>
                <div className="text-2xl mb-2">Score: {state.score}</div>
                <div className="text-xl mb-8">High Score: {state.highScore}</div>
                <div className="text-gray-400 mb-8">Press Enter to retry or Q to quit</div>
                <div className="flex gap-4 justify-center md:hidden">
                    <button onClick={() => dispatch({ type: 'RESTART' })} className="px-6 py-3 bg-white/10 rounded-lg active:bg-white/20 select-none touch-none">Retry</button>
                    <button onClick={() => onExit()} className="px-6 py-3 bg-red-500/20 rounded-lg active:bg-red-500/40 select-none touch-none">Quit</button>
                </div>
            </div>
        </div>
      );
  }

  const handleMove = (dx: number, dy: number) => {
      dispatch({ type: 'MOVE_PLAYER', dx, dy });
  };

  return (
    <div 
      ref={containerRef} 
      tabIndex={0} 
      onKeyDown={handleKeyDown} 
      className="w-full h-full flex flex-col items-center justify-center bg-black text-white outline-none absolute inset-0 z-50"
    >
      <div className="flex-1 w-full flex items-center justify-center min-h-0 overflow-hidden">
        <pre className="font-mono leading-none whitespace-pre select-none text-[10px] sm:text-xs md:text-base">
          {renderGrid()}
        </pre>
      </div>

      {/* Mobile Controls */}
      <div className="w-full bg-black/90 flex flex-col items-center justify-center gap-2 pb-8 pt-4 md:hidden z-50 border-t border-white/10 shrink-0">
          <div className="flex w-full max-w-sm justify-between px-6 mb-2">
              <button onClick={() => onExit()} className="px-4 py-2 bg-red-500/20 rounded-lg active:bg-red-500/40 font-mono text-sm select-none touch-none">QUIT</button>
              <button onClick={() => { if (state.isPaused) dispatch({ type: 'RESUME' }); else dispatch({ type: 'PAUSE' }); }} className="px-4 py-2 bg-white/10 rounded-lg active:bg-white/20 font-mono text-sm select-none touch-none">{state.isPaused ? 'RESUME' : 'PAUSE'}</button>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button 
                onClick={() => handleMove(0, 1)}
                className="w-16 h-12 bg-white/10 rounded-lg active:bg-white/30 flex items-center justify-center text-2xl select-none touch-none"
            >↑</button>
            <div className="flex gap-2">
                <button 
                    onClick={() => handleMove(-1, 0)}
                    className="w-16 h-12 bg-white/10 rounded-lg active:bg-white/30 flex items-center justify-center text-2xl select-none touch-none"
                >←</button>
                <button 
                    onClick={() => handleMove(0, -1)}
                    className="w-16 h-12 bg-white/10 rounded-lg active:bg-white/30 flex items-center justify-center text-2xl select-none touch-none"
                >↓</button>
                <button 
                    onClick={() => handleMove(1, 0)}
                    className="w-16 h-12 bg-white/10 rounded-lg active:bg-white/30 flex items-center justify-center text-2xl select-none touch-none"
                >→</button>
            </div>
          </div>
      </div>

      {state.isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none z-40">
              <div className="text-white font-bold text-4xl">PAUSED</div>
          </div>
      )}
    </div>
  );
};

export default Game;