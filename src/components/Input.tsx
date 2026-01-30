import React, { useState, useRef, useEffect } from 'react';

interface InputProps {
  onSubmit: (command: string) => Promise<void> | void;
}

const Input: React.FC<InputProps> = ({ onSubmit }) => {
  const [command, setCommand] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(command);
    setCommand('');
  };


  return (
    <form onSubmit={handleSubmit}>
      <span>{`> `}</span>
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  outline: 'none',
                  width: 'calc(100% - 2ch)',
                }}      />
    </form>
  );
};

export default Input;
