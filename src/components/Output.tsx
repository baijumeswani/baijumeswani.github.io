import React from 'react';

interface OutputProps {
  history: string[];
}

const Output: React.FC<OutputProps> = ({ history }) => {
  return (
    <div role="log">
      {history.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};

export default Output;
