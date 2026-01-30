import { useState } from 'react';
import { about } from '../data/about';
import data from '../data/funfacts.json';

const commands: Record<string, () => string | Promise<string> | void> = {
  '?': () => `
    Available commands:

      about    - Learn more about me
      skills   - List my technical skills
      contact  - Display my contact information
      social   - Show links to my social media profiles
      fun      - Display a random fun fact
      play     - Play a game
      clear    - Clear the terminal screen
      ?        - Show this help message
  `,
  help: () => commands['?'](),
  skills: () => `
    Languages:  JavaScript, Python, HTML/CSS
    Frameworks: React, Node.js, Express
    Databases:  MongoDB, PostgreSQL
    Tools:      Git, Docker, Webpack
  `,
  contact: () => 'Email: your.email@example.com',
  social: () => `
    GitHub:     https://github.com/your-username
    LinkedIn:   https://linkedin.com/in/your-username
    Twitter:    https://twitter.com/your-username
  `,
  fun: async () => {
    const fact = data.facts[Math.floor(Math.random() * data.facts.length)];
    return `💡 Fun Fact: ${fact}`;
  },
  about: () => { },
  play: () => { },
};

export const useTerminal = () => {
  const [history, setHistory] = useState<string[]>([
    'Welcome to my interactive portfolio!',
    'Type "?" to see the list of available commands.',
  ]);
  const [mode, setMode] = useState<'normal' | 'reading' | 'game'>('normal');
  const [page, setPage] = useState(0);

  const handleCommand = async (command: string) => {
    if (mode !== 'normal') return;

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    const newHistory = [...history, `> ${command}`];

    if (command === 'about') {
      newHistory.push(about[0]);
      if (about.length > 1) {
        newHistory.push('--More--');
      }
      setHistory(newHistory);
      setMode('reading');
      setPage(1);
      return;
    }

    if (command === 'play') {
      setMode('game');
      return;
    }

    if (command in commands) {
      const output = await commands[command]();
      if (output) {
        newHistory.push(output);
      }
    } else {
      newHistory.push(`command not found: ${command}. Type '?' for a list of available commands.`);
    }
    setHistory(newHistory);
  };

  const handleReaderKeys = (key: string) => {
    if (key === 'q') {
      const newHistory = [...history];
      if (newHistory[newHistory.length - 1] === '--More--') {
        newHistory.pop();
      }
      setHistory(newHistory);
      setMode('normal');
      setPage(0);
      return;
    }

    if (key === 'Enter') {
      if (page < about.length) {
        const newHistory = [...history];
        newHistory.pop(); // remove --More--
        newHistory.push(about[page]);
        if (page < about.length - 1) {
          newHistory.push('--More--');
        }
        setHistory(newHistory);
        setPage(page + 1);
      } else {
        setMode('normal');
        setPage(0);
      }
    }
  };

  const exitGame = () => {
    setMode('normal');
  };

  return { history, handleCommand, mode, handleReaderKeys, exitGame };
};
