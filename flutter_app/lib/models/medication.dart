class Medication {
  final String id;
  final String name;
  final String dosage;
  final String frequency;
  final String scheduledTime;
  bool taken;
  final String? notes;
  final String category; // 'supplement' | 'prescription' | 'otc'

  Medication({
    required this.id,
    required this.name,
    required this.dosage,
    required this.frequency,
    required this.scheduledTime,
    this.taken = false,
    this.notes,
    required this.category,
  });
}
