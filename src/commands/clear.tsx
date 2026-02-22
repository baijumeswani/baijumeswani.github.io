import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';

const clear: CommandHandler = (_args, { dispatch }) => {
  dispatch({ type: 'CLEAR' });
  return '';
};

registerCommand('clear', 'Clear the terminal screen', clear);
registerCommand('cls', 'Clear the terminal screen', clear);
