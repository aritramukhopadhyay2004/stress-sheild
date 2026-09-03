import 'biometric_reading.dart';

class MicroIntervention {
  final String id;
  final String title;
  final String category;
  final int durationMinutes;
  final String description;
  final String iconName;
  final List<StressBand> recommendedFor;
  final String timestamp;
  bool completed;

  MicroIntervention({
    required this.id,
    required this.title,
    required this.category,
    required this.durationMinutes,
    required this.description,
    required this.iconName,
    required this.recommendedFor,
    required this.timestamp,
    this.completed = false,
  });
}
