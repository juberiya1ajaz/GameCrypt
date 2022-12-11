export const EndMenu = ({ winner, onStartClick }) => {
  return (
    <div className="h-screen flex flex-col justify-center">
      <h1>{winner.name} has won!</h1>
      <button className="p-4 text-3xl cursor-pointer rounded bg-white" onClick={onStartClick}>
        Play Again
      </button>
    </div>
  );
};
