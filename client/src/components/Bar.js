export const Bar = ({ value, maxValue, label }) => (
  <div className="flex rounded p-1 items-center bg-white">
    <div className="text-3xl font-bold h-8 flex items-center justify-center text-black">{label}</div>
    <div className="h-8 rounded overflow-hidden box-border">
      <div
        className="h-full bg-blue-600"
        style={{ width: `${(value / maxValue) * 100}%` }}
      ></div>
    </div>
  </div>
);
