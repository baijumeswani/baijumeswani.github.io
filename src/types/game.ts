export interface Position {
  x: number;
  y: number;
}

export interface Obstacle {
  id: number;
  type: 'debris' | 'window' | 'bird';
  pos: Position;
  state: number; // e.g. window closing state, or bird animation frame
}

export interface GameState {
  player: Position;
  score: number;
  highScore: number;
  floor: number;
  obstacles: Obstacle[];
  isPaused: boolean;
  isGameOver: boolean;
  cameraY: number; // Vertical scroll offset
  width: number;
  height: number;
}

export type GameAction =
  | { type: 'TICK' }
  | { type: 'MOVE_PLAYER'; dx: number; dy: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESTART' }
  | { type: 'QUIT' };
