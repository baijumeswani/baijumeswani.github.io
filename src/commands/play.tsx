import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';

const play: CommandHandler = (_args, { dispatch }) => {
  dispatch({ type: 'ENTER_GAME' });
  return 'Starting game...';
};

registerCommand('play', 'Play a game', play);
