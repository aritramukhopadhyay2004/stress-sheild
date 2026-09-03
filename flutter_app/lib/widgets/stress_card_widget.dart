import 'package:flutter/material.dart';
import '../models/biometric_reading.dart';

class StressCardWidget extends StatelessWidget {
  final BiometricReading reading;

  const StressCardWidget({super.key, required this.reading});

  @override
  Widget build(BuildContext context) {
    Color cardColor;
    Color textColor;
    String statusText;

    switch (reading.stressBand) {
      case StressBand.high:
        cardColor = const Color(0xFFFFF1F2);
        textColor = const Color(0xFFE11D48);
        statusText = 'High Strain (Action Required)';
        break;
      case StressBand.elevated:
        cardColor = const Color(0xFFFFFBEB);
        textColor = const Color(0xFFD97706);
        statusText = 'Elevated Strain (Monitor)';
        break;
      case StressBand.optimal:
      default:
        cardColor = const Color(0xFFECFDF5);
        textColor = const Color(0xFF059669);
        statusText = 'Autonomic Balance Normal';
        break;
    }

    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.shield_outlined, color: Color(0xFF10B981), size: 18),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'STRESS INDEX',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: textColor.withOpacity(0.3)),
                  ),
                  child: Text(
                    '${reading.bandName} (${reading.stressScore}/100)',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: textColor),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          '${reading.stressScore}',
                          style: TextStyle(
                            fontSize: 36,
                            fontWeight: FontWeight.w800,
                            color: textColor,
                          ),
                        ),
                        Text(
                          ' / 100',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                    Text(
                      statusText,
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: textColor),
                    ),
                  ],
                ),
                SizedBox(
                  width: 56,
                  height: 56,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      CircularProgressIndicator(
                        value: reading.stressScore / 100,
                        strokeWidth: 6,
                        backgroundColor: Colors.grey.shade100,
                        color: textColor,
                      ),
                      Text(
                        '${reading.stressScore}%',
                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey.shade800),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
