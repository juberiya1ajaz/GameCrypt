import { useEffect, useState } from 'react';
// import { useAIOpponent, useBattleSequence } from 'hooks';
// import { opponentStats, playerStats, wait } from 'shared';
// import { BattleMenu, PlayerSummary, BattleAnnouncer } from '../index';

import { PlayWithComputer } from "../hooks/playWithComputer"
import { useShowdownSequence } from "../hooks/useShowdownSequence"
import { wait } from "../helpers/helper"
import { playerStats, opponentStats } from "../helpers/player"
import { ShowdownMenue } from "./ShowdownMenue"
import { PlayerSummary } from "./PlayerSummary"
import { ShowdownAnnouncer } from "./ShowdownAnnouncer"

export const Showdown = ({ onGameEnd }) => {
    const [sequence, setSequence] = useState({});

    const {
        turn,
        inSequence,
        playerHealth,
        opponentHealth,
        playerAnimation,
        opponentAnimation,
        announcerMessage,
    } = useShowdownSequence(sequence);

    const aiChoice = PlayWithComputer(turn);

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
                <div className="items-start justify-end">
                    <PlayerSummary
                        main={false}
                        health={opponentHealth}
                        name={opponentStats.name}
                        level={opponentStats.level}
                        maxHealth={opponentStats.maxHealth}
                    />
                </div>
            </div>

            <div className="w-full text-center">
                <div className="text-5xl text-yellow-600">
                    {playerStats.name} vs {opponentStats.name}
                </div>
                <div className="flex justify-between p-6 box-border">
                    <div className="">
                        <img
                            alt={playerStats.name}
                            src={playerStats.img}
                            className=""
                        />
                    </div>
                    <div className="">
                        <img
                            alt={opponentStats.name}
                            src={opponentStats.img}
                            className=""
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full p-6 box-border">
                <div className="items-start justify-end">
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
                        <ShowdownAnnouncer
                            message={
                                announcerMessage || `What will ${playerStats.name} do?`
                            }
                        />
                    </div>
                    {!inSequence && turn === 0 && (
                        <div className="h-48">
                            <ShowdownMenue
                                onHeal={() => setSequence({ mode: 'heal', turn })}
                                onMagic={() => setSequence({ mode: 'magic', turn })}
                                onAttack={() => setSequence({ mode: 'attack', turn })}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
