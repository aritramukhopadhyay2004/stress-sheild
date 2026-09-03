import { TriageResponse, Medication, BiometricReading } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const SYSTEM_PROMPT_TRIAGE = `You are a health triage assistant embedded in a stress-monitoring app called NeuroRest.
You are NOT a doctor and must never diagnose or prescribe medication.

You will receive: current stress score (0-100), heart rate (bpm), duration of elevated
readings, and the user's self-declared medication list (if any).

Respond ONLY in this JSON structure:
{
  "severity": "moderate" | "urgent" | "emergency",
  "plain_language_summary": "1-2 sentences explaining what the readings suggest, in calm, non-alarming language.",
  "recommended_care_type": "self-care sufficient" | "consult GP" | "consult cardiologist" | "consult mental health professional" | "seek emergency care immediately",
  "general_next_steps": ["2-4 bullet points of general, non-prescriptive first-response actions — never name specific prescription drugs or dosages"],
  "medication_reminder": "if the user has declared medications, note if any align with this moment (informational only, not a recommendation to take/skip anything), else null",
  "disclaimer": "This is not a medical diagnosis. If you feel this is an emergency, contact local emergency services or a licensed healthcare provider immediately."
}

If severity is "emergency", plain_language_summary must clearly and immediately recommend
contacting emergency services, with no ambiguity.`;

export async function requestGroqTriage(
  currentBiometrics: BiometricReading,
  elevatedDurationMinutes: number,
  medications: Medication[]
): Promise<TriageResponse> {
  const medListString = medications.length > 0
    ? medications.map(m => `- ${m.name} (${m.dosage}, ${m.frequency})`).join('\n')
    : 'No declared medications.';

  const userMessage = `Current Biometric Snapshot:
- Stress Score: ${currentBiometrics.stressScore} / 100 (Band: ${currentBiometrics.stressBand})
- Heart Rate: ${currentBiometrics.heartRate} bpm
- Duration of Elevated/High Stress: ${elevatedDurationMinutes} minutes
- User Declared Medication List:
${medListString}`;

  // If no API key provided, return intelligent offline mock fallback
  if (!GROQ_API_KEY) {
    console.warn('[Groq Client] No VITE_GROQ_API_KEY configured. Returning fallback structured triage analysis.');
    return generateFallbackTriage(currentBiometrics, medications, elevatedDurationMinutes);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT_TRIAGE },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from Groq API');
    }

    const parsed: TriageResponse = JSON.parse(content);
    return {
      ...parsed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (error) {
    console.error('[Groq Client Error]', error);
    return generateFallbackTriage(currentBiometrics, medications, elevatedDurationMinutes);
  }
}

function generateFallbackTriage(
  biometrics: BiometricReading,
  medications: Medication[],
  duration: number
): TriageResponse {
  const isEmergency = biometrics.stressScore >= 88 || biometrics.heartRate >= 130;
  const isUrgent = biometrics.stressScore >= 70 || biometrics.heartRate >= 105;

  let severity: TriageResponse['severity'] = 'moderate';
  let careType: TriageResponse['recommended_care_type'] = 'self-care sufficient';
  let summary = 'Your stress level and heart rate show temporary elevation above baseline during this active shift segment.';
  let nextSteps = [
    'Pause active task if possible and step away to a calm workspace',
    'Practice 4-7-8 rhythmic diaphragmatic breathing for 3 consecutive minutes',
    'Hydrate with 250ml of cool water or electrolyte blend',
    'Evaluate immediate ergonomics and unclamp physical jaw/shoulder tension'
  ];

  if (isEmergency) {
    severity = 'emergency';
    careType = 'seek emergency care immediately';
    summary = 'URGENT: Your physiological markers (Stress Score & Heart Rate) indicate acute cardiovascular over-exertion or extreme physical distress.';
    nextSteps = [
      'Discontinue all occupational duty cycles immediately',
      'Notify shift supervisor or onboard safety officer',
      'Contact emergency medical services (911 / Local Emergency Line)',
      'Sit comfortably in an upright position with loose clothing'
    ];
  } else if (isUrgent) {
    severity = 'urgent';
    careType = biometrics.heartRate > 115 ? 'consult cardiologist' : 'consult GP';
    summary = `Your stress readings have remained in the High band (${biometrics.stressScore}/100) with heart rate of ${biometrics.heartRate} bpm over the last ${duration} minutes.`;
    nextSteps = [
      'Initiate mandatory 15-minute physiological recovery period',
      'Refrain from further caffeine or stimulant intake',
      'Perform paced breathing exercises in a dim, low-noise area',
      'Consult your physician or occupational health practitioner if symptoms persist'
    ];
  }

  const medMatch = medications.length > 0
    ? `You have declared ${medications.length} active medication(s) (${medications.map(m => m.name).join(', ')}). Ensure daily schedules are maintained.`
    : null;

  return {
    severity,
    plain_language_summary: summary,
    recommended_care_type: careType,
    general_next_steps: nextSteps,
    medication_reminder: medMatch,
    disclaimer: 'This is not a medical diagnosis. If you feel this is an emergency, contact local emergency services or a licensed healthcare provider immediately.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
