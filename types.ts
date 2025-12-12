
export enum ModelId {
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
  GEMINI_3_PRO_PREVIEW = 'gemini-3-pro-preview',
  GPT_4O = 'gpt-4o',
  GPT_5 = 'gpt-5',
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet',
  DEEPSEEK_V3 = 'deepseek-v3',
  QWEN_2_5 = 'qwen-2.5',
  QWEN_3 = 'qwen-3',
  QWEN_3_VL = 'qwen-3-vl',
  LLAMA_3_1 = 'llama-3.1'
}

export interface ModelInfo {
  id: ModelId;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Anthropic' | 'DeepSeek' | 'Alibaba' | 'Meta';
  contextWindow: number;
  description: string;
  isEst?: boolean; // If true, the token count is an estimation
}

export interface TokenStats {
  charCount: number;
  tokenCount: number | null; // Null if loading or not calculated yet
  isLoading: boolean;
  error?: string;
}

export interface ComparisonData {
  modelName: string;
  tokens: number;
  fillPercentage: number;
  color: string;
}
