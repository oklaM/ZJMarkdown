import { useState, useEffect } from 'react'
import { ZJMarkdown } from '@zjlab-frontier/markdown';
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // 动态导入 Markdown 文件，使用 ?raw 后缀获取原始内容
    import('./f6c648b0-8fae-44d7-bcf9-6449b49f1f2c.md?raw')
      .then((module) => {
        setMarkdown(module.default);
      })
      .catch((error) => {
        console.error('Failed to load markdown file:', error);
        setMarkdown('# 加载失败\n\n无法加载 Markdown 文件，请检查文件路径是否正确。');
      });
  }, []);

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
