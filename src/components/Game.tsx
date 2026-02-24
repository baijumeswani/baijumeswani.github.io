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
          className="w-full h-full flex items-center justify-center bg-black text-white outline-none absolute inset-0 z-50"
        >
            <div className="text-center font-mono">
                <div className="text-red-500 font-bold mb-4 text-4xl">GAME OVER</div>
                <div className="text-2xl mb-2">Score: {state.score}</div>
                <div className="text-xl mb-8">High Score: {state.highScore}</div>
                <div className="text-gray-400">Press Enter to retry or Q to quit</div>
            </div>
        </div>
      );
  }

  return (
    <div 
      ref={containerRef} 
      tabIndex={0} 
      onKeyDown={handleKeyDown} 
      className="w-full h-full flex items-center justify-center bg-black text-white outline-none absolute inset-0 z-50"
    >
      <pre className="font-mono leading-none whitespace-pre select-none text-sm md:text-base">
        {renderGrid()}
      </pre>
      {state.isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-white font-bold text-4xl">PAUSED</div>
          </div>
      )}
    </div>
  );
};

export default Game;