import { useEffect, useState, useRef } from 'react';
import {
  initializeMermaid,
  renderMermaid,
  escapeBrackets,
} from '@zjlab-frontier/markdown';

export default function CoreTest() {
  const [raw, setRaw] = useState<string>('');
  const [processed, setProcessed] = useState<string>('');
  const [svg, setSvg] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initializeMermaid();
    // 示例 mermaid
    const demoMermaid = `graph TD\n  A[Start] --> B{Is it OK?}\n  B -- Yes --> C[Done]\n  B -- No --> D[Fix]`;
    renderMermaid(demoMermaid, 'coretest-1')
      .then((s) => setSvg(s))
      .catch((e) => setSvg('渲染失败: ' + (e?.message || String(e))));

    // 示例 markdown
    import('./formulaTest.md?raw')
      .then((m) => {
        setRaw(m.default);
        setProcessed(escapeBrackets(m.default));
      })
      .catch(() => {
        setRaw('# 无法加载');
        setProcessed('# 无法加载');
      });
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = svg;
    }
  }, [svg]);

  return (
    <div style={{ padding: 12, border: '1px dashed #ddd', borderRadius: 6 }}>
      <h4>核心库测试（非 React）</h4>
      <div style={{ marginBottom: 8 }}>
        <strong>原始（raw）Markdown 片段：</strong>
        <pre style={{ maxHeight: 120, overflow: 'auto' }}>{raw}</pre>
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>预处理后内容（escapeBrackets）：</strong>
        <pre style={{ maxHeight: 120, overflow: 'auto' }}>{processed}</pre>
      </div>
      <div>
        <strong>Mermaid 渲染（renderMermaid）：</strong>
        <div ref={containerRef} style={{ marginTop: 8, border: '1px solid #eee', padding: 8 }} />
      </div>
    </div>
  );
}
