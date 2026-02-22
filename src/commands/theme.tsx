import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';

const theme: CommandHandler = (_args, { state, dispatch }) => {
  const newTheme = state.theme === 'dark' ? 'light' : 'dark';
  dispatch({ type: 'SET_THEME', theme: newTheme });
  return `🎨 Theme switched to ${newTheme}.`;
};

registerCommand('theme', 'Toggle dark / light theme', theme);
