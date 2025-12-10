# React 解耦方案文档

## 项目重构概述

从 v1.0.19 开始，该库已完全从 React 解耦。项目现在由两部分组成：

### 1. **纯 JS 核心库** (`markdown-core`)
- **不依赖任何框架**，包括 React
- 提供原始的 Markdown 处理功能（公式转义、Mermaid 初始化、链接检测等）
- 可在任何环境中使用（Node.js、浏览器、其他框架）

### 2. **React Adapter** (`markdown` 模块)
- 建立在核心库基础之上
- 提供 React 组件（如 `ZJMarkdown`、`Mermaid`、`PreCode` 等）
- 可选使用，仅当你的项目使用 React 时才需要

---

## 使用方式

### 方式 A：完整包（包含 React）

适用于 React 项目，保留原有的 API：

```typescript
// 使用默认导出
import ZJMarkdown from '@zjlab-frontier/markdown';

// 或者显式导入
import { ZJMarkdown, Mermaid, PreCode } from '@zjlab-frontier/markdown';

export function MyComponent() {
  return (
    <ZJMarkdown 
      content="# Hello\n\nThis is **markdown**"
      fontSize={16}
    />
  );
}
```

**依赖声明：** React 作为 `peerDependencies`（可选）

---

### 方式 B：仅使用核心库（推荐用于非 React 项目）

适用于任何框架或纯 JS 环境：

```typescript
import {
  initializeMermaid,
  renderMermaid,
  escapeBrackets,
  copyToClipboard,
  detectLanguage,
  isAudioLink,
  isVideoLink,
  isInternalLink,
} from '@zjlab-frontier/markdown/core';

// 初始化 Mermaid
initializeMermaid();

// 预处理 Markdown 内容
const processed = escapeBrackets(markdownContent);

// 渲染 Mermaid 图表
renderMermaid(mermaidCode, 'chart-id').then(svg => {
  document.getElementById('container').innerHTML = svg;
});

// 复制文本到剪贴板
copyToClipboard('Some text');

// 检测链接类型
if (isAudioLink(href)) {
  // 处理音频链接
}
```

**依赖声明：** 仅需要 Mermaid、KaTeX 等必要工具，**不需要 React**

---

## 核心库 API 参考

### 初始化和渲染

#### `initializeMermaid(): void`
统一初始化 Mermaid，避免重复初始化。

#### `renderMermaid(code: string, id: string): Promise<string>`
渲染 Mermaid 代码并返回 SVG 字符串。

```typescript
const svg = await renderMermaid('graph TD; A-->B;', 'my-chart');
```

### 公式处理

#### `escapeBrackets(text: string): string`
转义文本中的 LaTeX 括号和结构。处理：
- `\[...\]` → `$$...$$`（块级公式）
- `\(...\)` → `$...$`（行内公式）
- `\boxed{...}` → `$$\boxed{...}$$`
- 嵌套的 LaTeX 结构

#### `preprocessFormulas(text: string): string`
仅预处理 LaTeX 格式（`\[` `\]` `\(` `\)`），不处理其他转义。

### 工具函数

#### `copyToClipboard(text: string): void`
复制文本到剪贴板。

#### `detectLanguage(className?: string): string`
从 `className` 检测代码块的语言。
```typescript
detectLanguage('language-python'); // 返回 'python'
```

#### `shouldWrapText(language: string): boolean`
检查是否应该启用自动换行。

#### `isAudioLink(href: string): boolean`
检查链接是否为音频文件（`.aac`, `.mp3`, `.opus`, `.wav`）。

#### `isVideoLink(href: string): boolean`
检查链接是否为视频文件（`.3gp`, `.webm`, `.mp4` 等）。

#### `isInternalLink(href: string): boolean`
检查链接是否为内部链接（以 `/#` 开头）。

#### `generateChartId(): string`
生成唯一的图表 ID。

---

## 迁移指南

### 从旧版本（< 1.0.19）迁移

#### 情况 1：你只使用 React 组件

**好消息：** 不需要任何改动！API 完全相同。

```typescript
// 仍然可以这样使用
import ZJMarkdown from '@zjlab-frontier/markdown';
```

#### 情况 2：你想移除 React 依赖

1. **卸载 React**（如果不再需要）
2. **导入核心库**：
   ```typescript
   import { escapeBrackets, renderMermaid } from '@zjlab-frontier/markdown/core';
   ```
3. **使用对应的工具函数** 替代 React 组件

#### 情况 3：你要在其他框架中使用（Vue、Svelte 等）

1. **导入核心库**：
   ```typescript
   import { initializeMermaid, renderMermaid, escapeBrackets } from '@zjlab-frontier/markdown/core';
   ```
2. **用你的框架包装** 这些函数
   ```vue
   <!-- Vue 3 示例 -->
   <template>
     <div v-html="renderedContent"></div>
   </template>
   
   <script setup>
   import { escapeBrackets } from '@zjlab-frontier/markdown/core';
   import { computed } from 'vue';
   
   const props = defineProps({ content: String });
   const renderedContent = computed(() => escapeBrackets(props.content));
   </script>
   ```

---

## 包结构

```
dist/
├── index.es.js              # 完整包（ES 模块）
├── index.umd.js             # 完整包（UMD）
├── markdown-core.d.ts       # 核心库类型声明
├── markdown.d.ts            # React Adapter 类型声明
└── ...
```

### 导入方式

```typescript
// 方式 1：完整包（包含 React）
import ZJMarkdown from '@zjlab-frontier/markdown';
import { initializeMermaid } from '@zjlab-frontier/markdown';

// 方式 2：仅核心库（推荐非 React 项目）
import { initializeMermaid } from '@zjlab-frontier/markdown/core';
```

---

## 版本说明

| 版本 | 变更 |
|------|------|
| v1.0.19+ | 完整 React 解耦，支持两种导出方式 |
| v1.0.18- | React 强耦合版本 |

---

## 常见问题

### Q: 升级到 v1.0.19 后，我的 React 代码会破裂吗？
**A:** 不会。React API 完全向后兼容。代码无需修改。

### Q: 我不使用 React，能用这个库吗？
**A:** 能！从 v1.0.19 开始，你可以仅使用核心库，完全不需要 React。

### Q: 核心库有多大？
**A:** 非常小。核心库只依赖 Mermaid 和 KaTeX，大约 X MB gzipped（不包括依赖）。

### Q: 我可以同时使用 React Adapter 和核心库吗？
**A:** 完全可以。它们是互补的。Adapter 建立在核心库的基础上。

### Q: 为什么 React 是可选的？
**A:** 这样库就可以在任何环境中使用，避免版本冲突，并让 React 项目根据需要选择最佳版本。

---

## 技术细节

### 项目结构

```
src/
├── markdown-core.ts    # 纯 JS 核心库
├── markdown.tsx        # React Adapter
└── index.ts            # 统一导出
```

### 构建输出

- **ES Module**: `dist/index.es.js` 和 `dist/markdown-core.es.js`
- **UMD**: `dist/index.umd.js` 和 `dist/markdown-core.umd.js`
- **Types**: `dist/index.d.ts` 和 `dist/markdown-core.d.ts`

### 依赖分析

| 库 | 类型 | 用途 |
|----|------|------|
| mermaid | runtime | 图表渲染 |
| katex | runtime | 数学公式 |
| clsx | runtime | CSS 类名合并 |
| react-markdown | peer | Markdown 解析（可选） |
| react | peer | React 集成（可选） |

---

## 未来计划

- [ ] Vue 3 Adapter
- [ ] Svelte Adapter
- [ ] 独立的 CLI 工具
- [ ] 核心库体积优化
