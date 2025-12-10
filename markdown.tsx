import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
// 引入用于 Markdown 扩展的插件
import RehypeHighlight from 'rehype-highlight'; // 代码高亮
import RehypeKatex from 'rehype-katex'; // LaTeX 数学公式渲染（KaTeX）
import RemarkBreaks from 'remark-breaks'; // 将单个换行符转换为 <br>
import RemarkGfm from 'remark-gfm'; // 支持 GitHub 风格 Markdown（表格、任务列表等）
import RemarkMath from 'remark-math'; // 支持 LaTeX 数学公式语法（$...$, $$...$$）
// 引入样式文件
import 'katex/dist/katex.min.css';
import './highlight.scss';
import './markdown.scss';
// 测试 Markdown
import { markdownTestContent } from './markdownTestContent';
// 引入核心库（纯 JS）
import {
  initializeMermaid,
  renderMermaid,
  copyToClipboard,
  escapeBrackets,
  detectLanguage,
  shouldWrapText,
  isAudioLink,
  isVideoLink,
  isInternalLink,
  generateChartId,
} from './markdown-core';

// 初始化 Mermaid（仅在 React adapter 中调用）
initializeMermaid();

/**
 * Mermaid 图表渲染组件（React Adapter）
 * 接收 Mermaid 代码字符串，通过 mermaid.js 渲染为 SVG 图表。
 */
export function Mermaid(props: { code: string }): any {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const lastCodeRef = useRef<string>("");
  const chartId = useMemo(() => generateChartId(), []);

  // 当 code 变化时，触发 mermaid 渲染
  useEffect(() => {
    if (!props.code || !ref.current) return;
    
    // 避免重复渲染相同内容
    if (props.code === lastCodeRef.current) return;
    lastCodeRef.current = props.code;

    try {
        // 重置错误状态
        setHasError(false);
        
        // 每次运行前彻底清空容器
        ref.current.innerHTML = '';
        
        // 使用 markdown-core 的 renderMermaid 函数
        renderMermaid(props.code, chartId)
          .then((svg) => {
            // 确保组件仍然挂载
            if (ref.current) {
              // 将生成的SVG代码插入到容器中
              ref.current.innerHTML = svg;
            }
          })
          .catch(() => {
            setHasError(true);
          });
    } catch (e: any) {
      setHasError(true);
      console.error("[Markdown] Mermaid 渲染失败:", e.message);
    }
  }, [props.code, chartId]);

  return (
    <div
      className={clsx('no-dark')} // no-dark: 避免深色主题干扰 Mermaid 默认样式
      style={{
        cursor: 'pointer',
        overflow: 'auto',
        minHeight: '50px', // 确保在渲染前有最小高度，避免布局跳动
        backgroundColor: hasError ? '#fee' : '#f8f8f8',
        padding: '10px',
        border: hasError ? '1px solid #fcc' : 'none',
        borderRadius: hasError ? '4px' : '0'
      }}
      ref={ref}
    >
      {hasError ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '10px', 
          color: '#c33',
          fontSize: '14px'
        }}>
          Mermaid 图表渲染失败，请检查代码语法
        </div>
      ) : null}
    </div>
  );
}

/**
 * 自定义 <pre> 包装组件，用于增强代码块功能：
 * - 自动识别语言类型并显示标签
 * - 支持一键复制代码
 * - 特殊处理 Mermaid 代码块：提取内容并渲染为图表
 * - 对纯文本类代码块启用自动换行
 */
export function PreCode(props: { children?: any }): any {
  const ref = useRef<HTMLPreElement>(null);
  const [language, setLanguage] = useState("");
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const codeDom = ref.current.querySelector("code");
    if (!codeDom) return;

    const detectedLang = detectLanguage(codeDom.className);
    setLanguage(detectedLang);

    // 组件挂载后，对特定语言的代码块启用自动换行（避免横向滚动）
    if (shouldWrapText(detectedLang)) {
      codeDom.style.whiteSpace = "pre-wrap";
    }

    if (detectedLang === "mermaid") {
      const newCode = codeDom.innerText.trim();
      setMermaidCode((prev) => (prev === newCode ? prev : newCode)); // 仅在变化时更新
    }
  }, [props.children]); // 添加依赖项，确保代码变化时重新检测

  return (
    <>
      <div style={{ position: "relative" }}>
        <pre ref={ref}>
          {/* 显示代码语言标签 */}
          {language && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#3f3f3f",
                fontSize: "12px",
                color: "#fff",
                zIndex: 1,
              }}
            >
              {language}
            </div>
          )}
          {/* 复制按钮 */}
          <span
            className="copy-code-button"
            onClick={() => {
              if (ref.current) {
                copyToClipboard(
                  ref.current.querySelector('code')?.innerText ||
                    ref.current.innerText ||
                    '',
                );
              }
            }}
          ></span>
          { props.children}
        </pre>
      </div>
      {/* 若检测到 Mermaid 代码，则渲染图表 */}
      {mermaidCode && <Mermaid code={mermaidCode} />}
    </>
  );
}

