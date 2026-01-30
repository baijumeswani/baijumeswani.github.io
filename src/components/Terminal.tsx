import React, { useEffect, useRef } from 'react';
import Input from './Input';
import Output from './Output';
import Game from './Game';
import { useTerminal } from '../hooks/useTerminal';

const Terminal: React.FC = () => {
  const { history, handleCommand, mode, handleReaderKeys, exitGame } = useTerminal();
  const gameRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (mode === 'reading') {
        handleReaderKeys(event.key);
      } else if (mode === 'game') {
        if (event.ctrlKey && event.key === 'c') {
          exitGame();
        } else {
          gameRef.current?.handleGameKey(event.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode, handleReaderKeys, exitGame]);

  return (
    <div>
      {mode === 'game' ? (
        <Game ref={gameRef} exitGame={exitGame} />
      ) : (
        <>
          <Output history={history} />
          {mode === 'normal' && <Input onSubmit={handleCommand} />}
        </>
      )}
    </div>
  );
};

export default Terminal;


