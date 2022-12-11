import { useTypedMessage } from '../../hooks';

export const BattleAnnouncer = ({ message }) => {
  const typedMessage = useTypedMessage(message);

  return (
    <div className="h-full p-6 box-border text-white flex items-center justify-center bg-blue-700">
      <div className="text-center text-3xl">{typedMessage}</div>
    </div>
  );
};
