export interface SpeechAnalyticsResult {
  wordCount: number;
  wpm: number;
  wpmCategory: 'Slow' | 'Optimal' | 'Fast';
  fillerCount: number;
  fillerBreakdown: Record<string, number>;
  confidenceScore: number; // 0 to 100
  clarityGrade: 'Excellent' | 'Good' | 'Needs Improvement';
}

const COMMON_FILLER_WORDS = [
  'um',
  'uh',
  'like',
  'basically',
  'actually',
  'you know',
  'i mean',
  'sort of',
  'kind of',
  'literally',
  'right',
  'so'
];

export function countFillerWords(text: string): { total: number; breakdown: Record<string, number> } {
  if (!text || !text.trim()) {
    return { total: 0, breakdown: {} };
  }

  const lowerText = text.toLowerCase();
  const breakdown: Record<string, number> = {};
  let total = 0;

  for (const phrase of COMMON_FILLER_WORDS) {
    // Regex matching whole word/phrase
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      breakdown[phrase] = matches.length;
      total += matches.length;
    }
  }

  return { total, breakdown };
}

export function calculateWPM(wordCount: number, durationSeconds: number): number {
  if (durationSeconds <= 0 || wordCount <= 0) return 0;
  const minutes = durationSeconds / 60;
  return Math.round(wordCount / minutes);
}

export function evaluateSpeechMetrics(text: string, durationSeconds: number): SpeechAnalyticsResult {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const wpm = calculateWPM(wordCount, Math.max(durationSeconds, 2));

  let wpmCategory: 'Slow' | 'Optimal' | 'Fast' = 'Optimal';
  if (wpm < 110) wpmCategory = 'Slow';
  else if (wpm > 170) wpmCategory = 'Fast';

  const { total: fillerCount, breakdown: fillerBreakdown } = countFillerWords(text);

  // Confidence estimation algorithm
  // Starts at 90, deducts for high filler word density or extreme WPM
  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;
  let confidenceScore = 90;

  if (fillerRatio > 0.08) confidenceScore -= 20;
  else if (fillerRatio > 0.04) confidenceScore -= 10;

  if (wpmCategory === 'Slow') confidenceScore -= 10;
  if (wpmCategory === 'Fast') confidenceScore -= 5;

  confidenceScore = Math.max(35, Math.min(98, confidenceScore));

  let clarityGrade: 'Excellent' | 'Good' | 'Needs Improvement' = 'Good';
  if (confidenceScore >= 85 && fillerCount <= 2) clarityGrade = 'Excellent';
  else if (confidenceScore < 65 || fillerCount > 6) clarityGrade = 'Needs Improvement';

  return {
    wordCount,
    wpm,
    wpmCategory,
    fillerCount,
    fillerBreakdown,
    confidenceScore,
    clarityGrade
  };
}

export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel(); // Stop ongoing speech

  const cleanText = text.replace(/[*_#`]/g, ''); // strip markdown
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