/**
 * 自定义 <code> 组件，支持代码折叠（长代码块默认折叠）。
 * - 超过 400px 高度的代码块显示“查看全部”按钮
 * - 默认折叠状态，点击展开
 */
function CustomCode(props: { children?: any; className?: string }): any {
  const enableCodeFold = true; // 可配置开关

  const ref = useRef<HTMLPreElement>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [showToggle, setShowToggle] = useState(false);

  // 根据内容高度决定是否显示折叠按钮
  useEffect(() => {
    if (ref.current) {
      const codeHeight = ref.current.scrollHeight;
      setShowToggle(codeHeight > 400);
      // 滚动到底部（适用于日志类输出）
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [props.children]);

  const toggleCollapsed = () => {
    setCollapsed((collapsed: any) => !collapsed);
  };

  const renderShowMoreButton = (): any => {
    if (showToggle && enableCodeFold && collapsed) {
      return (
        <div
          className={clsx('show-hide-button', {
            collapsed,
            expanded: !collapsed,
          })}
        >
          <button type="button" onClick={toggleCollapsed}>
            {'查看全部'}
          </button>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <code
        className={clsx(props?.className)}
        ref={ref}
        style={{
          maxHeight: enableCodeFold && collapsed ? '400px' : 'none',
          overflowY: 'hidden',
          width: '100%',
        }}
      >
        {props.children}
      </code>

      {renderShowMoreButton()}
    </>
  );
}

function escapeBracketsWrapper(text: string) {
  // 使用从 markdown-core 导出的函数
  return escapeBrackets(text);
}


/**
 * 内部 Markdown 渲染组件（不直接导出）。
 * 负责预处理内容并配置 ReactMarkdown 插件与自定义组件。
 */
function _MarkDownContent(props: { content: string }) {
  // 预处理：转义公式 + 过滤危险 HTML
  const escapedContent = useMemo(() => {
    return escapeBracketsWrapper(props.content);
  }, [props.content]);
  return (
    <ReactMarkdown
      // Remark 插件（解析阶段）
      remarkPlugins={[
        RemarkMath,
        RemarkGfm, // TODO 会引起布局过大
        RemarkBreaks,
      ]}
      // Rehype 插件（HTML 处理阶段）
			rehypePlugins={[
				[
					RehypeKatex,
					{
						strict: false,
						trust: true,
						macros: {
              "\\cdotp": "‧", // 或者直接使用文本
            },
            errorColor: "#686868"
					},
				],
				[
					RehypeHighlight,
					{
						detect: false,
						ignoreMissing: true,
					},
				],
			]}
      // 自定义 HTML 标签渲染
      components={{
        pre: PreCode, // 增强代码块容器 // TODO 会引起循环渲染
        code: CustomCode, // 支持折叠的代码内容
        p: (pProps: any) => <p {...pProps} dir="auto" />, // 自动文本方向
        a: (aProps: any) => {
          const href = aProps.href || '';
          // 音频链接自动转为 <audio> 元素
          if (isAudioLink(href)) {
            return (
              <figure>
                <audio controls src={href}></audio>
              </figure>
            );
          }
          // 视频链接自动转为 <video> 元素
          if (isVideoLink(href)) {
            return (
              <video controls width="99.9%">
                <source src={href} />
              </video>
            );
          }
          // 内部链接（以 /# 开头）在同一窗口打开，其余在新窗口打开
          const target = isInternalLink(href) ? '_self' : aProps.target ?? '_blank';
          return <a {...aProps} target={target} />;
        },
      }}
    >
      {escapedContent}
    </ReactMarkdown>
  );
}

// 使用 React.memo 优化性能，避免不必要的重渲染
export const MarkdownContent = React.memo(_MarkDownContent);

/**
 * 主 Markdown 渲染组件，供外部使用。
 * 支持自定义字体、字号、颜色等样式，并透传事件。
 */
export function ZJMarkdown(
  props: {
    content: string;
    fontSize?: number; // 字体大小（默认 16px）
    fontFamily?: string; // 字体族
    style?: React.CSSProperties;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);
  return (
    <div
      dir="auto"
      className="markdown-body" // 应用 GitHub 风格 Markdown 样式
      style={{
        fontSize: `${props.fontSize ?? 16}px`,
        fontFamily: props.fontFamily || 'inherit',
        ...props.style,
      }}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
      ref={mdRef}
    >
      <MarkdownContent content={props.content} />
    </div>
  );
}

/**
 * 自带 Markdown 测试内容的组件，方便快速调试和布局。
 */
export const TestZJMarkdown: any = (props: { content?: string }) => {
  return <ZJMarkdown content={props.content || markdownTestContent}></ZJMarkdown>;
};

// 默认导出主组件
export default ZJMarkdown;
