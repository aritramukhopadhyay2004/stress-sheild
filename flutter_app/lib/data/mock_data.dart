import '../models/medication.dart';
import '../models/intervention.dart';
import '../models/biometric_reading.dart';

final List<Medication> defaultMockMedications = [
  Medication(
    id: 'med_1',
    name: 'Magnesium Glycinate',
    dosage: '200 mg',
    frequency: 'Once daily (Evening)',
    scheduledTime: '20:00',
    taken: false,
    notes: 'Supports neuromuscular relaxation & autonomic stress recovery',
    category: 'supplement',
  ),
  Medication(
    id: 'med_2',
    name: 'L-Theanine & B-Complex',
    dosage: '100 mg / 1 Cap',
    frequency: 'Twice daily during duty shift',
    scheduledTime: '10:00',
    taken: true,
    notes: 'Promotes calm cognitive focus without sedation',
    category: 'supplement',
  ),
  Medication(
    id: 'med_3',
    name: 'Electrolyte Hydration Matrix',
    dosage: '500 ml blend',
    frequency: 'Every 4 hours during active shift',
    scheduledTime: '14:00',
    taken: false,
    notes: 'Maintains fluid homeostasis & autonomic tone',
    category: 'otc',
  ),
];

final List<MicroIntervention> defaultMockInterventions = [
  MicroIntervention(
    id: 'int_1',
    title: 'Box Breathing Cycle',
    category: 'breathing',
    durationMinutes: 3,
    description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s. Resets vagal tone.',
    iconName: 'wind',
    recommendedFor: [StressBand.elevated, StressBand.high],
    timestamp: '2 mins ago',
    completed: false,
  ),
  MicroIntervention(
    id: 'int_2',
    title: 'Hydration & Electrolytes',
    category: 'hydration',
    durationMinutes: 2,
    description: 'Drink 250ml cool water with electrolytes to balance heart rate response.',
    iconName: 'droplets',
    recommendedFor: [StressBand.optimal, StressBand.elevated, StressBand.high],
    timestamp: '15 mins ago',
    completed: true,
  ),
  MicroIntervention(
    id: 'int_3',
    title: 'Sunlight & Far Distance Gaze',
    category: 'environment',
    durationMinutes: 5,
    description: 'Look into distant outdoor horizon to relax optic nerve tension.',
    iconName: 'sun',
    recommendedFor: [StressBand.optimal, StressBand.elevated],
    timestamp: '30 mins ago',
    completed: false,
  ),
  MicroIntervention(
    id: 'int_4',
    title: 'Trapezius & Posture Reset',
    category: 'movement',
    durationMinutes: 2,
    description: 'Roll shoulders back 5x, tuck chin, release clamped jaw muscles.',
    iconName: 'activity',
    recommendedFor: [StressBand.optimal, StressBand.elevated, StressBand.high],
    timestamp: '1 hour ago',
    completed: true,
  ),
];
