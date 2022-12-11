import { useEffect, useState } from 'react';
import { useAIOpponent, useBattleSequence } from '../../hooks';
import { opponentStats, playerStats, wait } from '../../shared';
import { BattleMenu, PlayerSummary, BattleAnnouncer } from '../index';

export const Battle = ({ onGameEnd }) => {
  const [sequence, setSequence] = useState({});

  const {
    turn,
    inSequence,
    playerHealth,
    opponentHealth,
    announcerMessage,
  } = useBattleSequence(sequence);

  const aiChoice = useAIOpponent(turn);

  useEffect(() => {
    if (aiChoice && turn === 1 && !inSequence) {
      setSequence({ turn, mode: aiChoice });
    }
  }, [turn, aiChoice, inSequence]);

  useEffect(() => {
    if (playerHealth === 0 || opponentHealth === 0) {
      (async () => {
        await wait(1000);
        onGameEnd(playerHealth === 0 ? opponentStats : playerStats);
      })();
    }
  }, [playerHealth, opponentHealth, onGameEnd]);

  return (
    <>
      <div className="flex flex-col w-full p-6 box-border">
        <div className="">
          <PlayerSummary
            main={false}
            health={opponentHealth}
            name={opponentStats.name}
            level={opponentStats.level}
            maxHealth={opponentStats.maxHealth}
          />
        </div>
      </div>

      <div className="">
        <div className="flex justify-between p-6 w-full box-border">
          <div className="">
            <img
              alt={playerStats.name}
              src={playerStats.img}
              className="w-44 h-36 mt-24"
            />
          </div>
          <div className="">
            <img
              alt={opponentStats.name}
              src={opponentStats.img}
              className="w-36 h-36"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full p-6 box-border">
        <div className="flex items-end justify-start">
          <PlayerSummary
            main={true}
            health={playerHealth}
            name={playerStats.name}
            level={playerStats.level}
            maxHealth={playerStats.maxHealth}
          />
        </div>

        <div className="w-full flex justify-between">
          <div className="h-48">
            <BattleAnnouncer
              message={
                announcerMessage || `What will ${playerStats.name} do?`
              }
            />
          </div>
          {!inSequence && turn === 0 && (
            <div className="h-48">
              <BattleMenu
                onHeal={() => setSequence({ mode: 'heal', turn })}
                onAttack={() => setSequence({ mode: 'attack', turn })}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
