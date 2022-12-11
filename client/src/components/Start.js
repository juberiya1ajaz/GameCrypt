import { useEffect, useState } from 'react';
// import { Battle, EndMenu, StartMenu } from '../index';

import {Showdown} from "./Showdown"
import {EndMenue} from './EndMenue';
import {Menue} from "./Menue"


export const Start = () => {
  const [winner, setWinner] = useState();
  const [mode, setMode] = useState('start');

  useEffect(() => {
    if (mode === 'battle') {
      setWinner(undefined);
    }
  }, [mode]);

  return (
    <div className="w-screen h-screen flex items-center flex-col justify-between">
      {mode === 'start' && (
        <Menue onStartClick={() => setMode('battle')} />
      )}

      {mode === 'battle' && (
        <Showdown
          onGameEnd={winner => {
            setWinner(winner);
            setMode('gameOver');
          }}
        />
      )}

      {mode === 'gameOver' && !!winner && (
        <EndMenue winner={winner} onStartClick={() => setMode('battle')} />
      )}
    </div>
  );
};
