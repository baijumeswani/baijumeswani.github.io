import { useReducer } from 'react';
import type { TerminalState, TerminalAction, TerminalContextType } from '../types/terminal';

const initialState: TerminalState = {
  history: [],
  output: [],
  currentInput: '',
  theme: 'dark',
  isPlaying: false,
};

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case 'EXECUTE_COMMAND':
      return {
        ...state,
        history: [...state.history, action.command],
        output: [...state.output, { command: action.command, output: action.output, id: crypto.randomUUID() }],
        currentInput: '',
      };
    case 'CLEAR':
      return {
        ...state,
        output: [],
      };
    case 'SET_INPUT':
      return {
        ...state,
        currentInput: action.input,
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.theme,
      };
    case 'ENTER_GAME':
      return {
        ...state,
        isPlaying: true,
      };
    case 'EXIT_GAME':
      return {
        ...state,
        isPlaying: false,
      };
    default:
      return state;
  }
}

export const useTerminal = (): TerminalContextType => {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  
  return { state, dispatch };
};