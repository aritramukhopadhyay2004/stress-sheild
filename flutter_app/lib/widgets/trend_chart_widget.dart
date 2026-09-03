import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/biometric_reading.dart';

class TrendChartWidget extends StatelessWidget {
  final List<BiometricReading> history;

  const TrendChartWidget({super.key, required this.history});

  @override
  Widget build(BuildContext context) {
    if (history.isEmpty) {
      return const SizedBox(height: 200, child: Center(child: Text('Awaiting readings...')));
    }

    List<FlSpot> stressSpots = [];
    List<FlSpot> hrSpots = [];

    for (int i = 0; i < history.length; i++) {
      stressSpots.add(FlSpot(i.toDouble(), history[i].stressScore.toDouble()));
      hrSpots.add(FlSpot(i.toDouble(), history[i].heartRate.toDouble()));
    }

    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Biometric Strain & Autonomic Trend',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Live Heart Rate (bpm) vs Stress Score (0-100)',
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: const FlGridData(show: true, drawVerticalLine: false),
                  titlesData: const FlTitlesData(
                    rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  ),
                  borderData: FlBorderData(show: false),
                  minY: 20,
                  maxY: 140,
                  lineBarsData: [
                    // Stress Score curve (Emerald)
                    LineChartBarData(
                      spots: stressSpots,
                      isCurved: true,
                      color: const Color(0xFF10B981),
                      barWidth: 3,
                      isStrokeCapRound: true,
                      dotData: const FlDotData(show: false),
                      belowBarData: BarAreaData(
                        show: true,
                        color: const Color(0xFF10B981).withOpacity(0.15),
                      ),
                    ),
                    // Heart Rate curve (Sky Blue)
                    LineChartBarData(
                      spots: hrSpots,
                      isCurved: true,
                      color: const Color(0xFF0284C7),
                      barWidth: 2.5,
                      isStrokeCapRound: true,
                      dotData: const FlDotData(show: false),
                      belowBarData: BarAreaData(
                        show: true,
                        color: const Color(0xFF0284C7).withOpacity(0.1),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.circle, color: Color(0xFF10B981), size: 10),
                SizedBox(width: 4),
                Text('Stress Score (0-100)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                SizedBox(width: 16),
                Icon(Icons.circle, color: Color(0xFF0284C7), size: 10),
                SizedBox(width: 4),
                Text('Heart Rate (bpm)', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
