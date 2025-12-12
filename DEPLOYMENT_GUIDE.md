# TokenMaster 部署指南

## 部署概览

TokenMaster 是一个基于 React + Vite + TypeScript 构建的 LLM Token 和字符计数工具，已成功部署到互联网环境。

## 应用信息

- **应用名称**: TokenMaster - Precision LLM Analytics
- **技术栈**: React 19.2.3 + Vite 6.4.1 + TypeScript 5.8.3
- **主要依赖**:
  - `@google/genai`: Gemini API 集成
  - `recharts`: 数据可视化
  - `lucide-react`: UI 图标库

## 部署状态

✅ **已部署到公网**

### 公网访问地址
```
https://3000-i2yhg4jvmy11sos6jf4qo-5b717cc8.manusvm.computer
```

## 本地开发运行

### 前置条件
- Node.js 18+ 或 pnpm 包管理器

### 安装步骤

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **配置 API 密钥**
   
   编辑 `.env.local` 文件，将 `PLACEHOLDER_API_KEY` 替换为您的 Gemini API 密钥：
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **启动开发服务器**
   ```bash
   pnpm run dev
   ```
   
   应用将在 `http://localhost:3000` 启动

4. **构建生产版本**
   ```bash
   pnpm run build
   ```
   
   构建输出将在 `dist/` 目录中

## 项目结构

```
tokenmaster/
├── components/          # React 组件
│   ├── Dashboard.tsx   # 主仪表板组件
│   ├── StatCard.tsx    # 统计卡片组件
│   └── ComparisonChart.tsx  # 对比图表组件
├── services/           # 业务逻辑服务
│   └── geminiService.ts # Gemini API 集成
├── App.tsx            # 应用主组件
├── index.tsx          # 应用入口
├── index.html         # HTML 模板
├── vite.config.ts     # Vite 配置
├── tsconfig.json      # TypeScript 配置
├── package.json       # 依赖配置
└── .env.local         # 环境变量配置
```

## 功能特性

- 📊 **文本分析**: 统计输入文本的 Token 数量和字符数
- 📈 **数据可视化**: 使用 Recharts 展示分析结果
- 🎨 **现代 UI**: 使用 TailwindCSS 构建响应式界面
- 🚀 **快速开发**: 基于 Vite 的极速热更新

## 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `GEMINI_API_KEY` | Google Gemini API 密钥 | 是 |

## 获取 Gemini API 密钥

1. 访问 [Google AI Studio](https://ai.google.dev/)
2. 登录您的 Google 账户
3. 创建新的 API 密钥
4. 将密钥复制到 `.env.local` 文件

## 常见问题

**Q: 如何更新应用代码？**
A: 修改源代码后，开发服务器会自动热更新。对于生产环境，需要重新构建并部署。

**Q: 如何处理 API 密钥安全？**
A: 
- 不要将 `.env.local` 提交到版本控制
- 在生产环境中使用环境变量而不是硬编码
- 定期轮换 API 密钥

**Q: 应用支持哪些浏览器？**
A: 支持所有现代浏览器（Chrome、Firefox、Safari、Edge）

## 支持与反馈

如有问题或建议，请参考原始 AI Studio 应用：
https://ai.studio/apps/drive/12yN4GOJpcHtK6TjsoSbYKyKVFwUcDgoy

---

**部署时间**: 2025-12-12
**部署状态**: ✅ 生产就绪
