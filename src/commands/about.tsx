import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';
import { about } from '../data/about';

const AboutDisplay = () => {
    return <div className="whitespace-pre-wrap">{about}</div>;
}

const aboutCmd: CommandHandler = () => {
  return <AboutDisplay />;
};

registerCommand('about', 'Learn more about me', aboutCmd);
