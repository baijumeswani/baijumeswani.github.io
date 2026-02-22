import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';
import { skills } from '../data/skills';

const skillsCmd: CommandHandler = () => {
  return (
    <div className="flex flex-col">
      {Object.entries(skills).map(([category, items]) => (
        <div key={category} className="grid grid-cols-[120px_1fr] gap-4 mb-1">
          <span className="font-bold">{category}:</span>
          <span>{items.join(', ')}</span>
        </div>
      ))}
    </div>
  );
};

registerCommand('skills', 'List my technical skills', skillsCmd);
