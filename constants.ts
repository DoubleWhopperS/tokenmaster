
import { ModelId, ModelInfo } from './types';

export const SUPPORTED_MODELS: ModelInfo[] = [
  {
    id: ModelId.GEMINI_2_5_FLASH,
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    contextWindow: 1048576, // 1M
    description: 'Fast, cost-efficient, high-volume',
    isEst: false
  },
  {
    id: ModelId.GEMINI_3_PRO_PREVIEW,
    name: 'Gemini 3.0 Pro',
    provider: 'Google',
    contextWindow: 2097152, // 2M
    description: 'Best performing, complex reasoning',
    isEst: false
  },
  {
    id: ModelId.GPT_4O,
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextWindow: 128000,
    description: 'Industry standard, balanced tokenizer',
    isEst: true
  },
  {
    id: ModelId.GPT_5,
    name: 'GPT-5 (Preview)',
    provider: 'OpenAI',
    contextWindow: 128000, // Conservative estimate, likely higher
    description: 'Anticipated next-gen (uses o200k logic)',
    isEst: true
  },
  {
    id: ModelId.CLAUDE_3_5_SONNET,
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    contextWindow: 200000,
    description: 'Efficient coding & reasoning model',
    isEst: true
  },
  {
    id: ModelId.DEEPSEEK_V3,
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    contextWindow: 128000,
    description: 'Optimized for code & CJK content',
    isEst: true
  },
  {
    id: ModelId.QWEN_2_5,
    name: 'Qwen 2.5',
    provider: 'Alibaba',
    contextWindow: 128000, 
    description: 'Highly efficient CJK tokenization',
    isEst: true
  },
  {
    id: ModelId.QWEN_3,
    name: 'Qwen 3 (Preview)',
    provider: 'Alibaba',
    contextWindow: 128000,
    description: 'Next-gen CJK & reasoning optimization',
    isEst: true
  },
  {
    id: ModelId.QWEN_3_VL,
    name: 'Qwen 3 VL',
    provider: 'Alibaba',
    contextWindow: 128000,
    description: 'Vision-Language optimized tokenizer',
    isEst: true
  },
  {
    id: ModelId.LLAMA_3_1,
    name: 'Llama 3.1',
    provider: 'Meta',
    contextWindow: 128000,
    description: 'Large vocab, standard efficiency',
    isEst: true
  }
];

export const DEBOUNCE_DELAY_MS = 600;
