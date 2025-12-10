import { useState, useEffect } from 'react'
// import { ZJMarkdown, TestZJMarkdown } from '../../index';
import { ZJMarkdown, TestZJMarkdown } from '@zjlab-frontier/markdown';
import CoreTest from './CoreTest';
import './App.css'

function App() {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // 动态导入公式测试 Markdown 文件，使用 ?raw 后缀获取原始内容
    import('./formulaTest.md?raw')
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
      <div className="editor-preview-wrapper">
        <div className="editor-container">
          <h3>编辑</h3>
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
      <div className="test-container">
        <h3>测试</h3>
        <div className="test-markdown-container">
          <TestZJMarkdown />
          <div style={{ marginTop: 12 }} />
          <CoreTest />
        </div>
      </div>
    </div>
  )
}

export default App
