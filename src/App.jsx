import { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [timerName, setTimerName] = useState('HIIT / Tabata');
  const [highIntensity, setHighIntensity] = useState(20);
  const [lowIntensity, setLowIntensity] = useState(10);
  const [circuits, setCircuits] = useState(8);
  const [warmup, setWarmup] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const cycleTime = (highIntensity + lowIntensity) * circuits;
    const total = warmup + cycleTime + cooldown;
    setTotalTime(total);
  }, [highIntensity, lowIntensity, circuits, warmup, cooldown]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4">
      {/* Status Bar */}
      <div className="flex justify-between text-sm text-gray-400 mb-4">
        <span>{new Date().toLocaleTimeString()}</span>
        <span>Wi-Fi</span>
      </div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <button className="text-red-500 font-medium">Cancel</button>
        <button className="text-green-500 font-medium">Done</button>
      </div>
      {/* Timer Name */}
      <div className="mb-6">
        <input
          type="text"
          value={timerName}
          onChange={(e) => setTimerName(e.target.value)}
          className="w-full bg-gray-800 text-white text-lg p-2 rounded-lg border-none text-center"
          placeholder="Timer Name"
        />
      </div>
      {/* Interval Settings */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
          <span className="text-red-500">High Intensity</span>
          <input
            type="number"
            value={highIntensity}
            onChange={(e) => setHighIntensity(Math.max(0, e.target.value))}
            className="w-20 bg-gray-700 text-red-500 text-right p-1 rounded border-none"
          />
        </div>
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
          <span className="text-green-500">Low Intensity</span>
          <input
            type="number"
            value={lowIntensity}
            onChange={(e) => setLowIntensity(Math.max(0, e.target.value))}
            className="w-20 bg-gray-700 text-green-500 text-right p-1 rounded border-none"
          />
        </div>
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
          <span className="text-white">Circuits</span>
          <input
            type="number"
            value={circuits}
            onChange={(e) => setCircuits(Math.max(1, e.target.value))}
            className="w-20 bg-gray-700 text-white text-right p-1 rounded border-none"
          />
        </div>
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
          <span className="text-blue-500">Warmup (optional)</span>
          <input
            type="number"
            value={warmup}
            onChange={(e) => setWarmup(Math.max(0, e.target.value))}
            className="w-20 bg-gray-700 text-blue-500 text-right p-1 rounded border-none"
          />
        </div>
        <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
          <span className="text-yellow-500">Cooldown (optional)</span>
          <input
            type="number"
            value={cooldown}
            onChange={(e) => setCooldown(Math.max(0, e.target.value))}
            className="w-20 bg-gray-700 text-yellow-500 text-right p-1 rounded border-none"
          />
        </div>
      </div>
      {/* Total Time */}
      <div className="text-center">
        <span className="text-red-500 text-xl font-bold">Total Time: {formatTime(totalTime)}</span>
      </div>
    </div>
  );
};

export default App;
