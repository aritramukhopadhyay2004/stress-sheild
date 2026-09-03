import { UserProfile, Medication } from '../types';

export const INITIAL_MOCK_USER: UserProfile = {
  id: 'user_neuro_01',
  name: 'Alex Vance, RN',
  email: 'alex.vance@neurorest.health',
  role: 'ICU Shift Specialist',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=250&auto=format&fit=crop',
  dutyShiftHours: 12,
  lastRestBreak: '45 mins ago'
};

export const INITIAL_MOCK_MEDICATIONS: Medication[] = [
  {
    id: 'med_1',
    name: 'Magnesium Glycinate',
    dosage: '200 mg',
    frequency: 'Once daily (Evening)',
    scheduledTime: '20:00',
    taken: false,
    notes: 'Supports neuromuscular relaxation and stress recovery',
    category: 'supplement'
  },
  {
    id: 'med_2',
    name: 'L-Theanine & B-Complex',
    dosage: '100 mg / 1 Cap',
    frequency: 'Twice daily during duty shift',
    scheduledTime: '10:00',
    taken: true,
    notes: 'Promotes calm cognitive alertness without sedation',
    category: 'supplement'
  },
  {
    id: 'med_3',
    name: 'Electrolyte Hydration Matrix',
    dosage: '500 ml blend',
    frequency: 'Every 4 hours during active duty',
    scheduledTime: '14:00',
    taken: false,
    notes: 'Maintains autonomic balance & fluid homeostasis',
    category: 'otc'
  }
];
