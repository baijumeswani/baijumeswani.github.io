import { useEffect, useReducer } from 'react';
import type { GameState, GameAction, Obstacle, Position } from '../types/game';

const WIDTH = 40;
const HEIGHT = 24;

const getInitialState = (): GameState => ({
  player: { x: Math.floor(WIDTH / 2), y: 2 },
  score: 0,
  highScore: Number(localStorage.getItem('terminal-climber-highscore') || 0),
  floor: 0,
  obstacles: [],
  isPaused: false,
  isGameOver: false,
  cameraY: 0,
  width: WIDTH,
  height: HEIGHT,
});

function checkCollision(player: Position, obstacles: Obstacle[]): boolean {
  return obstacles.some(obs => 
      Math.abs(obs.pos.x - player.x) < 1 && Math.abs(obs.pos.y - player.y) < 1
  );
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'RESTART') {
    return getInitialState();
  }
  
  if (state.isGameOver) return state;

  switch (action.type) {
    case 'PAUSE':
      return { ...state, isPaused: true };
    case 'RESUME':
      return { ...state, isPaused: false };
    case 'MOVE_PLAYER': {
      if (state.isPaused) return state;
      const newX = Math.max(1, Math.min(WIDTH - 2, state.player.x + action.dx));
      const newY = Math.max(state.cameraY, state.player.y + action.dy);

      return {
          ...state,
          player: { x: newX, y: newY },
      };
    }
    case 'TICK': {
      if (state.isPaused) return state;
      
      // Update camera logic: keep player in lower third if possible, or just scroll up as they climb
      let cameraY = state.cameraY;
      if (state.player.y - cameraY > HEIGHT / 3) {
          cameraY += 0.5; // Smooth scroll? No, grid based.
           cameraY = Math.floor(state.player.y - HEIGHT / 3);
      }
      if (cameraY < 0) cameraY = 0;

      // Spawn obstacles
      let obstacles = [...state.obstacles];
      const spawnProbability = Math.min(0.05 + (state.floor * 0.015), 0.35); // Max 35% spawn rate
      if (Math.random() < spawnProbability) {
          // After floor 5, 25% chance of spawning a bird instead of debris
          const isBird = state.floor >= 5 && Math.random() < 0.25; 
          
          obstacles.push({
              id: Math.random(),
              type: isBird ? 'bird' : 'debris',
              pos: { 
                  x: isBird ? (Math.random() > 0.5 ? 1 : WIDTH - 2) : Math.floor(Math.random() * (WIDTH - 2)) + 1, 
                  y: cameraY + HEIGHT + Math.floor(Math.random() * 5) // Stagger spawns vertically
              },
              state: isBird ? (Math.random() > 0.5 ? 1 : -1) : 0 // 1 for right, -1 for left
          });
      }

      // Move obstacles
      const fallSpeed = Math.min(0.5 + (state.floor * 0.025), 1.8); // Debris falls faster on higher floors
      obstacles = obstacles.map(o => {
          if (o.type === 'debris') {
              return { ...o, pos: { ...o.pos, y: o.pos.y - fallSpeed } };
          } else if (o.type === 'bird') {
              const birdSpeed = Math.min(0.4 + (state.floor * 0.01), 1.0);
              return { ...o, pos: { x: o.pos.x + (o.state * birdSpeed), y: o.pos.y - (fallSpeed * 0.3) } };
          }
          return o;
      }).filter(o => o.pos.y >= cameraY - 5 && o.pos.x > -5 && o.pos.x < WIDTH + 5);

      // Check collision
      if (checkCollision(state.player, obstacles)) {
          const newHighScore = Math.max(state.score, state.highScore);
          localStorage.setItem('terminal-climber-highscore', String(newHighScore));
          return { ...state, isGameOver: true, highScore: newHighScore };
      }

      return {
          ...state,
          cameraY,
          obstacles,
          score: Math.max(state.score, Math.floor(state.player.y * 10)),
          floor: Math.floor(state.player.y / 5),
      };
    }
    default:
      return state;
  }
}

export const useGame = () => {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);
  
  useEffect(() => {
    let lastTime = 0;
    let frameId: number;
    
    const loop = (time: number) => {
        if (time - lastTime > 100) { // 10 TPS
            dispatch({ type: 'TICK' });
            lastTime = time;
        }
        frameId = requestAnimationFrame(loop);
    };
    
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return { state, dispatch };
};
