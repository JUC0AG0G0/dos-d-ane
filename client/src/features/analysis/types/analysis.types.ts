export type AnalysisSessionStatus = 'setup' | 'running' | 'ended';

export interface AnalysisSessionSummary {
  id: string;
  status: AnalysisSessionStatus;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
  captureCount: number;
  deviceCount: number;
}

export interface AnalysisSessionDevice {
  id: string;
  name: string;
  type: string;
  joinedAt: string;
  leftAt: string | null;
}

export interface CaptureSummary {
  id: string;
  deviceId: string;
  capturedAt: string;
  keypointCount: number;
}

export interface AnalysisSessionDetail extends AnalysisSessionSummary {
  devices: AnalysisSessionDevice[];
  captures: CaptureSummary[];
}
