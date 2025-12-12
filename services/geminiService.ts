
import { ModelId } from '../types';

// 获取 API 配置
const getApiConfig = () => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  const apiBase = process.env.API_BASE || 'https://api.tu-zi.com';
  
  return { apiKey, apiBase };
};

/**
 * 使用第三方 API 计算 token 数量
 * 通过调用 chat completions 接口，使用 token 计数功能
 */
export const countGeminiTokens = async (model: string, text: string): Promise<number> => {
  if (!text.trim()) return 0;

  try {
    const { apiKey, apiBase } = getApiConfig();
    
    if (!apiKey) {
      console.warn('API Key not configured, falling back to estimation');
      return estimateTokens(model as ModelId, text);
    }

    // 调用第三方 API 的 token 计数功能
    // 使用一个简单的请求来获取 token 计数
    const response = await fetch(`${apiBase}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        stream: false,
        // 某些 API 支持直接返回 token 计数
        count_tokens: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error);
      // 如果 API 调用失败，回退到估算
      return estimateTokens(model as ModelId, text);
    }

    const data = await response.json();
    
    // 兔子 API 返回格式: { code: 0, data: { usage: { prompt_tokens, completion_tokens, total_tokens } } }
    if (data.code === 0 && data.data?.usage?.prompt_tokens) {
      return data.data.usage.prompt_tokens;
    }
    
    // 如果响应格式不同，回退到估算
    return estimateTokens(model as ModelId, text);
  } catch (error) {
    console.error(`Error counting tokens for ${model}:`, error);
    // 网络错误时回退到本地估算
    return estimateTokens(model as ModelId, text);
  }
};

/**
 * 为非 Gemini 模型提供"真实模拟"。
 * 使用语言感知算法（CJK vs ASCII）而不是简单的分割符。
 * 
 * 像 cl100k (OpenAI) 或 Qwen 的 tokenizer 处理中文/亚洲字符
 * 与英文的方式差异很大。这提供了更高保真度的估计。
 */
export const estimateTokens = (modelId: string | ModelId, text: string): number => {
  if (!text) return 0;
  
  // 1. 分析内容组成
  // 匹配 CJK 统一表意文字（中文、日文等）
  const cjkRegex = /[\u4e00-\u9fa5]/g; 
  const cjkMatches = text.match(cjkRegex);
  const cjkCount = cjkMatches ? cjkMatches.length : 0;
  const nonCjkCount = text.length - cjkCount;
  
  // 2. 定义 Token/字符比率（基于 tokenizer 基准的近似值）
  // 较低 = 更高效（每个字符的 token 更少）
  // 较高 = 效率较低（每个字符的 token 更多）
  
  let cjkRatio = 0.6;    // 默认：~0.6 tokens per CJK char
  let nonCjkRatio = 0.27; // 默认：~0.27 tokens per ASCII char (~3.7 chars/token)

  switch (modelId) {
    case ModelId.GPT_4O:
    case ModelId.GPT_5:
    case 'gpt-4o':
    case 'gpt-5':
      // GPT-4o: 英文效率很高，CJK 中等
      // GPT-5: 假设使用 o200k_base 或更好
      cjkRatio = 0.58; 
      nonCjkRatio = 0.26; 
      break;
      
    case ModelId.CLAUDE_3_5_SONNET:
    case 'claude-3-5-sonnet':
      // Claude: 类似 GPT-4
      cjkRatio = 0.60;
      nonCjkRatio = 0.28;
      break;

    case ModelId.DEEPSEEK_V3:
    case ModelId.QWEN_2_5:
    case ModelId.QWEN_3:
    case ModelId.QWEN_3_VL:
    case 'deepseek-v3':
    case 'qwen-2.5':
    case 'qwen-3':
      // DeepSeek & Qwen: 针对 CJK 高度优化
      // 中文通常接近 1.5-2 个字符/token，而 GPT 约为 1.5
      // Qwen 以中文 token 高效著称
      cjkRatio = 0.45; 
      nonCjkRatio = 0.26;
      break;

    case ModelId.LLAMA_3_1:
    case 'llama-3.1':
      // Llama 3: 128k vocab，但训练混合影响 CJK 效率
      // 通常对 CJK 的效率略低于 Qwen
      cjkRatio = 0.65;
      nonCjkRatio = 0.27;
      break;
      
    default:
      // 其他模型的回退
      break;
  }

  // 3. 计算加权和
  // 我们使用 ceil，因为部分 token 通常在使用上下文中向上舍入
  const estimated = Math.ceil((cjkCount * cjkRatio) + (nonCjkCount * nonCjkRatio));

  return estimated;
};
