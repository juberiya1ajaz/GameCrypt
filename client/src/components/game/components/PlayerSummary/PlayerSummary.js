import { Bar } from '../index';

const red = '#821400';
const blue = '#1953cb';

export const PlayerSummary = ({
  main,
  name,
  level,
  health,
  maxHealth,
}) => (
  <div
    className="h-40 text-white p-6 box-border flex flex-col justify-between"
    style={{ backgroundColor: main ? red : blue }}
  >
    <div className="flex justify-between">
      <div className="text-3xl">{name}</div>
    </div>

    <div className="">
      <Bar label="CP" value={health} maxValue={maxHealth} />
    </div>
  </div>
);
