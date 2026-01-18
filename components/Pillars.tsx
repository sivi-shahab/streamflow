import React from 'react';
import { CheckCircle, Clock, Database, Layers, RefreshCcw, Scaling } from 'lucide-react';

const pillars = [
  {
    title: "Exactly-Once Semantics",
    icon: <CheckCircle className="text-emerald-400" size={24} />,
    description: "Guarantees that each event is processed exactly one time, even in the event of failures. Achieved using checkpointed state, idempotent writes, and transactional sinks.",
    gradient: "from-emerald-900/50 to-slate-900"
  },
  {
    title: "Event-Time Processing",
    icon: <Clock className="text-blue-400" size={24} />,
    description: "Handling data based on when the event actually occurred, not when it arrived. Uses 'Watermarking' to handle late-arriving and out-of-order data streams.",
    gradient: "from-blue-900/50 to-slate-900"
  },
  {
    title: "Stateful Processing",
    icon: <Database className="text-violet-400" size={24} />,
    description: "Maintains context across events. Essential for windowed aggregations (e.g., 'sum over last 5 mins'), stream-stream joins, and complex pattern detection.",
    gradient: "from-violet-900/50 to-slate-900"
  },
  {
    title: "Schema Evolution",
    icon: <RefreshCcw className="text-amber-400" size={24} />,
    description: "Manages changes in data structure over time with backward and forward compatibility, preventing pipeline breakage when producers update formats.",
    gradient: "from-amber-900/50 to-slate-900"
  },
  {
    title: "Fault Tolerance",
    icon: <Layers className="text-red-400" size={24} />,
    description: "System recovery through replayable logs (Kafka), distributed checkpoints (Flink/Spark), and deterministic processing to resume after crashes.",
    gradient: "from-red-900/50 to-slate-900"
  },
  {
    title: "Lakehouse Storage",
    icon: <Scaling className="text-cyan-400" size={24} />,
    description: "Unifies streaming and batch on open formats (Delta Lake, Iceberg). Enables ACID transactions, time travel, and high-performance querying on low-cost object storage.",
    gradient: "from-cyan-900/50 to-slate-900"
  }
];

const Pillars: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pillars.map((pillar, index) => (
        <div key={index} className={`p-6 rounded-xl border border-slate-700 bg-gradient-to-br ${pillar.gradient} hover:border-slate-500 transition-all duration-300 group`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-900 rounded-lg group-hover:scale-110 transition-transform">
              {pillar.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-100">{pillar.title}</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            {pillar.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Pillars;