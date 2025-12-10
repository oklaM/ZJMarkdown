/**
 * 纯 JS 核心库 - 不依赖 React
 * 提供 Markdown 处理的通用逻辑：Mermaid 初始化、KaTeX 预处理、公式转义等
 */

import mermaid from 'mermaid';

// ============ Mermaid 初始化 ============
/**
 * 统一初始化 Mermaid，避免重复初始化
 */
export function initializeMermaid(): void {
  if ((window as any).__mermaidInitialized) {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose', // 允许内嵌样式
    logLevel: 3, // 只显示警告和错误
    deterministicIds: true, // 确保 ID 的确定性
    flowchart: {
      useMaxWidth: true, // 自动适应容器宽度
      htmlLabels: true, // 允许 HTML 标签
    },
  });

  (window as any).__mermaidInitialized = true;
}

/**
 * 渲染 Mermaid 图表
 * @param code - Mermaid 代码字符串
 * @param id - 唯一的图表 ID
 * @returns 返回渲染后的 SVG 字符串的 Promise
 */
export async function renderMermaid(code: string, id: string): Promise<string> {
  try {
    const { svg } = await mermaid.render(id, code.trim());
    return svg;
  } catch (error: any) {
    console.error('[Markdown] Mermaid 渲染失败:', error.message);
    throw error;
  }
}

// ============ 剪贴板操作 ============
/**
 * 将指定文本复制到剪贴板
 * @param text - 要复制的字符串内容
 */
export function copyToClipboard(text: string): void {
  try {
    navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('[Markdown] 复制失败:', err);
  }
}

// ============ 公式转义和预处理 ============
/**
 * 预处理文本中的 LaTeX 公式格式
 * 支持：
 *  - \[...\] -> $$...$$（块级公式）
 *  - \(...\) -> $...$ （行内公式）
 *  - \boxed{...} -> $$\boxed{...}$$
 */
export function preprocessFormulas(text: string): string {
  // 先预处理 LaTeX 格式的公式，将 \[...\] 和 \(...\) 转换为 $$...$$ 和 $...$
  const formulaPattern = /\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  text = text.replace(formulaPattern, (match, squareBracket, roundBracket) => {
    if (squareBracket) {
      return `$$${squareBracket}$$`; // 块级公式
    } else if (roundBracket) {
      return `$${roundBracket}$`; // 行内公式
    }
    return match;
  });

  // 支持嵌套 {} 的 boxed
  const balancedBracesPattern = /\\boxed\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/g;
  text = text.replace(balancedBracesPattern, '$$\\boxed{$1}$$');

  return text;
}

/**
 * 转义文本中的括号和 LaTeX 结构
 * 确保公式不会被错误解析
 */
export function escapeBrackets(text: string): string {
  // 先预处理 LaTeX 格式的公式
  text = preprocessFormulas(text);

  // =============================
  // 1) 保护所有不应被处理的片段
  // =============================
  const protectedBlocks: string[] = [];

  // 按顺序保护：
  //   代码块、inline code、行间公式、行内公式、\[...\]、各类环境
  const protectPattern =
    /```[\s\S]*?```|`[^`]+`|\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\[[\s\S]*?\\\]|\\begin\{[^}]+\}[\s\S]*?\\end\{[^}]+\}/g;

  text = text.replace(protectPattern, (m) => {
    const id = `__PROTECTED_${protectedBlocks.length}__`;
    protectedBlocks.push(m);
    return id;
  });

  // =============================
  // 2) 处理 LaTeX 结构（不会影响数学区）
  // =============================

  const pattern =
    /\\mathbb\{([^}]*)\}|\\mathcal\{([^}]*)\}|\\mathbf\{([^}]*)\}|\\mathit\{([^}]*)\}|\\mathrm\{([^}]*)\}|\\frac\{([^}]*)\}\{([^}]*)\}|\\sqrt\[([^}]*)\]\{([^}]*)\}|\\sqrt\{([^}]*)\}|\\sum_\{([^}]*)\}\^\{([^}]*)\}|\\prod_\{([^}]*)\}\^\{([^}]*)\}|\\int_\{([^}]*)\}\^\{([^}]*)\}|\\lim_\{([^}]*)\}|\\\(([\s\S]*?[^\\])\\\)/g;

  text = text.replace(
    pattern,
    (
      match,
      mathbb,
      mathcal,
      mathbf,
      mathit,
      mathrm,
      fracNum,
      fracDen,
      rootIndex,
      rootArg,
      sqrtArg,
      sumSub,
      sumSup,
      prodSub,
      prodSup,
      intSub,
      intSup,
      limSub,
      roundBracket
    ) => {
      if (mathbb) return `$\\mathbb{${mathbb}}$`;
      if (mathcal) return `$\\mathcal{${mathcal}}$`;
      if (mathbf) return `$\\mathbf{${mathbf}}$`;
      if (mathit) return `$\\mathit{${mathit}}$`;
      if (mathrm) return `$\\mathrm{${mathrm}}$`;
      if (fracNum && fracDen) return `$\\frac{${fracNum}}{${fracDen}}$`;
      if (rootIndex && rootArg) return `$\\sqrt[${rootIndex}]{${rootArg}}$`;
      if (sqrtArg) return `$\\sqrt{${sqrtArg}}$`;
      if (sumSub && sumSup) return `$\\sum_{${sumSub}}^{${sumSup}}$`;
      if (prodSub && prodSup) return `$\\prod_{${prodSub}}^{${prodSup}}$`;
      if (intSub && intSup) return `$\\int_{${intSub}}^{${intSup}}$`;
      if (limSub) return `$\\lim_{${limSub}}$`;
      if (roundBracket) return `$${roundBracket}$`;
      return match;
    }
  );

  // =============================
  // 3) 最后处理 singleDollar （最安全的位置）
  // =============================
  const singleDollarPattern = /(\$)([^$\n]+?)(?=\s|$|\.|,|;|:|\?|!|\)|\]|\})/g;
  text = text.replace(singleDollarPattern, '$$$2$');

  // =============================
  // 4) 恢复所有保护块
  // =============================
  text = text.replace(/__PROTECTED_(\d+)__/g, (_, i) => protectedBlocks[i]);

  return text;
}

/**
 * 检测代码块的语言
 * @param className - code 元素的 className
 * @returns 语言标识符或 'text'
 */
export function detectLanguage(className: string = ''): string {
  const match = className.match(/language-(\w+)/);
  return match ? match[1] : 'text';
}

/**
 * 检查是否应该启用自动换行
 * @param language - 语言标识符
 * @returns 是否应该换行
 */
export function shouldWrapText(language: string): boolean {
  const wrapLanguages = ['', 'md', 'markdown', 'text', 'txt', 'plaintext', 'tex', 'latex'];
  return wrapLanguages.includes(language);
}

/**
 * 检查链接是否为音频
 * @param href - 链接地址
 * @returns 是否为音频文件
 */
export function isAudioLink(href: string): boolean {
  return /\.(aac|mp3|opus|wav)$/.test(href);
}

/**
 * 检查链接是否为视频
 * @param href - 链接地址
 * @returns 是否为视频文件
 */
export function isVideoLink(href: string): boolean {
  return /\.(3gp|3g2|webm|ogv|mpeg|mp4|avi)$/.test(href);
}

/**
 * 检查链接是否为内部链接
 * @param href - 链接地址
 * @returns 是否为内部链接
 */
export function isInternalLink(href: string): boolean {
  return /^\/#/i.test(href);
}

/**
 * 生成唯一的图表 ID
 * @returns 唯一的 ID 字符串
 */
export function generateChartId(): string {
  return `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
