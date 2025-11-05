# zjlab-frontier-markdown

一个功能强大的 React Markdown 组件，支持 Mermaid 图表、KaTeX 数学公式、代码高亮等高级特性。

## 安装

```bash
npm install zjlab-frontier-markdown
# 或
yarn add zjlab-frontier-markdown
```

## 使用方法

```jsx
import React from 'react';
import { ZJMarkdown } from 'zjlab-frontier-markdown';
import 'zjlab-frontier-markdown/dist/zjlab-frontier-markdown.css';

function App() {
  const markdownContent = `
# Hello World

## 这是一个示例文档

### 代码高亮
\`\`\`javascript
function hello() {
  console.log('Hello World!');
}
\`\`\`

### Mermaid 图表
\`\`\`mermaid
graph TD;
    A-->B;
    B-->C;
    C-->D;
\`\`\`

### 数学公式
行内公式: $E = mc^2$

块级公式:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
  `;

  return (
    <div className="app">
      <ZJMarkdown 
        content={markdownContent} 
        fontSize={16}
        fontFamily="Arial, sans-serif"
      />
    </div>
  );
}

export default App;
```

## 功能特性

- ✅ 支持标准 Markdown 语法
- ✅ 支持 GFM (GitHub Flavored Markdown)
- ✅ 代码高亮显示
- ✅ Mermaid 图表渲染
- ✅ KaTeX 数学公式支持
- ✅ 音频/视频嵌入
- ✅ 代码折叠功能
- ✅ 自动复制代码按钮
- ✅ 响应式设计

## ZJMarkdown 组件属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | string | 必需 | Markdown 内容 |
| fontSize | number | 16 | 字体大小 |
| fontFamily | string | inherit | 字体家族 |
| color | string | inherit | 文字颜色 |
| isUser | boolean | false | 是否为用户内容 |
| loading | boolean | false | 加载状态 |
| parentRef | React.RefObject<HTMLDivElement> | undefined | 父元素引用 |
| defaultShow | boolean | true | 默认显示状态 |
| onContextMenu | (e: React.MouseEvent) => void | undefined | 右键菜单事件 |
| onDoubleClickCapture | (e: React.MouseEvent) => void | undefined | 双击事件捕获 |

## 支持的语法

### 代码块

使用三反引号包裹代码，并指定语言以启用语法高亮：

\`\`\`javascript
// JavaScript 代码
const greeting = 'Hello World';
console.log(greeting);
\`\`\`

### Mermaid 图表

使用语言标记 `mermaid` 来渲染 Mermaid 图表：

\`\`\`mermaid
graph LR;
    A[开始] --> B[处理];
    B --> C[结束];
\`\`\`

### 数学公式

使用 `$` 包裹行内公式，使用 `$$` 包裹块级公式：

行内公式: $x^2 + y^2 = z^2$

块级公式:
$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

### 多媒体

自动识别并嵌入音频和视频文件：

```markdown
[音频文件](path/to/audio.mp3)
[视频文件](path/to/video.mp4)
```

## 样式自定义

您可以通过导入并覆盖默认样式来自定义组件外观：

```jsx
import 'zjlab-frontier-markdown/dist/styles/markdown.scss';
import 'zjlab-frontier-markdown/dist/styles/highlight.scss';
import './your-custom-styles.scss';
```

## 贡献

欢迎提交 Issues 和 Pull Requests！

## 许可证

MIT