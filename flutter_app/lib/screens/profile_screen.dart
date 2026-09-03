import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthProvider>(context).user;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Shift Professional Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0.5,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            Card(
              elevation: 0,
              color: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
                side: BorderSide(color: Colors.grey.shade200),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 40,
                      backgroundImage: NetworkImage(user?.avatarUrl ?? ''),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      user?.name ?? 'Dr. Alex Vance',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                    Text(
                      user?.role ?? 'ICU Shift Specialist',
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                    ),
                    Text(
                      user?.email ?? 'alex.vance@neurorest.health',
                      style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                    ),
                    const SizedBox(height: 24),

                    const Divider(),
                    const SizedBox(height: 12),

                    const ListTile(
                      leading: Icon(Icons.work_outline, color: Color(0xFF10B981)),
                      title: Text('Duty Shift Length', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      subtitle: Text('12 Hours Continuous Duty Cycle', style: TextStyle(fontSize: 11)),
                    ),
                    const ListTile(
                      leading: Icon(Icons.favorite_outline, color: Color(0xFF0284C7)),
                      title: Text('Resting Heart Rate Baseline', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      subtitle: Text('64 bpm (Normal Autonomic Tone)', style: TextStyle(fontSize: 11)),
                    ),
                    const ListTile(
                      leading: Icon(Icons.shield_outlined, color: Color(0xFFD97706)),
                      title: Text('Data Isolation & Security', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
                      subtitle: Text('HIPAA Compliant Private Telemetry Engine', style: TextStyle(fontSize: 11)),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
