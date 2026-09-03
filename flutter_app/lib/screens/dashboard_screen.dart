import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/biometric_provider.dart';
import '../providers/auth_provider.dart';
import '../providers/medication_provider.dart';
import '../services/bluetooth_service.dart';
import '../services/groq_triage_service.dart';
import '../models/triage_response.dart';
import '../widgets/stress_card_widget.dart';
import '../widgets/duty_cycle_card_widget.dart';
import '../widgets/heart_rate_card_widget.dart';
import '../widgets/trend_chart_widget.dart';
import '../widgets/interventions_widget.dart';
import '../widgets/triage_card_widget.dart';
import 'bluetooth_scan_screen.dart';
import 'medication_screen.dart';
import 'profile_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  TriageResponse? _triageResponse;
  bool _isTriageLoading = false;
  final GroqTriageService _groqService = GroqTriageService();

  void _requestTriage() async {
    setState(() => _isTriageLoading = true);
    final bioProvider = Provider.of<BiometricProvider>(context, listen: false);
    final medProvider = Provider.of<MedicationProvider>(context, listen: false);

    final res = await _groqService.analyzeTriage(
      biometrics: bioProvider.currentReading,
      elevatedMinutes: bioProvider.elevatedDurationMinutes,
      medications: medProvider.medications,
    );

    setState(() {
      _triageResponse = res;
      _isTriageLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final bio = Provider.of<BiometricProvider>(context);
    final ble = Provider.of<SmartwatchBluetoothService>(context);

    // Sync BLE heart rate updates
    if (ble.isConnected && ble.currentHeartRate != null) {
      bio.updateFromBluetooth(ble.currentHeartRate!);
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Good shift, ${auth.user?.name.split(' ')[0] ?? 'Alex'} 👋',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'Continuous PPG Strain Telemetry',
              style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
            ),
          ],
        ),
        backgroundColor: Colors.white,
        elevation: 0.5,
        actions: [
          // PROMINENT CONNECT WEARABLE DEVICE BUTTON
          ElevatedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const BluetoothScanScreen()),
              );
            },
            icon: Icon(
              ble.isConnected ? Icons.watch_rounded : Icons.bluetooth,
              size: 16,
            ),
            label: Text(
              ble.isConnected
                  ? 'Watch Live (${ble.currentHeartRate ?? '--'} bpm)'
                  : 'Connect Wearable Device',
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: ble.isConnected ? const Color(0xFFECFDF5) : const Color(0xFF10B981),
              foregroundColor: ble.isConnected ? const Color(0xFF047857) : Colors.white,
              elevation: 0,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
          const SizedBox(width: 12),
        ],
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            UserAccountsDrawerHeader(
              accountName: Text(auth.user?.name ?? 'Dr. Alex Vance'),
              accountEmail: Text(auth.user?.email ?? 'alex.vance@neurorest.health'),
              currentAccountPicture: CircleAvatar(
                backgroundImage: NetworkImage(auth.user?.avatarUrl ?? ''),
              ),
              decoration: const BoxDecoration(color: Color(0xFF0F172A)),
            ),
            ListTile(
              leading: const Icon(Icons.dashboard_outlined, color: Color(0xFF10B981)),
              title: const Text('Dashboard'),
              onTap: () => Navigator.pop(context),
            ),
            ListTile(
              leading: const Icon(Icons.watch_outlined, color: Color(0xFF0284C7)),
              title: const Text('Connect Wearable Device'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const BluetoothScanScreen()),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.medication_outlined, color: Color(0xFFD97706)),
              title: const Text('Medication Schedule'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const MedicationScreen()),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.person_outline),
              title: const Text('Profile'),
              onTap: () {
                Navigator.pop(context);
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const ProfileScreen()),
                );
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.logout, color: Colors.red),
              title: const Text('Log Out'),
              onTap: () {
                auth.logout();
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Quick Demo Spike & Status Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                OutlinedButton.icon(
                  onPressed: () => bio.triggerSimulatedSpike(),
                  icon: const Icon(Icons.bolt, color: Colors.amber, size: 16),
                  label: const Text('Simulate Stress Spike', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFFDE68A)),
                    backgroundColor: const Color(0xFFFFFBEB),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFA7F3D0)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.radio_button_checked, color: Color(0xFF10B981), size: 14),
                      SizedBox(width: 6),
                      Text('System Online', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF047857))),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Top KPI Row
            StressCardWidget(reading: bio.currentReading),
            const SizedBox(height: 12),
            DutyCycleCardWidget(
              activeMinutes: bio.currentReading.dutyCycleActiveMinutes,
              restMinutes: bio.currentReading.dutyCycleRestMinutes,
            ),
            const SizedBox(height: 12),
            HeartRateCardWidget(heartRate: bio.currentReading.heartRate),
            const SizedBox(height: 16),

            // Biometric Trend Area Chart
            TrendChartWidget(history: bio.history),
            const SizedBox(height: 16),

            // Micro-Interventions Checklist
            InterventionsWidget(
              interventions: bio.interventions,
              onToggle: (id) => bio.toggleIntervention(id),
            ),
            const SizedBox(height: 16),

            // AI Triage Assistant Section
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'AI Triage Clinical Escalation',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
                ElevatedButton.icon(
                  onPressed: _isTriageLoading ? null : _requestTriage,
                  icon: _isTriageLoading
                      ? const SizedBox(width: 12, height: 12, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Icon(Icons.auto_awesome, size: 14),
                  label: const Text('Analyze Triage', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            if (_triageResponse != null)
              TriageCardWidget(triage: _triageResponse!, onRefresh: _requestTriage)
            else
              Card(
                elevation: 0,
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: BorderSide(color: Colors.grey.shade200),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Center(
                    child: Column(
                      children: [
                        const Icon(Icons.medical_services_outlined, size: 36, color: Color(0xFF10B981)),
                        const SizedBox(height: 8),
                        const Text(
                          'Groq AI Triage Standby',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tap "Analyze Triage" or pair your smartwatch to get real-time clinical guidance.',
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
