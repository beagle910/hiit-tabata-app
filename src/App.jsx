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
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentCircuit, setCurrentCircuit] = useState(0);

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

  useEffect(() => {
    const cycleTime = (highIntensity + lowIntensity) * circuits;
    const total = warmup + cycleTime + cooldown;
    setTotalTime(total);
  }, [highIntensity, lowIntensity, circuits, warmup, cooldown]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
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

  const format
