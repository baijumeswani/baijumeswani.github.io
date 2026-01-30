import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface GameProps {
  exitGame: () => void;
}

const GAME_WIDTH = 20;
const GAME_HEIGHT = 15;

const Game = forwardRef<any, GameProps>(({ exitGame }, ref) => {
  const [player, setPlayer] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 1 });
  const [obstacles, setObstacles] = useState<{ x: number; y: number }[]>([]);
  const [windows, setWindows] = useState<{ x: number; y: number; open: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize windows
  useEffect(() => {
    const newWindows = [];
    for (let y = 0; y < GAME_HEIGHT -1; y += 2) {
      for (let x = 2; x < GAME_WIDTH - 2; x += 4) {
        newWindows.push({ x, y, open: true });
      }
    }
    setWindows(newWindows);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      // Move obstacles
      setObstacles((obs) =>
        obs
          .map((o) => ({ ...o, y: o.y + 1 }))
          .filter((o) => o.y < GAME_HEIGHT)
      );

      // Add new obstacles
      if (Math.random() < 0.3) {
        setObstacles((obs) => [
          ...obs,
          { x: Math.floor(Math.random() * (GAME_WIDTH - 2)) + 1, y: 0 },
        ]);
      }
      
      // Open/close windows
      setWindows(wins => wins.map(w => ({...w, open: Math.random() < 0.9 ? w.open : !w.open })));

      // Update score
      setScore((s) => s + 1);

      // Collision detection
      if (obstacles.some((o) => o.x === player.x && o.y === player.y)) {
        setGameOver(true);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [gameOver, obstacles, player]);

  useImperativeHandle(ref, () => ({
    handleGameKey(key: string) {
      if (gameOver) return;

      setPlayer((p) => {
        let newX = p.x;
        let newY = p.y;
        if (key === 'ArrowUp' || key === 'w') newY--;
        if (key === 'ArrowDown' || key === 's') newY++;
        if (key === 'ArrowLeft' || key === 'a') newX--;
        if (key === 'ArrowRight' || key === 'd') newX++;

        // boundary check
        if (newX < 1) newX = 1;
        if (newX >= GAME_WIDTH - 1) newX = GAME_WIDTH - 2;
        if (newY < 0) newY = 0;
        if (newY >= GAME_HEIGHT) newY = GAME_HEIGHT - 1;

        // window collision
        const targetWindow = windows.find(w => w.x === newX && w.y === newY);
        if (targetWindow && !targetWindow.open) {
          return p; // can't move into a closed window
        }

        return { x: newX, y: newY };
      });
    },
  }));

  // Rendering
  const renderGame = () => {
    const grid = Array(GAME_HEIGHT)
      .fill(null)
      .map(() => Array(GAME_WIDTH).fill(' '));

    // Draw building walls
    for (let i = 0; i < GAME_HEIGHT; i++) {
      grid[i][0] = '|';
      grid[i][GAME_WIDTH - 1] = '|';
    }

    // Draw windows
    windows.forEach(w => {
      grid[w.y][w.x] = w.open ? 'O' : 'X';
    });

    // Draw obstacles
    obstacles.forEach((o) => {
      grid[o.y][o.x] = '*';
    });
    
    // Draw player
    if (!gameOver) {
      grid[player.y][player.x] = '@';
    }

    return grid.map((row) => row.join('')).join('\n');
  };

  return (
    <pre>
      {renderGame()}
      <div>Score: {score}</div>
      {gameOver && <div>Game Over</div>}
      <div>Press Ctrl+C to exit</div>
      <div className="mobile-controls">
        <button onClick={() => handleGameKey('ArrowUp')}>Up</button>
        <div>
          <button onClick={() => handleGameKey('ArrowLeft')}>Left</button>
          <button onClick={() => handleGameKey('ArrowRight')}>Right</button>
        </div>
        <button onClick={() => handleGameKey('ArrowDown')}>Down</button>
      </div>
      <style>{`
        .mobile-controls {
          display: none;
        }
        @media (max-width: 768px) {
          .mobile-controls {
            display: block;
            text-align: center;
          }
          .mobile-controls button {
            margin: 5px;
            padding: 10px;
          }
        }
      `}</style>
    </pre>
  );
});

export default Game;