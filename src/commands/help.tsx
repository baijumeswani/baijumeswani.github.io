import { registerCommand, commandRegistry } from './registry';
import type { CommandHandler } from '../types/commands';

const help: CommandHandler = () => {
  const commands = Array.from(commandRegistry.entries()).map(([name, { description }]) => ({
    name,
    description,
  }));

  return (
    <div className="flex flex-col space-y-1">
      <div>Available commands:</div>
      <div className="pl-4">
        {commands.map(({ name, description }) => (
          <div key={name} className="grid grid-cols-[120px_1fr] gap-4">
            <span className="font-bold cursor-pointer hover:underline">{name}</span>
            <span>- {description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

registerCommand('help', 'Show this help message', help);
registerCommand('?', 'Show this help message', help);
