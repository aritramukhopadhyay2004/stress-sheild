import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:health/health.dart';

class HealthConnectVitals {
  final int heartRate;
  final double? hrvSdnnMs;
  final double? bloodOxygen;
  final int stepCount;
  final double sleepHours;
  final DateTime timestamp;

  HealthConnectVitals({
    required this.heartRate,
    this.hrvSdnnMs,
    this.bloodOxygen,
    required this.stepCount,
    required this.sleepHours,
    required this.timestamp,
  });
}

class HealthConnectService extends ChangeNotifier {
  final Health _health = Health();
  bool isAuthorized = false;
  bool isLoading = false;
  String? lastError;
  HealthConnectVitals? latestVitals;

  static const List<HealthDataType> _types = [
    HealthDataType.HEART_RATE,
    HealthDataType.STEPS,
    HealthDataType.SLEEP_ASLEEP,
    HealthDataType.BLOOD_OXYGEN,
  ];

  static const List<HealthDataAccess> _permissions = [
    HealthDataAccess.READ,
    HealthDataAccess.READ,
    HealthDataAccess.READ,
    HealthDataAccess.READ,
  ];

  /// Configure Health API permissions and request authorization from Android Health Connect / iOS HealthKit
  Future<bool> requestPermissions() async {
    isLoading = true;
    lastError = null;
    notifyListeners();

    try {
      bool hasPermissions = await _health.hasPermissions(_types, permissions: _permissions) ?? false;
      if (!hasPermissions) {
        isAuthorized = await _health.requestAuthorization(_types, permissions: _permissions);
      } else {
        isAuthorized = true;
      }
    } catch (e) {
      lastError = 'Health Connect Authorization Error: $e';
      print('[HealthConnectService] $lastError');
      isAuthorized = false;
    } finally {
      isLoading = false;
      notifyListeners();
    }
    return isAuthorized;
  }

  /// Fetch recent vitals from Health Connect for the past 24 hours
  Future<HealthConnectVitals?> fetchRecentVitals() async {
    if (!isAuthorized) {
      bool ok = await requestPermissions();
      if (!ok) return null;
    }

    isLoading = true;
    notifyListeners();

    try {
      final now = DateTime.now();
      final startTime = now.subtract(const Duration(hours: 24));

      List<HealthDataPoint> healthData = await _health.getHealthDataFromTypes(
        types: _types,
        startTime: startTime,
        endTime: now,
      );

      int latestBpm = 72;
      double? latestHrv;
      double? latestSpO2;
      int totalSteps = 0;
      double totalSleepMinutes = 0;

      for (var point in healthData) {
        switch (point.type) {
          case HealthDataType.HEART_RATE:
            final val = (point.value as NumericHealthValue).numericValue.round();
            if (val > 0) latestBpm = val;
            break;
          case HealthDataType.BLOOD_OXYGEN:
            final val = (point.value as NumericHealthValue).numericValue.toDouble();
            if (val > 0) latestSpO2 = val;
            break;
          case HealthDataType.STEPS:
            totalSteps += (point.value as NumericHealthValue).numericValue.round();
            break;
          case HealthDataType.SLEEP_ASLEEP:
            final minutes = point.dateTo.difference(point.dateFrom).inMinutes;
            totalSleepMinutes += minutes;
            break;
          default:
            break;
        }
      }

      latestVitals = HealthConnectVitals(
        heartRate: latestBpm,
        hrvSdnnMs: latestHrv,
        bloodOxygen: latestSpO2 ?? 98.0,
        stepCount: totalSteps,
        sleepHours: (totalSleepMinutes / 60.0),
        timestamp: now,
      );

      return latestVitals;
    } catch (e) {
      lastError = 'Error reading Health Connect telemetry: $e';
      print('[HealthConnectService] $lastError');
      return null;
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }
}
