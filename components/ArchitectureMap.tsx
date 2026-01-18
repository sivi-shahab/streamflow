import React, { useState } from 'react';
import { Database, Server, Cpu, HardDrive, LayoutDashboard, Lock, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { ArchitectureNode } from '../types';

interface Props {
  onNodeSelect: (node: ArchitectureNode) => void;
}

const nodes: ArchitectureNode[] = [
  { id: 'trans-db', label: 'Transactional DB', description: 'Primary sources of truth (Postgres, MySQL). Changes captured via CDC.', category: 'source', icon: 'Database' },
  { id: 'logs', label: 'Logs & Sensors', description: 'High-volume telemetry data from apps, IoT devices, and infrastructure.', category: 'source', icon: 'Server' },
  { id: 'kafka', label: 'Kafka / PubSub', description: 'The ingestion backbone. Decouples producers from consumers using partitioned logs.', category: 'ingestion', icon: 'Layers' },
  { id: 'flink', label: 'Spark / Flink', description: 'The processing engine. Handles windowing, joins, and state management.', category: 'processing', icon: 'Cpu' },
  { id: 'delta', label: 'Delta Lake / Iceberg', description: 'Streaming storage layer supporting ACID transactions on object storage.', category: 'storage', icon: 'HardDrive' },
  { id: 'bi', label: 'Real-Time BI', description: 'Live dashboards (Grafana, Tableau) reading from the serving layer.', category: 'serving', icon: 'LayoutDashboard' },
  { id: 'ml', label: 'ML Feature Store', description: 'Real-time features served to inference endpoints.', category: 'serving', icon: 'Cpu' },
];

const ArchitectureMap: React.FC<Props> = ({ onNodeSelect }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleClick = (node: ArchitectureNode) => {
    setActiveId(node.id);
    onNodeSelect(node);
  };

  const getNodeColor = (category: string, isActive: boolean) => {
    if (isActive) return 'fill-blue-500 stroke-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
    switch (category) {
      case 'source': return 'fill-slate-800 stroke-slate-600 hover:fill-slate-700';
      case 'ingestion': return 'fill-indigo-900 stroke-indigo-500 hover:fill-indigo-800';
      case 'processing': return 'fill-violet-900 stroke-violet-500 hover:fill-violet-800';
      case 'storage': return 'fill-cyan-900 stroke-cyan-500 hover:fill-cyan-800';
      case 'serving': return 'fill-emerald-900 stroke-emerald-500 hover:fill-emerald-800';
      default: return 'fill-slate-800 stroke-slate-600';
    }
  };

  return (
    <div className="w-full overflow-x-auto p-4 bg-slate-900/50 rounded-xl border border-slate-700 relative">
      <div className="absolute top-4 right-4 flex gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-1"><ShieldCheck size={14} /> Security Layer</div>
        <div className="flex items-center gap-1"><RefreshCw size={14} /> Schema Registry</div>
      </div>
      
      <svg viewBox="0 0 1000 500" className="w-full min-w-[800px] h-auto select-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Zones Backgrounds */}
        <rect x="20" y="40" width="150" height="420" rx="10" fill="rgba(30, 41, 59, 0.3)" />
        <text x="95" y="30" textAnchor="middle" className="fill-slate-400 text-xs font-bold tracking-wider">SOURCES</text>

        <rect x="220" y="40" width="150" height="420" rx="10" fill="rgba(49, 46, 129, 0.2)" />
        <text x="295" y="30" textAnchor="middle" className="fill-indigo-400 text-xs font-bold tracking-wider">INGESTION</text>

        <rect x="420" y="40" width="160" height="420" rx="10" fill="rgba(91, 33, 182, 0.2)" />
        <text x="500" y="30" textAnchor="middle" className="fill-violet-400 text-xs font-bold tracking-wider">PROCESSING</text>

        <rect x="630" y="40" width="150" height="420" rx="10" fill="rgba(22, 78, 99, 0.2)" />
        <text x="705" y="30" textAnchor="middle" className="fill-cyan-400 text-xs font-bold tracking-wider">STORAGE</text>

        <rect x="830" y="40" width="150" height="420" rx="10" fill="rgba(6, 78, 59, 0.2)" />
        <text x="905" y="30" textAnchor="middle" className="fill-emerald-400 text-xs font-bold tracking-wider">SERVING</text>

        {/* Connectors */}
        <path d="M 140 150 L 250 250" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" className="animate-pulse" />
        <path d="M 140 350 L 250 250" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" className="animate-pulse" />
        <path d="M 340 250 L 450 250" stroke="#475569" strokeWidth="3" markerEnd="url(#arrowhead)" className="animate-flow stroke-dashed" strokeDasharray="5,5" />
        <path d="M 550 250 L 660 250" stroke="#475569" strokeWidth="3" markerEnd="url(#arrowhead)" className="animate-flow stroke-dashed" strokeDasharray="5,5" />
        <path d="M 750 250 L 860 150" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <path d="M 750 250 L 860 350" stroke="#475569" strokeWidth="2" markerEnd="url(#arrowhead)" />
        {/* Bypass for real-time dashboards directly from stream if needed (Lambda arch) - depicted as going through storage for kappa */}
        <path d="M 500 320 L 500 400 L 850 400" stroke="#475569" strokeWidth="1" strokeDasharray="4,4" fill="none" opacity="0.5" />

        {/* Nodes */}
        {/* Source: DB */}
        <g transform="translate(50, 120)" onClick={() => handleClick(nodes[0])} className="cursor-pointer group">
          <rect width="90" height="60" rx="8" className={`transition-all duration-300 ${getNodeColor('source', activeId === 'trans-db')}`} strokeWidth="2" />
          <Database x="35" y="15" size={20} className="text-white pointer-events-none" stroke="currentColor" />
          <text x="45" y="50" textAnchor="middle" className="fill-slate-200 text-xs pointer-events-none font-medium">Trans. DB</text>
        </g>

        {/* Source: Logs */}
        <g transform="translate(50, 320)" onClick={() => handleClick(nodes[1])} className="cursor-pointer group">
          <rect width="90" height="60" rx="8" className={`transition-all duration-300 ${getNodeColor('source', activeId === 'logs')}`} strokeWidth="2" />
          <Server x="35" y="15" size={20} className="text-white pointer-events-none" stroke="currentColor" />
          <text x="45" y="50" textAnchor="middle" className="fill-slate-200 text-xs pointer-events-none font-medium">Logs</text>
        </g>

        {/* Ingestion: Kafka */}
        <g transform="translate(250, 220)" onClick={() => handleClick(nodes[2])} className="cursor-pointer group">
          <rect width="90" height="60" rx="8" className={`transition-all duration-300 ${getNodeColor('ingestion', activeId === 'kafka')}`} strokeWidth="2" />
          <Layers x="35" y="15" size={20} className="text-white pointer-events-none" stroke="currentColor" />
          <text x="45" y="50" textAnchor="middle" className="fill-indigo-100 text-xs pointer-events-none font-bold">Kafka</text>
        </g>

        {/* Processing: Spark/Flink */}
        <g transform="translate(450, 210)" onClick={() => handleClick(nodes[3])} className="cursor-pointer group">
          <rect width="100" height="80" rx="8" className={`transition-all duration-300 ${getNodeColor('processing', activeId === 'flink')}`} strokeWidth="2" />
          <Cpu x="40" y="20" size={24} className="text-white pointer-events-none" stroke="currentColor" />
          <text x="50" y="60" textAnchor="middle" className="fill-violet-100 text-xs pointer-events-none font-bold">Spark / Flink</text>
        </g>

        {/* Storage: Delta */}
        <g transform="translate(660, 210)" onClick={() => handleClick(nodes[4])} className="cursor-pointer group">
          <rect width="90" height="80" rx="8" className={`transition-all duration-300 ${getNodeColor('storage', activeId === 'delta')}`} strokeWidth="2" />
          <HardDrive x="35" y="20" size={24} className="text-white pointer-events-none" stroke="currentColor" />
          <text x="45" y="60" textAnchor="middle" className="fill-cyan-100 text-xs pointer-events-none font-bold">Lakehouse</text>
        </g>

        {/* Serving: BI */}
        <g transform="translate(860, 120)" onClick={() => handleClick(nodes[5])} className="cursor-pointer group">
          <rect width="90" height="60" rx="8" className={`transition-all duration-300 ${getNodeColor('serving', activeId === 'bi')}`} strokeWidth="2" />
          <LayoutDashboard x="35" y="15" size={20} className="text-white pointer-events-none" stroke="currentColor" />
          <text x="45" y="50" textAnchor="middle" className="fill-emerald-100 text-xs pointer-events-none font-medium">Dashboard</text>
        </g>

        {/* Serving: ML */}
        <g transform="translate(860, 320)" onClick={() => handleClick(nodes[6])} className="cursor-pointer group">
          <rect width="90" height="60" rx="8" className={`transition-all duration-300 ${getNodeColor('serving', activeId === 'ml')}`} strokeWidth="2" />
          <Cpu x="35" y="15" size={20} className="text-white pointer-events-none" stroke="currentColor" />
          <text x="45" y="50" textAnchor="middle" className="fill-emerald-100 text-xs pointer-events-none font-medium">ML Model</text>
        </g>
      </svg>
      
      <div className="absolute bottom-4 left-4 text-xs text-slate-500 italic">
        Click on a node to view details
      </div>
    </div>
  );
};

export default ArchitectureMap;