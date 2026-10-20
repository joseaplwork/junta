import { JuntaPhase, juntaPhase, utcToday } from '@junta/domain'

const LABELS: Record<JuntaPhase, string> = {
  upcoming: 'Not started',
  active: 'Active',
  finished: 'Finished',
}

/** Upcoming, active, or finished, using the same UTC date as the API. */
export function juntaStatus(startDate: string, endDate: string): JuntaPhase {
  return juntaPhase(startDate, endDate, utcToday())
}

export function juntaStatusLabel(startDate: string, endDate: string): string {
  return LABELS[juntaStatus(startDate, endDate)]
}

export function juntaPhaseLabel(phase: JuntaPhase): string {
  return LABELS[phase]
}
