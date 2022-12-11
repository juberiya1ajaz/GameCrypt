import AttackImg from '../assets/attack.png';
import HealImg from '../assets/heal.png';

export const ShowdownMenue = ({ onAttack, onHeal }) => (
  <div className="box-border h-full grid">
    <div onClick={onAttack} className="flex rounded bg-orange-900 items-center justify-center text-white text-2xl cursor-pointer">
      Attack
      <img src={AttackImg} alt="Attack" className="w-8 h-8 ml-2" />
    </div>
    <div onClick={onHeal} className="flex rounded bg-orange-900 items-center justify-center text-white text-2xl cursor-pointer">
      Heal
      <img src={HealImg} alt="Heal" className="w-8 h-8 ml-2" />
    </div>
  </div>
);
