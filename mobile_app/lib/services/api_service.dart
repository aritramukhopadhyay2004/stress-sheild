import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  String serverUrl;

  ApiService({this.serverUrl = 'http://192.168.1.100:5000'});

  Future<bool> sendBiometricReading({
    required String deviceId,
    required int heartRate,
    double skinConductance = 3.2,
    double temperature = 36.8,
  }) async {
    try {
      final uri = Uri.parse('$serverUrl/api/health/iot-sensor-data');
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'device_id': deviceId,
          'heart_rate': heartRate,
          'skin_conductance': skinConductance,
          'temperature': temperature,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      } else {
        print('[ApiService Error] Status ${response.statusCode}: ${response.body}');
        return false;
      }
    } catch (e) {
      print('[ApiService Exception] $e');
      return false;
    }
  }
}
