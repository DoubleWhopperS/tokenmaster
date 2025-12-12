import React from 'react';
import { Dashboard } from './components/Dashboard';
import { Terminal } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center shadow-md shadow-brand-200">
               <Terminal className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">
                TokenMaster
              </h1>
              <p className="text-xs text-slate-500 font-medium">Precision LLM Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <a 
               href="https://ai.google.dev/" 
               target="_blank" 
               rel="noopener noreferrer"
               className="hidden md:block text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors"
             >
               Powered by Gemini API
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default App;