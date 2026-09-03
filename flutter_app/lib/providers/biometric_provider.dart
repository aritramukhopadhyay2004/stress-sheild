import 'dart:async';
import 'dart:math';
import 'package:flutter/foundation.dart';
import '../models/biometric_reading.dart';
import '../models/intervention.dart';
import '../data/mock_data.dart';
import '../services/api_service.dart';

class BiometricProvider extends ChangeNotifier {
  late BiometricReading currentReading;
  List<BiometricReading> history = [];
  List<MicroIntervention> interventions = List.from(defaultMockInterventions);
  Timer? _timer;
  bool isBluetoothConnected = false;
  int elevatedDurationMinutes = 0;

  BiometricProvider() {
    currentReading = BiometricReading(
      timestamp: _nowStr(),
      heartRate: 76,
      stressScore: 44,
      dutyCycleActiveMinutes: 340,
      dutyCycleRestMinutes: 80,
      stressBand: StressBand.elevated,
    );
    _generateInitialHistory();
    _startSimulationTimer();
  }

  void _generateInitialHistory() {
    final now = DateTime.now();
    int prevHR = 74;
    int prevStress = 40;

    for (int i = 14; i >= 0; i--) {
      final t = now.subtract(Duration(minutes: i));
      final tStr = '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';
      prevHR = (prevHR + (Random().nextInt(7) - 3)).clamp(56, 135);
      prevStress = (prevStress + (Random().nextInt(9) - 4)).clamp(15, 95);

      history.add(BiometricReading(
        timestamp: tStr,
        heartRate: prevHR,
        stressScore: prevStress,
        dutyCycleActiveMinutes: 340 - i * 4,
        dutyCycleRestMinutes: 80,
        stressBand: BiometricReading.getBand(prevStress),
      ));
    }
  }

  void updateFromBluetooth(int realBpm) {
    isBluetoothConnected = true;
    int calculatedStress = (20 + (realBpm - 60) * 1.1).round().clamp(10, 99);
    final band = BiometricReading.getBand(calculatedStress);

    currentReading = BiometricReading(
      timestamp: _nowStr(),
      heartRate: realBpm,
      stressScore: calculatedStress,
      dutyCycleActiveMinutes: currentReading.dutyCycleActiveMinutes,
      dutyCycleRestMinutes: currentReading.dutyCycleRestMinutes,
      stressBand: band,
    );

    _appendHistory(currentReading);
    notifyListeners();
  }

  void triggerSimulatedSpike() {
    final spike = BiometricReading(
      timestamp: _nowStr(),
      heartRate: 122,
      stressScore: 86,
      dutyCycleActiveMinutes: currentReading.dutyCycleActiveMinutes + 1,
      dutyCycleRestMinutes: currentReading.dutyCycleRestMinutes,
      stressBand: StressBand.high,
    );
    currentReading = spike;
    _appendHistory(spike);
    notifyListeners();
  }

  void toggleIntervention(String id) {
    final idx = interventions.indexWhere((i) => i.id == id);
    if (idx != -1) {
      interventions[idx].completed = !interventions[idx].completed;
      notifyListeners();
    }
  }

  void _startSimulationTimer() {
    _timer = Timer.periodic(const Duration(seconds: 3), (_) {
      if (isBluetoothConnected) return;

      int deltaHR = Random().nextInt(7) - 3;
      int deltaStress = Random().nextInt(9) - 4;

      int newHR = (currentReading.heartRate + deltaHR).clamp(56, 138);
      int newStress = (currentReading.stressScore + deltaStress).clamp(15, 98);
      final band = BiometricReading.getBand(newStress);

      currentReading = BiometricReading(
        timestamp: _nowStr(),
        heartRate: newHR,
        stressScore: newStress,
        dutyCycleActiveMinutes: currentReading.dutyCycleActiveMinutes + (Random().nextDouble() > 0.8 ? 1 : 0),
        dutyCycleRestMinutes: currentReading.dutyCycleRestMinutes,
        stressBand: band,
      );

      _appendHistory(currentReading);
      notifyListeners();
    });
  }

  void _appendHistory(BiometricReading r) {
    history.add(r);
    if (history.length > 30) {
      history.removeAt(0);
    }
    // Asynchronous background sync to backend
    ApiService.syncBiometricReading(
      token: 'demo-token',
      reading: r,
      deviceName: isBluetoothConnected ? 'Smartwatch (BLE)' : 'Wear OS / Simulator',
    );
  }

  String _nowStr() {
    final now = DateTime.now();
    return '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}';
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
