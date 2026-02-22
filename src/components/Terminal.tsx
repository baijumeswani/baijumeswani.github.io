import React, { useEffect, useRef, useState } from 'react';
import { useTerminal } from '../hooks/useTerminal';
import { commandRegistry } from '../commands/registry';
import '../commands'; // Registers commands
import type { CommandOutput } from '../types/terminal';
import Game from './Game';

const Terminal: React.FC = () => {
  const { state, dispatch } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Focus input on mount and click
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom on output change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [state.output]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const commandLine = state.currentInput.trim();
      if (!commandLine) return;

      const [cmdName, ...args] = commandLine.split(/\s+/);
      const cmd = commandRegistry.get(cmdName);

      let output: CommandOutput;
      if (cmd) {
        try {
          output = await cmd.execute(args, { state, dispatch });
        } catch (err) {
          output = `Error executing command: ${err instanceof Error ? err.message : String(err)}`;
        }
      } else {
        output = `command not found: ${cmdName}. Type 'help' for a list of available commands.`;
      }

      dispatch({ type: 'EXECUTE_COMMAND', command: commandLine, output });
      dispatch({ type: 'SET_INPUT', input: '' });
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (state.history.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < state.history.length) {
          setHistoryIndex(newIndex);
          dispatch({ type: 'SET_INPUT', input: state.history[state.history.length - 1 - newIndex] });
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        dispatch({ type: 'SET_INPUT', input: state.history[state.history.length - 1 - newIndex] });
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        dispatch({ type: 'SET_INPUT', input: '' });
      }
    } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        dispatch({ type: 'SET_INPUT', input: '' });
    } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        dispatch({ type: 'CLEAR' });
    }
  };

  if (state.isPlaying) {
      return (
          <div className={`h-screen w-full font-mono text-lg overflow-hidden flex flex-col ${state.theme === 'dark' ? 'bg-[#0d1117] text-gray-300' : 'bg-white text-gray-800'}`}>
              <Game onExit={() => dispatch({ type: 'EXIT_GAME' })} />
          </div>
      );
  }

  return (
    <div 
      className={`h-screen w-full p-4 font-mono text-lg overflow-hidden flex flex-col ${state.theme === 'dark' ? 'bg-[#0d1117] text-gray-300' : 'bg-white text-gray-800'}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={containerRef} className="flex-1 overflow-y-auto pb-8">
        {state.output.map((entry) => (
          <div key={entry.id} className="mb-2">
            <div className="flex">
              <span className="mr-2 text-green-500">➜</span>
              <span className="text-blue-400 mr-2">~</span>
              <span className="opacity-80">{entry.command}</span>
            </div>
            <div className="whitespace-pre-wrap ml-6">{entry.output}</div>
          </div>
        ))}
        
        <div className="flex items-center">
            <span className="mr-2 text-green-500">➜</span>
            <span className="text-blue-400 mr-2">~</span>
            <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent outline-none border-none caret-gray-400"
                value={state.currentInput}
                onChange={(e) => dispatch({ type: 'SET_INPUT', input: e.target.value })}
                onKeyDown={handleKeyDown}
                autoFocus
                autoComplete="off"
                spellCheck="false"
            />
        </div>
      </div>
    </div>
  );
};

export default Terminal;