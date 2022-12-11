export const BattleMenu = ({ onAttack, onMagic, onHeal }) => (
  <div className="box-border h-full grid">
    <div onClick={onAttack} className="flex rounded bg-orange-900 items-center justify-center text-white text-2xl cursor-pointer hover:bg-orange-500">
      Attack
    </div>
    {/* <div onClick={onMagic} className="flex rounded bg-orange-900 items-center justify-center text-white text-2xl cursor-pointer hover:bg-orange-500">
      Magic
    </div> */}
    <div onClick={onHeal} className="flex rounded bg-orange-900 items-center justify-center text-white text-2xl cursor-pointer hover:bg-orange-500">
      Heal
    </div>
  </div>
);
