import { create } from 'zustand'

export interface MetricDataPoint {
  time: string
  value: number
}

export interface MetricsState {
  clusterHealth: number
  activeNodes: number
  memoryUsageGB: number
  cpuLoadPercent: number
  cacheHitRatio: number
  activeConnections: number
  
  healthHistory: MetricDataPoint[]
  memoryHistory: MetricDataPoint[]
  cpuHistory: MetricDataPoint[]
  connectionsHistory: MetricDataPoint[]

  connectWebSocket: () => void
}

const generateMockHistory = (count: number, baseValue: number, variance: number) => {
  const data: MetricDataPoint[] = []
  let currentValue = baseValue
  for (let i = count; i >= 0; i--) {
    const time = new Date(Date.now() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    currentValue = Math.max(0, currentValue + (Math.random() * variance * 2 - variance))
    data.push({ time, value: Number(currentValue.toFixed(2)) })
  }
  return data
}

let wsInstance: WebSocket | null = null;

export const useMetricsStore = create<MetricsState>((set) => ({
  clusterHealth: 99.9,
  activeNodes: 24,
  memoryUsageGB: 64.2,
  cpuLoadPercent: 42,
  cacheHitRatio: 94.8,
  activeConnections: 12450,

  healthHistory: generateMockHistory(20, 99.9, 0.1),
  memoryHistory: generateMockHistory(20, 64.2, 1.5),
  cpuHistory: generateMockHistory(20, 42, 5),
  connectionsHistory: generateMockHistory(20, 12450, 500),

  connectWebSocket: () => {
    if (wsInstance) return;
    
    wsInstance = new WebSocket('ws://localhost:4000');
    
    wsInstance.onopen = () => {
      console.log('Connected to Valkey Admin backend via WebSocket');
    };

    wsInstance.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'initial_metrics') {
        set({ ...message.data });
      } else if (message.type === 'metrics_update') {
        const { timestamp, data } = message;
        
        set((state) => ({
          ...data,
          memoryHistory: [...state.memoryHistory.slice(1), { time: timestamp, value: data.memoryUsageGB }],
          cpuHistory: [...state.cpuHistory.slice(1), { time: timestamp, value: data.cpuLoadPercent }],
          connectionsHistory: [...state.connectionsHistory.slice(1), { time: timestamp, value: data.activeConnections }],
        }));
      }
    };

    wsInstance.onclose = () => {
      console.log('Disconnected from WebSocket backend');
      wsInstance = null;
      // Optional: implement reconnect logic
    };
  }
}))
