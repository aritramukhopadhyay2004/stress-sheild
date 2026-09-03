import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/biometric_reading.dart';

class ApiService {
  // Use 10.0.2.2 for Android Emulator, or fallback to localhost
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  /// Transmit live smartwatch biometric telemetry to FastAPI backend
  static Future<bool> syncBiometricReading({
    required String token,
    required BiometricReading reading,
    String? deviceName,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/vitals/telemetry'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'timestamp': DateTime.now().toIso8601String(),
          'heart_rate': reading.heartRate,
          'stress_score': reading.stressScore,
          'stress_band': reading.stressBand.name,
          'device_name': deviceName ?? 'Smartwatch',
          'duty_active_minutes': reading.dutyCycleActiveMinutes,
          'duty_rest_minutes': reading.dutyCycleRestMinutes,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      } else {
        print('[ApiService Sync Error] HTTP ${response.statusCode}: ${response.body}');
        return false;
      }
    } catch (e) {
      print('[ApiService Sync Exception] $e');
      return false;
    }
  }

  /// Request Groq AI Clinical Risk Assessment from FastAPI backend (if proxying)
  static Future<Map<String, dynamic>?> fetchClinicalAssessment({
    required String token,
    required List<int> recentBpmHistory,
    required int currentStressScore,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/clinical/assess'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'bpm_history': recentBpmHistory,
          'current_stress_score': currentStressScore,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      }
    } catch (e) {
      print('[ApiService Clinical Error] $e');
    }
    return null;
  }
}
