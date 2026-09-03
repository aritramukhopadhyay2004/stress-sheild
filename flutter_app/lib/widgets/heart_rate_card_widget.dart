import 'package:flutter/material.dart';

class HeartRateCardWidget extends StatelessWidget {
  final int heartRate;

  const HeartRateCardWidget({super.key, required this.heartRate});

  @override
  Widget build(BuildContext context) {
    bool isHigh = heartRate >= 105;
    Color hrColor = isHigh ? const Color(0xFFE11D48) : const Color(0xFF059669);

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
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFE4E6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.favorite, color: Color(0xFFF43F5E), size: 18),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'LIVE HEART RATE',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: isHigh ? const Color(0xFFFFF1F2) : const Color(0xFFECFDF5),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isHigh ? const Color(0xFFFECDD3) : const Color(0xFFA7F3D0),
                    ),
                  ),
                  child: Text(
                    isHigh ? 'High Effort / Strain' : 'Rhythm Normal',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: isHigh ? const Color(0xFFBE123C) : const Color(0xFF047857),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      '$heartRate',
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w800,
                        color: hrColor,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'BPM',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFF1F2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.show_chart_rounded, color: Color(0xFFF43F5E), size: 28),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
