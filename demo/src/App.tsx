import { useState } from 'react'
import { ZJMarkdown } from '../node_modules/zjlab-frontier-markdown';
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState(`# Markdown 组件演示

## 基础功能

这是一个**加粗**文本，这是一个*斜体*文本。

### 列表

- 无序列表项1
- 无序列表项2
- 无序列表项3

1. 有序列表项1
2. 有序列表项2
3. 有序列表项3

### 代码高亮

\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\`

### 链接
[百度](https://www.baidu.com)

### 表格
| 名称 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 唯一标识符 |
| name | string | 名称 |`);

  return (
    <div className="container">
      <h1>Markdown 组件演示</h1>
      <div className="editor-container">
        <textarea 
          className="editor"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="输入Markdown内容..."
        />
      </div>
      <div className="preview-container">
        <h3>预览</h3>
        <div className="markdown-container">
          <ZJMarkdown content={markdown} />
        </div>
      </div>
    </div>
  )
}

export default App
