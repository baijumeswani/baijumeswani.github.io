import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';

const history: CommandHandler = (_args, { state }) => {
  if (state.history.length === 0) return 'No history available.';

  return (
    <div className="flex flex-col">
      {state.history.map((cmd, index) => (
        <div key={index} className="flex">
          <span className="w-8 text-gray-500 text-right mr-4">{index + 1}</span>
          <span>{cmd}</span>
        </div>
      ))}
    </div>
  );
};

registerCommand('history', 'Show command history', history);
