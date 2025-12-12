
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Type, 
  Cpu, 
  Eraser, 
  Copy, 
  AlertCircle,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { ModelId, TokenStats, ComparisonData } from '../types';
import { SUPPORTED_MODELS, DEBOUNCE_DELAY_MS } from '../constants';
import { countGeminiTokens, estimateTokens } from '../services/geminiService';
import { StatCard } from './StatCard';
import { ComparisonChart } from './ComparisonChart';

export const Dashboard: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<ModelId>(ModelId.GEMINI_2_5_FLASH);
  
  // Stats State
  const [stats, setStats] = useState<TokenStats>({
    charCount: 0,
    tokenCount: 0,
    isLoading: false
  });

  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);

  // Calculate local stats (instant)
  const calculateLocalStats = useCallback((inputText: string) => {
    const chars = inputText.length;
    return { chars };
  }, []);

  // Handler for text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    const { chars } = calculateLocalStats(newText);
    
    // Immediate update for local stats
    setStats(prev => ({
      ...prev,
      charCount: chars,
      // We set loading true if text exists, waiting for debounce
      isLoading: newText.length > 0
    }));
  };

  // Perform Token Counting (Debounced)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!text) {
        setStats(prev => ({ ...prev, tokenCount: 0, isLoading: false }));
        setComparisonData([]);
        return;
      }

      setStats(prev => ({ ...prev, isLoading: true, error: undefined }));

      try {
        // 1. Get Selected Model Count
        let currentTokenCount = 0;
        const currentModel = SUPPORTED_MODELS.find(m => m.id === selectedModelId)!;

        if (currentModel.isEst) {
           currentTokenCount = estimateTokens(selectedModelId, text);
        } else {
           currentTokenCount = await countGeminiTokens(selectedModelId, text);
        }

        // 2. Build Comparison Data for Chart
        const comparisonPromises = SUPPORTED_MODELS.map(async (model) => {
          let count = 0;
          if (model.isEst) {
            count = estimateTokens(model.id, text);
          } else {
            // For Gemini models, we use the real API for maximum accuracy
            try {
              count = await countGeminiTokens(model.id, text);
            } catch (e) {
              // Fallback to estimate if API fails
              count = estimateTokens(model.id, text);
            }
          }

          let color = '#94a3b8'; // default slate
          if (model.provider === 'Google') color = '#0ea5e9'; // Blue
          else if (model.provider === 'OpenAI') color = '#10b981'; // Green
          else if (model.provider === 'Anthropic') color = '#f97316'; // Orange
          else if (model.provider === 'DeepSeek') color = '#6366f1'; // Indigo
          else if (model.provider === 'Alibaba') color = '#8b5cf6'; // Violet
          else if (model.provider === 'Meta') color = '#3b82f6'; // Blue

          return {
            modelName: model.name,
            tokens: count,
            fillPercentage: (count / model.contextWindow) * 100,
            color
          };
        });

        const comparisons = await Promise.all(comparisonPromises);
        setComparisonData(comparisons);

        setStats(prev => ({
          ...prev,
          tokenCount: currentTokenCount,
          isLoading: false
        }));

      } catch (error) {
        console.error("Token counting failed", error);
        setStats(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: "Failed to calculate tokens. Please check your network." 
        }));
      }
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [text, selectedModelId]);

  const clearText = () => {
    setText('');
    setStats({
      charCount: 0,
      tokenCount: 0,
      isLoading: false
    });
    setComparisonData([]);
  };

  const copyStats = () => {
    const statText = `
TokenMaster Analysis:
---------------------
Model: ${SUPPORTED_MODELS.find(m => m.id === selectedModelId)?.name}
Tokens: ${stats.tokenCount}
Characters: ${stats.charCount}
---------------------
    `.trim();
    navigator.clipboard.writeText(statText);
  };

  const currentModelInfo = useMemo(() => 
    SUPPORTED_MODELS.find(m => m.id === selectedModelId), 
    [selectedModelId]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-80px)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
        
        {/* Left Column: Input Area */}
        <div className="lg:col-span-7 flex flex-col min-h-[500px] lg:h-full gap-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-t-xl border-x border-t border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Type className="text-brand-600" size={20} />
              Input Text
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={clearText}
                className="text-sm flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Eraser size={16} />
                Clear
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative group flex flex-col">
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Paste your prompt, article, or code here. The app will automatically analyze tokens for multiple models..."
              className="flex-1 w-full p-6 text-slate-700 bg-white border border-slate-200 rounded-b-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none font-mono text-sm leading-relaxed shadow-sm transition-all"
              spellCheck={false}
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none bg-white/90 px-2 py-1 rounded backdrop-blur-sm border border-slate-100 shadow-sm">
              {stats.charCount.toLocaleString()} chars
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Dashboard */}
        <div className="lg:col-span-5 flex flex-col h-full gap-6">
          
          {/* Model Selector */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-medium text-slate-700 mb-2">Target Model</label>
            <div className="relative">
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value as ModelId)}
                className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:ring-2 focus:ring-brand-500 outline-none text-slate-700 font-medium cursor-pointer hover:bg-slate-100 transition-colors"
              >
                {SUPPORTED_MODELS.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <Cpu className="absolute left-3 top-3.5 text-slate-400" size={18} />
              
              <div className="mt-3 flex items-start gap-2 bg-slate-50 p-2 rounded-md border border-slate-100">
                 {currentModelInfo?.isEst ? (
                   <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                 ) : (
                   <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                 )}
                 <p className="text-xs text-slate-500 leading-snug">
                   {currentModelInfo?.isEst 
                     ? "Algorithm-based estimation. Optimized for CJK/English differences to provide high reliability without private keys." 
                     : "Verified authentic count using live Gemini API."}
                 </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
             <StatCard 
               label="Token Count" 
               value={stats.tokenCount ?? 0} 
               isLoading={stats.isLoading}
               icon={Cpu}
               subValue={currentModelInfo?.name}
               colorClass="text-brand-600 bg-brand-50"
             />
             <StatCard 
               label="Characters" 
               value={stats.charCount} 
               icon={Type}
               colorClass="text-indigo-600 bg-indigo-50"
             />
          </div>

          {/* Visualization */}
          {comparisonData.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <BarChart3 size={18} className="text-slate-400" />
                  Model Comparison
                </h3>
              </div>
              
              {/* Increased height to accommodate more models */}
              <div className="h-80 w-full"> 
                <ComparisonChart data={comparisonData} />
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-500">
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>
                   <span>Google</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                   <span>OpenAI</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>
                   <span>DeepSeek</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div>
                   <span>Qwen (Alibaba)</span>
                 </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-auto pt-2 flex justify-end">
            <button
              onClick={copyStats}
              disabled={!text}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
            >
              <Copy size={16} />
              Copy Report
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
