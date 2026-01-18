import React, { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, Pause, AlertTriangle, FastForward, RotateCcw } from 'lucide-react';
import { DataPacket, SimulationState, ChartDataPoint } from '../types';

const PACKET_SPEED_MS = 2000;
const CHART_WINDOW_SIZE = 20;

const Simulation: React.FC = () => {
  const [status, setStatus] = useState<SimulationState>(SimulationState.IDLE);
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [isChaotic, setIsChaotic] = useState(false);
  
  // Refs for intervals to avoid stale closures
  const intervalRef = useRef<number | null>(null);
  const packetIdCounter = useRef(0);

  // Initialize chart data
  useEffect(() => {
    const initialData = Array.from({ length: CHART_WINDOW_SIZE }, (_, i) => ({
      time: i.toString(),
      value: 0,
      movingAverage: 0
    }));
    setChartData(initialData);
  }, []);

  const spawnPacket = () => {
    const id = `pkt-${packetIdCounter.current++}`;
    const value = Math.floor(Math.random() * 100) + (isChaotic ? Math.random() * 200 : 0);
    const isLate = Math.random() > 0.8 && isChaotic; // Simulate late data in chaos mode

    const newPacket: DataPacket = {
      id,
      value,
      timestamp: Date.now(),
      stage: 'source',
      isLate
    };

    setPackets(prev => [...prev, newPacket]);

    // Animate packet movement
    setTimeout(() => movePacket(id, 'ingestion'), 500);
    setTimeout(() => movePacket(id, 'processing'), 1500);
    setTimeout(() => movePacket(id, 'storage'), 2500);
    setTimeout(() => {
      movePacket(id, 'serving');
      finalizePacket(newPacket);
    }, 3500);
  };

  const movePacket = (id: string, stage: DataPacket['stage']) => {
    setPackets(prev => prev.map(p => p.id === id ? { ...p, stage } : p));
  };

  const finalizePacket = (packet: DataPacket) => {
    setPackets(prev => prev.filter(p => p.id !== packet.id));
    setProcessedCount(prev => prev + 1);
    
    setChartData(prev => {
      const newData = [...prev.slice(1), {
        time: new Date().toLocaleTimeString().split(' ')[0],
        value: packet.value,
        movingAverage: (prev[prev.length - 1].movingAverage * 0.9) + (packet.value * 0.1) // Exponential moving average
      }];
      return newData;
    });
  };

  useEffect(() => {
    if (status === SimulationState.RUNNING) {
      intervalRef.current = window.setInterval(spawnPacket, isChaotic ? 300 : 800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, isChaotic]);

  const toggleChaos = () => setIsChaotic(!isChaotic);
  const reset = () => {
    setStatus(SimulationState.IDLE);
    setPackets([]);
    setProcessedCount(0);
    setChartData(Array.from({ length: CHART_WINDOW_SIZE }, (_, i) => ({
      time: i.toString(),
      value: 0,
      movingAverage: 0
    })));
  };

  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col md:flex-row">
      {/* Controls & Metrics */}
      <div className="md:w-1/4 p-6 border-r border-slate-700 bg-slate-800/30 flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Live Stream Control</h3>
          <p className="text-slate-400 text-sm">Simulate high-velocity event ingestion and processing.</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
             <button 
              onClick={() => setStatus(status === SimulationState.RUNNING ? SimulationState.PAUSED : SimulationState.RUNNING)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-colors ${status === SimulationState.RUNNING ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`}
            >
              {status === SimulationState.RUNNING ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
            </button>
            <button 
              onClick={reset}
              className="flex items-center justify-center gap-2 p-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>
          
          <button 
            onClick={toggleChaos}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg font-medium border transition-all ${isChaotic ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-400'}`}
          >
            {isChaotic ? <><AlertTriangle size={18} /> Chaos Active</> : <><FastForward size={18} /> Trigger Surge</>}
          </button>
        </div>

        <div className="mt-auto">
          <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">Metrics</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-3 rounded-lg">
              <div className="text-2xl font-mono text-blue-400">{packets.length}</div>
              <div className="text-xs text-slate-400">In-Flight</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg">
              <div className="text-2xl font-mono text-emerald-400">{processedCount}</div>
              <div className="text-xs text-slate-400">Processed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizer */}
      <div className="md:w-3/4 p-6 relative bg-slate-900 flex flex-col gap-6">
        
        {/* The Pipeline Animation */}
        <div className="h-24 w-full bg-slate-800/50 rounded-lg relative overflow-hidden flex items-center justify-between px-10 border border-slate-700/50">
           {/* Static Labels */}
           <div className="z-10 text-xs font-bold text-slate-500">SOURCE</div>
           <div className="z-10 text-xs font-bold text-indigo-500">KAFKA</div>
           <div className="z-10 text-xs font-bold text-violet-500">SPARK</div>
           <div className="z-10 text-xs font-bold text-cyan-500">DELTA</div>
           <div className="z-10 text-xs font-bold text-emerald-500">BI</div>

           {/* Moving Packets */}
           {packets.map((pkt) => (
             <div
               key={pkt.id}
               className={`absolute w-3 h-3 rounded-full shadow-lg transition-all duration-[1000ms] ease-linear z-20 
                 ${pkt.isLate ? 'bg-red-500' : 'bg-blue-400'}
               `}
               style={{
                 left: pkt.stage === 'source' ? '10%' : 
                       pkt.stage === 'ingestion' ? '30%' :
                       pkt.stage === 'processing' ? '50%' :
                       pkt.stage === 'storage' ? '70%' : '90%',
                 top: '50%',
                 transform: 'translate(-50%, -50%)',
                 opacity: pkt.stage === 'serving' ? 0 : 1
               }}
             />
           ))}
        </div>

        {/* The Chart */}
        <div className="flex-1 min-h-[300px] w-full bg-slate-950/50 rounded-lg border border-slate-800 p-4">
          <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-Time Aggregation Output
          </h4>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" hide />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }} 
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fillOpacity={1} 
                fill="url(#colorVal)" 
                name="Raw Event Value"
                isAnimationActive={false}
              />
              <Area 
                type="monotone" 
                dataKey="movingAverage" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={0.3} 
                fill="url(#colorAvg)" 
                name="Windowed Avg"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Simulation;