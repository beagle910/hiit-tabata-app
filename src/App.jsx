import { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  // Timer configuration state
  const [timerName, setTimerName] = useState('HIIT / Tabata');
  const [highIntensity, setHighIntensity] = useState(20);
  const [lowIntensity, setLowIntensity] = useState(10);
  const [circuits, setCircuits] = useState(8);
  const [warmup, setWarmup] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Timer running state
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCircuit, setCurrentCircuit] = useState(0);

  // Load saved timer from local storage
  useEffect(() => {
    const savedTimer = localStorage.getItem('hiitTimer');
    if (savedTimer) {
      const { name, high, low, circuits, warmup, cooldown } = JSON.parse(savedTimer);
      setTimerName(name);
      setHighIntensity(high);
      setLowIntensity(low);
      setCircuits(circuits);
      setWarmup(warmup);
      setCooldown(cooldown);
    }
  }, []);

  // Calculate total time
  useEffect(() => {
    const cycleTime = (highIntensity + lowIntensity) * circuits;
    const total = warmup + cycleTime + cooldown;
    setTotalTime(total);
  }, [highIntensity, lowIntensity, circuits, warmup, cooldown]);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          if (currentPhase === 'warmup' && warmup > 0) {
            setCurrentPhase('high');
            setTimeLeft(highIntensity);
          } else if (currentPhase === 'high') {
            setCurrentPhase('low');
            setTimeLeft(lowIntensity);
          } else if (currentPhase === 'low') {
            if (currentCircuit < circuits - 1) {
              setCurrentCircuit((prev) => prev + 1);
              setCurrentPhase('high');
              setTimeLeft(highIntensity);
            } else if (cooldown > 0) {
              setCurrentPhase('cooldown');
              setTimeLeft(cooldown);
            } else {
              setIsRunning(false);
              setCurrentPhase(null);
              return 0;
            }
          } else if (currentPhase === 'cooldown') {
            setIsRunning(false);
            setCurrentPhase(null);
            return 0;
          }
          return prev - 1;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, currentPhase, currentCircuit, highIntensity, lowIntensity, circuits, warmup, cooldown]);

  // Format time in MM:SS
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  // Handle Done button
  const handleDone = () => {
    if (!isRunning) {
      // Save timer config
      const timerConfig = {
        name: timerName,
        high: highIntensity,
        low: lowIntensity,
        circuits,
        warmup,
        cooldown,
      };
      localStorage.setItem('hiitTimer', JSON.stringify(timerConfig));

      // Start timer
      setIsRunning(true);
      setCurrentCircuit(0);
      if (warmup > 0) {
        setCurrentPhase('warmup');
        setTimeLeft(warmup);
      } else {
        setCurrentPhase('high');
        setTimeLeft(highIntensity);
      }
    }
  };

  // Phase display
  const phaseColors = {
    warmup: 'text-blue-500',
    high: 'text-red-500',
    low: 'text-green-500',
    cooldown: 'text-yellow-500',
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
        <button
          onClick={handleDone}
          className={`font-medium ${isRunning ? 'text-gray-500' : 'text-green-500'}`}
          disabled={isRunning}
        >
          Done
        </button>
      </div>
      {/* Timer Display when Running */}
      {isRunning && (
        <div className="text-center mb-6">
          <div className={`text-4xl font-bold ${phaseColors[currentPhase]}`}>
            {currentPhase?.toUpperCase()}: {formatTime(timeLeft)}
          </div>
          <div className="text-lg text-gray-400">
            Circuit {currentCircuit + 1} of {circuits}
          </div>
        </div>
      )}
      {/* Timer Config when Not Running */}
      {!isRunning && (
        <>
          <div className="mb-6">
            <input
              type="text"
              value={timerName}
              onChange={(e) => setTimerName(e.target.value)}
              className="w-full bg-gray-800 text-white text-lg p-2 rounded-lg border-none text-center"
              placeholder="Timer Name"
            />
          </div>
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
          <div className="text-center">
            <span className="text-red-500 text-xl font-bold">Total Time: {formatTime(totalTime)}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
