import 'package:flutter/foundation.dart';
import '../models/medication.dart';
import '../data/mock_data.dart';

class MedicationProvider extends ChangeNotifier {
  final List<Medication> _medications = List.from(defaultMockMedications);

  List<Medication> get medications => _medications;

  int get takenCount => _medications.where((m) => m.taken).length;
  int get totalCount => _medications.length;
  double get adherencePercent => totalCount > 0 ? (takenCount / totalCount) : 0.0;

  void toggleTaken(String id) {
    final idx = _medications.indexWhere((m) => m.id == id);
    if (idx != -1) {
      _medications[idx].taken = !_medications[idx].taken;
      notifyListeners();
    }
  }

  void addMedication(Medication med) {
    _medications.add(med);
    notifyListeners();
  }

  void removeMedication(String id) {
    _medications.removeWhere((m) => m.id == id);
    notifyListeners();
  }
}
