import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'services/bluetooth_service.dart';
import 'services/api_service.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => SmartwatchBluetoothService(),
      child: const NeuroRestMobileApp(),
    ),
  );
}

class NeuroRestMobileApp extends StatelessWidget {
  const NeuroRestMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NeuroRest Smartwatch Shield',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF10B981),
          brightness: Brightness.light,
        ),
        textTheme: GoogleFonts.interTextTheme(),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _serverController =
      TextEditingController(text: 'http://192.168.1.100:5000');
  late ApiService _apiService;
  bool _autoSync = true;
  String _syncStatus = 'Ready to pair';

  @override
  void initState() {
    super.initState();
    _apiService = ApiService(serverUrl: _serverController.text);
  }

  void _onHeartRateUpdate(int hr, String deviceName) async {
    if (_autoSync && hr > 0) {
      bool success = await _apiService.sendBiometricReading(
        deviceId: deviceName,
        heartRate: hr,
      );
      setState(() {
        _syncStatus = success
            ? 'Forwarded $hr bpm to dashboard at ${DateTime.now().hour}:${DateTime.now().minute}:${DateTime.now().second}'
            : 'Failed to reach server';
      });
    }
  }

  @override
  Widget build(BuildContext voidContext) {
    final bleService = Provider.of<SmartwatchBluetoothService>(context);

    // Trigger auto-sync when heart rate changes
    if (bleService.currentHeartRate != null && bleService.isConnected) {
      _onHeartRateUpdate(
        bleService.currentHeartRate!,
        bleService.connectedDeviceName ?? 'DIZO Smartwatch',
      );
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Row(
          children: [
            Icon(Icons.shield_outlined, color: Color(0xFF10B981)),
            SizedBox(width: 8),
            Text(
              'NeuroRest Mobile',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Server URL Config Card
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.slate.shade200),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Dashboard Server URL',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.slate.shade700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _serverController,
                      style: const TextStyle(fontSize: 13, fontFamily: 'monospace'),
                      decoration: InputDecoration(
                        isDense: true,
                        hintText: 'http://<YOUR-LAPTOP-IP>:5000',
                        prefixIcon: const Icon(Icons.link, size: 18),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      onChanged: (val) {
                        _apiService.serverUrl = val;
                      },
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Connected Device Banner
            Card(
              elevation: 0,
              color: bleService.isConnected
                  ? const Color(0xFFECFDF5)
                  : const Color(0xFFF1F5F9),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: bleService.isConnected
                      ? const Color(0xFFA7F3D0)
                      : Colors.slate.shade300,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: bleService.isConnected
                            ? const Color(0xFF10B981)
                            : Colors.slate.shade400,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.watch_rounded,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            bleService.isConnected
                                ? bleService.connectedDeviceName ?? 'Smartwatch'
                                : 'No Watch Paired',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: bleService.isConnected
                                  ? const Color(0xFF065F46)
                                  : Colors.slate.shade800,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            bleService.isConnected
                                ? 'Live Heart Rate Streaming Active'
                                : 'Tap scan below to pair DIZO Watch 2 Sport or BLE sensor',
                            style: TextStyle(
                              fontSize: 12,
                              color: bleService.isConnected
                                  ? const Color(0xFF047857)
                                  : Colors.slate.shade500,
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

            // Live Heart Rate Display Card
            if (bleService.isConnected)
              Card(
                elevation: 0,
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: Colors.slate.shade200),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Center(
                    child: Column(
                      children: [
                        const Icon(
                          Icons.favorite_rounded,
                          color: Colors.roseAccent,
                          size: 48,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '${bleService.currentHeartRate ?? '--'}',
                          style: TextStyle(
                            fontSize: 54,
                            fontWeight: FontWeight.extrabold,
                            color: bleService.currentHeartRate != null &&
                                    bleService.currentHeartRate! > 105
                                ? Colors.red
                                : const Color(0xFF0F172A),
                          ),
                        ),
                        const Text(
                          'BEATS PER MINUTE (BPM)',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.slate,
                            letterSpacing: 1.2,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          _syncStatus,
                          style: TextStyle(
                            fontSize: 11,
                            color: Colors.emerald.shade700,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            const SizedBox(height: 20),

            // Scan Action & BLE Device List
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Nearby Bluetooth Watches',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Colors.slate.shade800,
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: bleService.isScanning
                      ? () => bleService.stopScan()
                      : () => bleService.startScan(),
                  icon: bleService.isScanning
                      ? const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.bluetooth_searching, size: 16),
                  label: Text(bleService.isScanning ? 'Scanning...' : 'Scan Bluetooth'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // List of scanned devices
            if (bleService.scanResults.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.slate.shade200),
                ),
                child: Column(
                  children: [
                    Icon(Icons.bluetooth, size: 36, color: Colors.slate.shade300),
                    const SizedBox(height: 8),
                    Text(
                      'No Bluetooth watches scanned yet.',
                      style: TextStyle(fontSize: 12, color: Colors.slate.shade500),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Press "Scan Bluetooth" while your watch is nearby.',
                      style: TextStyle(fontSize: 11, color: Colors.slate),
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
                      : 'Unknown BLE Device (${result.device.remoteId})';

                  return Card(
                    elevation: 0,
                    margin: const EdgeInsets.only(bottom: 8),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(color: Colors.slate.shade200),
                    ),
                    child: ListTile(
                      leading: const Icon(Icons.watch, color: Color(0xFF10B981)),
                      title: Text(
                        name,
                        style: const TextStyle(
                            fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(
                        'RSSI: ${result.rssi} dBm',
                        style: const TextStyle(fontSize: 11),
                      ),
                      trailing: ElevatedButton(
                        onPressed: () => bleService.connectToDevice(result.device),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0284C7),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
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
