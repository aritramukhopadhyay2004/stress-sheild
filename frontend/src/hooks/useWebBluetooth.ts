import { useState } from 'react';

export function useWebBluetooth(onHeartRateReceived?: (bpm: number) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [latestHR, setLatestHR] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectSmartwatch = async () => {
    setError(null);
    if (!navigator.bluetooth) {
      setError('Web Bluetooth API is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    try {
      // Request standard Heart Rate BLE service (0x180D)
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service']
      });

      setDeviceName(device.name || 'Smartwatch / Fitness Band');

      const server = await device.gatt?.connect();
      if (!server) throw new Error('Could not connect to GATT Server');

      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');

      await characteristic.startNotifications();
      setIsConnected(true);

      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value: DataView = event.target.value;
        const flags = value.getUint8(0);
        let hr = 0;
        if ((flags & 0x01) === 0) {
          hr = value.getUint8(1);
        } else {
          hr = value.getUint16(1, true);
        }

        setLatestHR(hr);
        if (onHeartRateReceived) {
          onHeartRateReceived(hr);
        }
      });

      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setDeviceName(null);
      });
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        console.error('[Web Bluetooth Error]', err);
        setError(err.message || 'Failed to connect via Bluetooth');
      }
    }
  };

  return {
    isConnected,
    deviceName,
    latestHR,
    error,
    connectSmartwatch
  };
}
