import { useState, useEffect, useRef, useCallback } from 'react';
import { BiometricReading, StressBand } from '../types';

export function getStressBand(score: number): StressBand {
  if (score >= 70) return 'High';
  if (score >= 40) return 'Elevated';
  return 'Optimal';
}

export function useBiometricSimulator(initialStress: number = 42, initialHR: number = 76) {
  const [currentReading, setCurrentReading] = useState<BiometricReading>(() => {
    const band = getStressBand(initialStress);
    return {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      heartRate: initialHR,
      stressScore: initialStress,
      dutyCycleActiveMinutes: 340, // 5h 40m active
      dutyCycleRestMinutes: 80,    // 1h 20m rest
      stressBand: band
    };
  });

  const [history, setHistory] = useState<BiometricReading[]>(() => {
    const initialList: BiometricReading[] = [];
    const now = Date.now();
    let prevStress = initialStress;
    let prevHR = initialHR;

    for (let i = 14; i >= 0; i--) {
      const time = new Date(now - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const deltaS = (Math.random() - 0.48) * 6;
      const deltaH = (Math.random() - 0.48) * 4;

      prevStress = Math.min(100, Math.max(12, Math.round(prevStress + deltaS)));
      prevHR = Math.min(140, Math.max(55, Math.round(prevHR + deltaH)));

      initialList.push({
        timestamp: time,
        heartRate: prevHR,
        stressScore: prevStress,
        dutyCycleActiveMinutes: 340 - i * 4,
        dutyCycleRestMinutes: 80,
        stressBand: getStressBand(prevStress)
      });
    }

    return initialList;
  });

  const [isPaused, setIsPaused] = useState(false);
  const isBluetoothConnected = useRef(false);
  const elevatedMinutesCounter = useRef(0);

  // Directly push real Bluetooth smartwatch heart rate reading
  const updateRealBluetoothHeartRate = useCallback((realBpm: number) => {
    isBluetoothConnected.current = true;

    // Estimate stress score from real heart rate (physiological baseline mapping: 60 bpm -> 20, 110+ bpm -> 75+)
    let calculatedStress = Math.round(20 + Math.max(0, (realBpm - 60) * 1.1));
    calculatedStress = Math.min(99, Math.max(10, calculatedStress));

    const band = getStressBand(calculatedStress);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newReading: BiometricReading = {
      timestamp: timeStr,
      heartRate: realBpm,
      stressScore: calculatedStress,
      dutyCycleActiveMinutes: currentReading.dutyCycleActiveMinutes,
      dutyCycleRestMinutes: currentReading.dutyCycleRestMinutes,
      stressBand: band
    };

    setCurrentReading(newReading);
    setHistory(h => {
      const nextArr = [...h, newReading];
      return nextArr.length > 30 ? nextArr.slice(nextArr.length - 30) : nextArr;
    });
  }, [currentReading.dutyCycleActiveMinutes, currentReading.dutyCycleRestMinutes]);

  // Function to simulate a stress spike for testing high threshold & triage trigger
  const triggerSimulatedSpike = (targetStress: number = 84, targetHR: number = 118) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const band = getStressBand(targetStress);
    const spikeReading: BiometricReading = {
      timestamp,
      heartRate: targetHR,
      stressScore: targetStress,
      dutyCycleActiveMinutes: currentReading.dutyCycleActiveMinutes + 1,
      dutyCycleRestMinutes: currentReading.dutyCycleRestMinutes,
      stressBand: band
    };
    setCurrentReading(spikeReading);
    setHistory(prev => [...prev.slice(1), spikeReading]);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      // If real smartwatch is connected, suspend random-walk generator
      if (isBluetoothConnected.current) return;

      setCurrentReading(prev => {
        const deltaStress = (Math.random() - 0.47) * 5;
        const deltaHR = (Math.random() - 0.48) * 3;

        const newStress = Math.min(98, Math.max(15, Math.round(prev.stressScore + deltaStress)));
        const newHR = Math.min(138, Math.max(56, Math.round(prev.heartRate + deltaHR)));

        const band = getStressBand(newStress);
        if (band === 'Elevated' || band === 'High') {
          elevatedMinutesCounter.current += 0.05;
        } else {
          elevatedMinutesCounter.current = Math.max(0, elevatedMinutesCounter.current - 0.05);
        }

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const updated: BiometricReading = {
          timestamp: timeStr,
          heartRate: newHR,
          stressScore: newStress,
          dutyCycleActiveMinutes: prev.dutyCycleActiveMinutes + (Math.random() > 0.8 ? 1 : 0),
          dutyCycleRestMinutes: prev.dutyCycleRestMinutes,
          stressBand: band
        };

        setHistory(h => {
          const nextArr = [...h, updated];
          return nextArr.length > 30 ? nextArr.slice(nextArr.length - 30) : nextArr;
        });

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return {
    currentReading,
    history,
    isPaused,
    setIsPaused,
    triggerSimulatedSpike,
    updateRealBluetoothHeartRate,
    elevatedDurationMinutes: Math.round(elevatedMinutesCounter.current)
  };
}
