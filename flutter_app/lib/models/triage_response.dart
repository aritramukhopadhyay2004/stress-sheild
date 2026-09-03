class TriageResponse {
  final String severity; // 'moderate' | 'urgent' | 'emergency'
  final String plainLanguageSummary;
  final String recommendedCareType;
  final List<String> generalNextSteps;
  final String? medicationReminder;
  final String disclaimer;
  final String timestamp;

  TriageResponse({
    required this.severity,
    required this.plainLanguageSummary,
    required this.recommendedCareType,
    required this.generalNextSteps,
    this.medicationReminder,
    required this.disclaimer,
    required this.timestamp,
  });

  factory TriageResponse.fromJson(Map<String, dynamic> json) {
    return TriageResponse(
      severity: json['severity'] ?? 'moderate',
      plainLanguageSummary: json['plain_language_summary'] ?? 'Biometrics evaluated.',
      recommendedCareType: json['recommended_care_type'] ?? 'self-care sufficient',
      generalNextSteps: List<String>.from(json['general_next_steps'] ?? []),
      medicationReminder: json['medication_reminder'],
      disclaimer: json['disclaimer'] ?? 'Not a medical diagnosis.',
      timestamp: json['timestamp'] ?? DateTime.now().toString(),
    );
  }
}
