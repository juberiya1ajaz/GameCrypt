export const ShowdownMenue = ({ onAttack, onHeal }) => (
  <div className="box-border h-full grid">
    <div onClick={onAttack} className="flex rounded bg-orange-900 items-center justify-center text-white text-2xl cursor-pointer">
      Attack
    </div>
    <div onClick={onHeal} className="flex rounded bg-orange-900 items-center justify-center text-white text-2xl cursor-pointer">
      Heal
    </div>
  </div>
);
