import clsx from "clsx";
import mermaid from "mermaid";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import RemarkBreaks from "remark-breaks"; // 将单个换行符转换为 <br>
import RemarkGfm from "remark-gfm"; // 支持 GitHub 风格 Markdown（表格、任务列表等）
import RehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import RehypeKatex from "rehype-katex"
import { remarkBareLatex } from './remark-bare-latex';
import { processLatexBrackets } from "./utils"
import { remarkDisableSetext } from './remark-disable-setext';

// @ts-ignore rehype-mathjax is not typed
import rehypeMathjax from "rehype-mathjax";
import "katex/dist/katex.min.css";
import "katex/dist/contrib/copy-tex";
import "katex/dist/contrib/mhchem";
import "./markdown.scss";
import "./highlight.scss";


// 统一初始化 Mermaid，避免重复初始化
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose", // 允许内嵌样式
  logLevel: 3, // 只显示警告和错误
  deterministicIds: true, // 确保ID的确定性
  flowchart: {
    useMaxWidth: true, // 自动适应容器宽度
    htmlLabels: true, // 允许HTML标签
  },
});


/**
 * Mermaid 图表渲染组件。
 * 接收 Mermaid 代码字符串，通过 mermaid.js 渲染为 SVG 图表。
 * 支持点击图表（预留扩展点，当前注释掉弹窗逻辑）。
 */
