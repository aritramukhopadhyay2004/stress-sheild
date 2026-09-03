import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/bluetooth_service.dart';
import '../services/health_connect_service.dart';
import '../providers/biometric_provider.dart';

class BluetoothScanScreen extends StatelessWidget {
  const BluetoothScanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final bleService = Provider.of<SmartwatchBluetoothService>(context);
    final healthService = Provider.of<HealthConnectService>(context);
    final bioProvider = Provider.of<BiometricProvider>(context, listen: false);

    // Sync BLE heart rate updates directly to BiometricProvider
    if (bleService.isConnected && bleService.currentHeartRate != null) {
      bioProvider.updateFromBluetooth(bleService.currentHeartRate!);
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Connect Wearables & Vitals', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Card
            Card(
              elevation: 0,
              color: bleService.isConnected ? const Color(0xFFECFDF5) : const Color(0xFFF1F5F9),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: bleService.isConnected ? const Color(0xFFA7F3D0) : Colors.grey.shade300,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: bleService.isConnected ? const Color(0xFF10B981) : Colors.grey.shade400,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.watch_rounded, color: Colors.white, size: 28),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            bleService.isConnected
                                ? bleService.connectedDeviceName ?? 'Connected Smartwatch'
                                : 'No Wearable Connected',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: bleService.isConnected ? const Color(0xFF065F46) : Colors.grey.shade800,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            bleService.isConnected
                                ? 'Live Pulse: ${bleService.currentHeartRate ?? '--'} BPM (Streaming to Dashboard)'
                                : 'Scan nearby Bluetooth watches (DIZO, Garmin, Polar, ESP32 BLE)',
                            style: TextStyle(
                              fontSize: 12,
                              color: bleService.isConnected ? const Color(0xFF047857) : Colors.grey.shade500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (bleService.isConnected)
                      IconButton(
                        icon: const Icon(Icons.power_settings_new, color: Colors.red),
                        onPressed: () => bleService.disconnect(),
                        tooltip: 'Disconnect Watch',
                      ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Health Connect / Wear OS Background Sync Card
            Card(
              elevation: 0,
              color: Colors.indigo.shade50,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.indigo.shade200),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.favorite_sharp, color: Colors.indigo, size: 24),
                        const SizedBox(width: 10),
                        const Expanded(
                          child: Text(
                            'Android Health Connect / Wear OS Sync',
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.indigo),
                          ),
                        ),
                        if (healthService.isLoading)
                          const SizedBox(
                            width: 14,
                            height: 14,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.indigo),
                          ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Sync background resting HR, HRV & SpO2 automatically from Samsung Health, Wear OS, Fitbit, or Google Fit.',
                      style: TextStyle(fontSize: 11, color: Colors.indigo),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      onPressed: healthService.isLoading
                          ? null
                          : () async {
                              final vitals = await healthService.fetchRecentVitals();
                              if (vitals != null && context.mounted) {
                                bioProvider.updateFromBluetooth(vitals.heartRate);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(
                                      'Synced Health Connect Telemetry! HR: ${vitals.heartRate} BPM, SpO2: ${vitals.bloodOxygen?.toStringAsFixed(1)}%',
                                    ),
                                    backgroundColor: Colors.indigo,
                                  ),
                                );
                              }
                            },
                      icon: const Icon(Icons.sync, size: 16),
                      label: const Text('Sync Health Connect Vitals'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.indigo,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Bluetooth Scanner Bar
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Discovered Bluetooth Devices',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
                ),
                ElevatedButton.icon(
                  onPressed: bleService.isScanning
                      ? () => bleService.stopScan()
                      : () => bleService.startScan(),
                  icon: bleService.isScanning
                      ? const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.bluetooth_searching, size: 16),
                  label: Text(bleService.isScanning ? 'Scanning...' : 'Scan Bluetooth'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            if (bleService.scanResults.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Column(
                  children: [
                    Icon(Icons.bluetooth, size: 48, color: Colors.grey.shade300),
                    const SizedBox(height: 12),
                    Text(
                      'No Bluetooth watches scanned yet.',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Tap "Scan Bluetooth" above while your smartwatch is nearby.',
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              )
            else
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: bleService.scanResults.length,
                itemBuilder: (context, index) {
                  final result = bleService.scanResults[index];
                  final name = result.device.platformName.isNotEmpty
                      ? result.device.platformName
                      : 'BLE Device (${result.device.remoteId})';

                  return Card(
                    elevation: 0,
                    margin: const EdgeInsets.only(bottom: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: Colors.grey.shade200),
                    ),
                    child: ListTile(
                      leading: const Icon(Icons.watch, color: Color(0xFF10B981)),
                      title: Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      subtitle: Text('RSSI: ${result.rssi} dBm', style: const TextStyle(fontSize: 11)),
                      trailing: ElevatedButton(
                        onPressed: () async {
                          bool connected = await bleService.connectToDevice(result.device);
                          if (connected && context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Connected to $name! Telemetry live on dashboard.')),
                            );
                            Navigator.pop(context);
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0284C7),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        child: const Text('Connect', style: TextStyle(fontSize: 12)),
                      ),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
