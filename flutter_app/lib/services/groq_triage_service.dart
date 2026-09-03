import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/biometric_reading.dart';
import '../models/medication.dart';
import '../models/triage_response.dart';

class GroqTriageService {
  final String apiKey;
  final String model;

  GroqTriageService({
    this.apiKey = '',
    this.model = 'llama-3.3-70b-versatile',
  });

  static const String _groqUrl = 'https://api.groq.com/openai/v1/chat/completions';

  static const String _systemPrompt = '''
You are a health triage assistant embedded in a stress-monitoring app called NeuroRest.
You are NOT a doctor and must never diagnose or prescribe medication.

You will receive: current stress score (0-100), heart rate (bpm), duration of elevated
readings, and the user's self-declared medication list (if any).

Respond ONLY in this JSON structure:
{
  "severity": "moderate" | "urgent" | "emergency",
  "plain_language_summary": "1-2 sentences explaining what the readings suggest, in calm, non-alarming language.",
  "recommended_care_type": "self-care sufficient" | "consult GP" | "consult cardiologist" | "consult mental health professional" | "seek emergency care immediately",
  "general_next_steps": ["2-4 bullet points of general, non-prescriptive first-response actions — never name specific prescription drugs or dosages"],
  "medication_reminder": "if the user has declared medications, note if any align with this moment (informational only, not a recommendation to take/skip anything), else null",
  "disclaimer": "This is not a medical diagnosis. If you feel this is an emergency, contact local emergency services or a licensed healthcare provider immediately."
}

If severity is "emergency", plain_language_summary must clearly and immediately recommend
contacting emergency services, with no ambiguity.
''';

  Future<TriageResponse> analyzeTriage({
    required BiometricReading biometrics,
    required int elevatedMinutes,
    required List<Medication> medications,
  }) async {
    if (apiKey.isEmpty) {
      return _generateFallbackTriage(biometrics, medications, elevatedMinutes);
    }

    final medStr = medications.isNotEmpty
        ? medications.map((m) => '- ${m.name} (${m.dosage}, ${m.frequency})').join('\n')
        : 'No declared medications.';

    final userContent = '''Current Biometric Snapshot:
- Stress Score: ${biometrics.stressScore} / 100 (${biometrics.bandName})
- Heart Rate: ${biometrics.heartRate} bpm
- Duration of Elevated/High Stress: $elevatedMinutes minutes
- User Declared Medications:
$medStr''';

    try {
      final response = await http.post(
        Uri.parse(_groqUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $apiKey',
        },
        body: jsonEncode({
          'model': model,
          'response_format': {'type': 'json_object'},
          'messages': [
            {'role': 'system', 'content': _systemPrompt},
            {'role': 'user', 'content': userContent},
          ],
          'temperature': 0.2,
        }),
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        final content = decoded['choices']?[0]?['message']?['content'];
        if (content != null) {
          final Map<String, dynamic> jsonMap = jsonDecode(content);
          jsonMap['timestamp'] = '${DateTime.now().hour.toString().padLeft(2, '0')}:${DateTime.now().minute.toString().padLeft(2, '0')}';
          return TriageResponse.fromJson(jsonMap);
        }
      }
      return _generateFallbackTriage(biometrics, medications, elevatedMinutes);
    } catch (e) {
      print('[GroqTriageService Exception] $e');
      return _generateFallbackTriage(biometrics, medications, elevatedMinutes);
    }
  }

  TriageResponse _generateFallbackTriage(
    BiometricReading biometrics,
    List<Medication> medications,
    int duration,
  ) {
    final isEmergency = biometrics.stressScore >= 88 || biometrics.heartRate >= 130;
    final isUrgent = biometrics.stressScore >= 70 || biometrics.heartRate >= 105;

    String severity = 'moderate';
    String careType = 'self-care sufficient';
    String summary = 'Your stress level and heart rate show temporary elevation during active shift duty.';
    List<String> nextSteps = [
      'Pause active task and step away to a quiet area',
      'Practice 4-7-8 rhythmic diaphragmatic breathing for 3 minutes',
      'Hydrate with 250ml of cool water or electrolytes',
      'Unclamp jaw and release shoulder muscle tension'
    ];

    if (isEmergency) {
      severity = 'emergency';
      careType = 'seek emergency care immediately';
      summary = 'URGENT: Physiological markers indicate acute autonomic strain or physical distress.';
      nextSteps = [
        'Discontinue occupational duty cycle immediately',
        'Notify shift supervisor or onboard safety officer',
        'Contact emergency medical services (911 / Emergency Line)',
        'Sit upright comfortably in a well-ventilated space'
      ];
    } else if (isUrgent) {
      severity = 'urgent';
      careType = biometrics.heartRate > 115 ? 'consult cardiologist' : 'consult GP';
      summary = 'High stress strain (${biometrics.stressScore}/100) with heart rate of ${biometrics.heartRate} bpm over $duration mins.';
      nextSteps = [
        'Initiate mandatory 15-minute recovery break',
        'Refrain from caffeinated beverages or stimulants',
        'Perform slow-paced breathing exercises',
        'Consult physician if strain persists'
      ];
    }

    final medNotice = medications.isNotEmpty
        ? 'Active medications logged (${medications.length}). Ensure daily schedule is maintained.'
        : null;

    final nowStr = '${DateTime.now().hour.toString().padLeft(2, '0')}:${DateTime.now().minute.toString().padLeft(2, '0')}';

    return TriageResponse(
      severity: severity,
      plainLanguageSummary: summary,
      recommendedCareType: careType,
      generalNextSteps: nextSteps,
      medicationReminder: medNotice,
      disclaimer: 'This is not a medical diagnosis. If you feel this is an emergency, contact local emergency services immediately.',
      timestamp: nowStr,
    );
  }
}
