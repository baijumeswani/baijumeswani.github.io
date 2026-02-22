import { registerCommand } from './registry';
import type { CommandHandler } from '../types/commands';
import { funFacts } from '../data/funFacts';

const fun: CommandHandler = () => {
  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
  return `💡 Fun Fact: ${randomFact}`;
};

registerCommand('fun', 'Display a random fun fact', fun);
