import type { ReactNode, Dispatch } from 'react';

export type CommandOutput = string | ReactNode;

export interface TerminalState {
  history: string[];
  output: { command: string; output: CommandOutput; id: string }[];
  currentInput: string;
  theme: 'dark' | 'light';
  isPlaying: boolean;
}

export type TerminalAction =
  | { type: 'EXECUTE_COMMAND'; command: string; output: CommandOutput }
  | { type: 'CLEAR' }
  | { type: 'SET_INPUT'; input: string }
  | { type: 'SET_THEME'; theme: 'dark' | 'light' }
  | { type: 'ENTER_GAME' }
  | { type: 'EXIT_GAME' };

export interface TerminalContextType {
  state: TerminalState;
  dispatch: Dispatch<TerminalAction>;
}