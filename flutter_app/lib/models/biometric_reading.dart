enum StressBand { optimal, elevated, high }

class BiometricReading {
  final String timestamp;
  final int heartRate;
  final int stressScore;
  final int dutyCycleActiveMinutes;
  final int dutyCycleRestMinutes;
  final StressBand stressBand;

  BiometricReading({
    required this.timestamp,
    required this.heartRate,
    required this.stressScore,
    required this.dutyCycleActiveMinutes,
    required this.dutyCycleRestMinutes,
    required this.stressBand,
  });

  static StressBand getBand(int score) {
    if (score >= 70) return StressBand.high;
    if (score >= 40) return StressBand.elevated;
    return StressBand.optimal;
  }

  String get bandName {
    switch (stressBand) {
      case StressBand.high:
        return 'High';
      case StressBand.elevated:
        return 'Elevated';
      case StressBand.optimal:
      default:
        return 'Optimal';
    }
  }
}
