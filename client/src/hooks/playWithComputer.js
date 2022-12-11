import { useEffect, useState } from 'react';

export const PlayWithComputer = turn => {
  const [aiChoice, setAIChoice] = useState('');

  useEffect(() => {
    if (turn === 1) {
      const options = ['attack', 'heal'];
      setAIChoice(options[Math.floor(Math.random() * options.length)]);
    }
  }, [turn]);

  return aiChoice;
};
