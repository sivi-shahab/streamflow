export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export enum SimulationState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED'
}

export interface DataPacket {
  id: string;
  value: number;
  timestamp: number;
  stage: 'source' | 'ingestion' | 'processing' | 'storage' | 'serving';
  isLate?: boolean;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  description: string;
  category: 'source' | 'ingestion' | 'processing' | 'storage' | 'serving' | 'security';
  icon?: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  movingAverage: number;
}