export function Mermaid(props: { code: string }): any {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const lastCodeRef = useRef<string>("");

  // 当 code 变化时，触发 mermaid 渲染
  useEffect(() => {
    const renderMermaid = async () => {
      if (!props.code || !ref.current) return;

      // 避免重复渲染相同内容
      if (props.code === lastCodeRef.current) return;
      lastCodeRef.current = props.code;

      // 每次渲染时生成新的唯一 ID
      const chartId = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // 清理可能的隐藏字符和零宽字符
      let cleanCode = props.code.trim();
      // 移除可能的零宽字符
      cleanCode = cleanCode.replace(/[\u200B-\u200D\uFEFF]/g, '');
      // 移除可能的 HTML 实体编码
      cleanCode = cleanCode.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

      // 检查代码是否可能还在流式输入中（不完整）
      const lines = cleanCode.split('\n').filter(line => line.trim());
      const hasBasicElements = cleanCode.includes('-->') || cleanCode.includes(':::');

      // 检查方括号是否成对（检测节点定义是否完整）
      const openBrackets = (cleanCode.match(/\[/g) || []).length;
      const closeBrackets = (cleanCode.match(/\]/g) || []).length;
      const hasUnmatchedBrackets = openBrackets !== closeBrackets;

      // 更严格的检测条件：
      // 1. 代码太短（< 30 字符）
      // 2. 或者虽然有内容但没有基本元素（箭头或节点定义）
      // 3. 或者方括号不匹配（正在输入中文字，如 A[开始...
      const isLikelyIncomplete = cleanCode.length < 30 ||
        (lines.length > 0 && !hasBasicElements) ||
        hasUnmatchedBrackets;

      if (isLikelyIncomplete) {
        // 代码可能不完整，显示加载提示但不设置错误状态
        if (ref.current) {
          ref.current.innerHTML = '<div style="color:#999;font-size:12px;text-align:center;padding:20px;">Mermaid code is incomplete...</div>';
        }
        setHasError(false);
        return;
      }

      try {
        // 重置错误状态（在开始渲染前）
        setHasError(false);

        // 每次运行前彻底清空容器
        ref.current.innerHTML = "";

        // 先使用 parse 检查语法，避免 Mermaid 自动插入错误 SVG 到 body
        try {
          await mermaid.parse(cleanCode);
        } catch (parseError: any) {
          // 语法检查失败，不调用 render()，避免生成错误 SVG
          setHasError(true);
          console.error("[Markdown] Mermaid 语法检查失败:", parseError);
          if (ref.current) {
            ref.current.innerHTML = `
              <div style="color:#c33;font-size:14px;text-align:center;padding:20px;">
                error in mermaid code<br>
              </div>
            `;
          }
          return;
        }

        // 语法正确，使用 render() 方法渲染图表
        const { svg } = await mermaid.render(chartId, cleanCode);

        // 确保组件仍然挂载
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (e: any) {
        setHasError(true);
        console.error("[Markdown] Mermaid 渲染异常:", e);
      }
    };

    renderMermaid();
  }, [props.code]);

  /**
   * （预留功能）点击图表时在新窗口中查看 SVG。
   * 当前实现被注释，如需启用可取消注释并实现 showImageModal。
   */
  function viewSvgInNewWindow() {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    // const text = new XMLSerializer().serializeToString(svg);
    // const blob = new Blob([text], { type: 'image/svg+xml' });
    // showImageModal(URL.createObjectURL(blob));
  }

  return (
    <div
      className={clsx("no-dark")} // no-dark: 避免深色主题干扰 Mermaid 默认样式
      style={{
        cursor: "pointer",
        overflow: "auto",
        minHeight: "50px", // 确保在渲染前有最小高度，避免布局跳动
        backgroundColor: hasError ? "#fee" : "#f8f8f8",
        padding: "10px",
        border: hasError ? "1px solid #fcc" : "none",
        borderRadius: hasError ? "4px" : "0",
      }}
      ref={ref}
      onClick={() => viewSvgInNewWindow()}
    >
      {hasError ? (
        <div
          style={{
            textAlign: "center",
            padding: "10px",
            color: "#c33",
            fontSize: "14px",
          }}
        >
          error in mermaid code
        </div>
      ) : null}
    </div>
  );
}

interface PreCodeProps {
  children?: any;
  onCopy?: (text: string) => void;
}

/**
 * 自定义 <pre> 包装组件，用于增强代码块功能：
 * - 自动识别语言类型并显示标签
 * - 支持一键复制代码
 * - 特殊处理 Mermaid 代码块：提取内容并渲染为图表
 * - 对纯文本类代码块启用自动换行
 */
export function PreCode(props: PreCodeProps): any {
  const ref = useRef<HTMLPreElement>(null);
  const [language, setLanguage] = useState("");
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const codeDom = ref.current.querySelector("code");
    if (!codeDom) return;

    const match = codeDom.className.match(/language-(\w+)/);
    const detectedLang = match ? match[1] : "text";
    setLanguage(detectedLang);

    // 组件挂载后，对特定语言的代码块启用自动换行（避免横向滚动）
    const wrapLanguages = [
      "",
      "md",
      "markdown",
      "text",
      "txt",
      "plaintext",
      "tex",
      "latex",
    ];
    if (wrapLanguages.includes(detectedLang)) {
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
          <div
            style={{
              padding: "10px",
              backgroundColor: "#96969626",
              fontSize: "12px",
              zIndex: 1,
            }}
          >
            {language}
          </div>
          {/* 复制按钮 */}
          <span
            className="copy-code-button"
            onClick={() => {
              if (ref.current) {
                const text =
                  ref.current.querySelector("code")?.innerText ||
                  ref.current.innerText ||
                  "";
                props.onCopy?.(text);
              }
            }}
          ></span>
          {props.children}
        </pre>
      </div>
      {/* 若检测到 Mermaid 代码，则渲染图表 */}
      {/* {mermaidCode && <Mermaid code={mermaidCode} />} */}
    </>
  );
}

/**
 * 自定义 <code> 组件，支持滚动（最大高度 600px）。
 */
function CustomCode(props: { children?: any; className?: string }): any {
  const ref = useRef<HTMLPreElement>(null);

  return (
    <code
      className={clsx(props?.className)}
      ref={ref}
      style={{
        maxHeight: "600px",
        overflowY: "auto",
        width: "100%",
      }}
    >
      {props.children}
    </code>
  );
}

// ==========================================
// 3. 组件实现
// ==========================================
interface Props {
  content: string;
  mathEngine?: "katex" | "mathjax";
  onCopy?: (text: string) => void;
}

const MathMarkdownViewer: React.FC<Props> = ({
  content,
  mathEngine = "katex",
  onCopy,
}) => {
  const rehypePlugins: any[] = [
    [
      RehypeHighlight,
      {
        detect: false,
        ignoreMissing: true,
      },
    ],
  ];

  if (mathEngine === "katex") {
    rehypePlugins.push([
					RehypeKatex,
					{
						strict: false,
						trust: true,
						macros: {
							"\\cdotp": "‧", // 或者直接使用文本
						},
						errorColor: "#686868",
					},
				]);
  } else if (mathEngine === "mathjax") {
    rehypePlugins.push(rehypeMathjax);
  }

  const processedContent = processLatexBrackets(content)

  return (
    <ReactMarkdown
      remarkPlugins={[
        remarkDisableSetext, // 禁用 Setext 风格标题
        [remarkMath, { singleDollarTextMath: true }],
        remarkBareLatex,
        RemarkGfm,
        RemarkBreaks,
      ]}
      rehypePlugins={rehypePlugins}
      components={{
        pre: (preProps: any) => (
          <PreCode
            {...preProps}
            onCopy={onCopy}
          />
        ), // 增强代码块容器 // TODO 会引起循环渲染
        code: CustomCode, // 支持折叠的代码内容
        p: (pProps: any) => <p {...pProps} dir="auto" />, // 自动文本方向
        a: (aProps: any) => {
          const href = aProps.href || "";
          // 音频链接自动转为 <audio> 元素
          if (/\.(aac|mp3|opus|wav)$/.test(href)) {
            return (
              <figure>
                <audio controls src={href}></audio>
              </figure>
            );
          }
          // 视频链接自动转为 <video> 元素
          if (/\.(3gp|3g2|webm|ogv|mpeg|mp4|avi)$/.test(href)) {
            return (
              <video controls width="99.9%">
                <source src={href} />
              </video>
            );
          }
          // 内部链接（以 /# 开头）在同一窗口打开，其余在新窗口打开
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : aProps.target ?? "_blank";
          return <a {...aProps} target={target} />;
        },
        img: (imgProps: any) => (
          <img {...imgProps} style={{ maxWidth: "100%" }} loading="lazy" />
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  );
};

// 使用 React.memo 优化性能，避免不必要的重渲染
export const MarkdownContent = React.memo(MathMarkdownViewer);

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
    mathEngine?: "katex" | "mathjax";
    onCopy?: (text: string) => void;
  } & React.DOMAttributes<HTMLDivElement>
) {
  const mdRef = useRef<HTMLDivElement>(null);
  return (
    <div
      dir="auto"
      className="markdown-body" // 应用 GitHub 风格 Markdown 样式
      style={{
        fontSize: `${props.fontSize ?? 16}px`,
        fontFamily: props.fontFamily || "inherit",
        ...props.style,
      }}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
      ref={mdRef}
    >
      <MarkdownContent
        content={props.content}
        mathEngine={props.mathEngine}
        onCopy={props.onCopy}
      />
    </div>
  );
}

// 默认导出主组件
export default ZJMarkdown;
