import { MicroIntervention } from '../types';

export const DEFAULT_INTERVENTIONS: MicroIntervention[] = [
  {
    id: 'int_1',
    title: 'Box Breathing Cycle',
    category: 'breathing',
    durationMinutes: 3,
    description: 'Inhale for 4s, hold 4s, exhale 4s, hold 4s. Resets vagal tone.',
    iconName: 'Wind',
    recommendedFor: ['Elevated', 'High'],
    timestamp: '2 mins ago',
    completed: false
  },
  {
    id: 'int_2',
    title: 'Hydration & Electrolyte Intake',
    category: 'hydration',
    durationMinutes: 2,
    description: 'Drink 250ml cool water with electrolytes to balance heart rate response.',
    iconName: 'Droplets',
    recommendedFor: ['Optimal', 'Elevated', 'High'],
    timestamp: '15 mins ago',
    completed: true
  },
  {
    id: 'int_3',
    title: 'Natural Sunlight & Gaze Shift',
    category: 'environment',
    durationMinutes: 5,
    description: 'Look into far distance outside window to relax ciliary eye muscles.',
    iconName: 'Sun',
    recommendedFor: ['Optimal', 'Elevated'],
    timestamp: '30 mins ago',
    completed: false
  },
  {
    id: 'int_4',
    title: 'Caffeine Cut-Off Lockout',
    category: 'recovery',
    durationMinutes: 1,
    description: 'Refrain from caffeinated beverages within 6 hours of shift completion.',
    iconName: 'Coffee',
    recommendedFor: ['Elevated', 'High'],
    timestamp: '1 hour ago',
    completed: false
  },
  {
    id: 'int_5',
    title: 'Trapezius & Posture Reset',
    category: 'movement',
    durationMinutes: 2,
    description: 'Roll shoulders back 5x, tuck chin, release clamped jaw muscles.',
    iconName: 'Activity',
    recommendedFor: ['Optimal', 'Elevated', 'High'],
    timestamp: '1.5 hours ago',
    completed: true
  }
];
