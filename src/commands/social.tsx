import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';
import { social } from '../data/social';

const socialCmd: CommandHandler = () => {
  return (
    <div className="flex flex-col">
      {social.map(({ platform, url }) => (
        <div key={platform} className="grid grid-cols-[100px_1fr] gap-4">
          <span className="font-bold">{platform}:</span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            {url} [↗]
          </a>
        </div>
      ))}
    </div>
  );
};

registerCommand('social', 'Show links to my social media profiles', socialCmd);
