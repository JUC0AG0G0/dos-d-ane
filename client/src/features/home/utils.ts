import type { AnalysisSessionSummary } from '@/features/analysis';

const DAY = 24 * 60 * 60 * 1000;
const number = new Intl.NumberFormat('fr-FR');
const mediumDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' });
const time = new Intl.DateTimeFormat('fr-FR', { timeStyle: 'short' });

/** « 3 218 » */
export const formatCount = (value: number) => number.format(value);

/** « 09:02 » */
export const formatTime = (value: string) => time.format(new Date(value));

/** « Session du 15 oct. 2026 » */
export const sessionTitle = (session: AnalysisSessionSummary) =>
  `Session du ${mediumDate.format(new Date(session.startedAt ?? session.createdAt))}`;

/** « 45 min », « 2 h 56 min » ; hours=true pour les totaux : « 9 h 40 ». */
export function formatHours(seconds: number, total = false) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!m) return `${h} h`;
  return total ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h ${m} min`;
}

/** « il y a 4 s », « il y a 3 min », « il y a 2 h » */
export function formatAgo(value: string, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - Date.parse(value)) / 1000));
  if (seconds < 60) return `il y a ${seconds} s`;
  if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
  return `il y a ${Math.floor(seconds / 3600)} h`;
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** « aujourd’hui à 11:58 », « hier à 16:36 », « le 13 oct. 2026 à 12:10 » */
export function formatDay(value: string, now = new Date()) {
  const days = Math.round(
    (startOfDay(now) - startOfDay(new Date(value))) / DAY,
  );
  const day =
    days === 0
      ? 'aujourd’hui'
      : days === 1
        ? 'hier'
        : `le ${mediumDate.format(new Date(value))}`;
  return `${day} à ${formatTime(value)}`;
}

/** Lundi 00:00 de la semaine en cours, en heure locale. */
export function startOfWeek(now = new Date()) {
  const monday = (now.getDay() + 6) % 7;
  return startOfDay(now) - monday * DAY;
}

/** Index stable pour la journée : change chaque jour, pas à chaque rendu. */
export function dayIndex(length: number, now = new Date()) {
  return Math.floor(startOfDay(now) / DAY) % length;
}

/** « 2 de plus que la semaine dernière » */
export function compareWeeks(current: number, previous: number) {
  const diff = current - previous;
  if (diff === 0) return 'autant que la semaine dernière';
  return `${Math.abs(diff)} de ${diff > 0 ? 'plus' : 'moins'} que la semaine dernière`;
}
