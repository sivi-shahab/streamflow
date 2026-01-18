import React, { useState } from 'react';
import { Activity, Layers, Zap, Info, ArrowRight } from 'lucide-react';
import ArchitectureMap from './components/ArchitectureMap';
import Simulation from './components/Simulation';
import Pillars from './components/Pillars';
import ChatBot from './components/ChatBot';
import { ArchitectureNode } from './types';

function App() {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      {/* Header */}
      <nav className="sticky top-0 z-40 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Activity size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">StreamFlow<span className="text-indigo-400">.io</span></span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-400">
              <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
              <a href="#simulation" className="hover:text-white transition-colors">Live Simulation</a>
              <a href="#pillars" className="hover:text-white transition-colors">Technical Pillars</a>
            </div>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs font-medium transition-colors">
              v2.5.0-stable
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-full z-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
            <Zap size={14} /> Real-Time Analytics Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Process high-volume event streams <br className="hidden md:block"/>
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">low latency</span> & scale.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-10">
            A comprehensive reference architecture for building modern streaming data platforms using Kafka, Spark/Flink, and Delta Lake.
          </p>
          <div className="flex justify-center gap-4">
             <a href="#simulation" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-900/20">
               Start Simulation <ArrowRight size={18} />
             </a>
             <a href="#pillars" className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg font-medium transition-all">
               Learn Concepts
             </a>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Layers className="text-indigo-500" /> Reference Architecture
            </h2>
            <div className="text-sm text-slate-400 hidden md:block">Interactive Map</div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* The SVG Map */}
            <div className="lg:col-span-2">
              <ArchitectureMap onNodeSelect={setSelectedNode} />
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-1">
              <div className="h-full bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
                {selectedNode ? (
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        {/* Dynamic Icon rendering could go here, simplistic for now */}
                        <Info className="text-indigo-400" size={24} />
                      </div>
                      <div>
                        <div className="text-xs uppercase font-bold text-indigo-400 mb-1">{selectedNode.category} Layer</div>
                        <h3 className="text-xl font-bold text-white">{selectedNode.label}</h3>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      {selectedNode.description}
                    </p>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-white">Key Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNode.id === 'kafka' && ['Apache Kafka', 'Google Pub/Sub', 'Pulsar'].map(t => <span key={t} className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300 border border-slate-700">{t}</span>)}
                        {selectedNode.id === 'flink' && ['Apache Flink', 'Spark Structured Streaming', 'Kinesis Analytics'].map(t => <span key={t} className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300 border border-slate-700">{t}</span>)}
                        {selectedNode.id === 'delta' && ['Delta Lake', 'Apache Iceberg', 'Hudi'].map(t => <span key={t} className="px-2 py-1 bg-slate-800 text-xs rounded text-slate-300 border border-slate-700">{t}</span>)}
                        {!['kafka', 'flink', 'delta'].includes(selectedNode.id) && <span className="text-xs text-slate-500 italic">Select a core infrastructure node for tech stack options.</span>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                    <Layers size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">Select a component</p>
                    <p className="text-sm">Click on any node in the diagram to view technical details.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulation Section */}
      <section id="simulation" className="py-16 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Live Pipeline Simulation</h2>
            <p className="text-slate-400">Visualize how data flows through ingestion, processing, and windowing stages.</p>
          </div>
          <Simulation />
        </div>
      </section>

      {/* Pillars Section */}
      <section id="pillars" className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Core Technical Pillars</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A production-grade streaming platform requires robust engineering principles to ensure correctness and reliability.
            </p>
          </div>
          <Pillars />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="text-indigo-500" size={24} />
            <span className="font-bold text-xl text-white">StreamFlow</span>
          </div>
          <p className="text-slate-500 text-sm">
            Interactive Reference Architecture Demo.
          </p>
          <div className="mt-8 text-xs text-slate-600">
            Powered by React, Tailwind, and Gemini API
          </div>
        </div>
      </footer>

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
}

export default App;