import clsx from "clsx";
import mermaid from "mermaid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import RemarkBreaks from "remark-breaks"; // 将单个换行符转换为 <br>
import RemarkGfm from "remark-gfm"; // 支持 GitHub 风格 Markdown（表格、任务列表等）
import {
  MathJax,
  MathJaxContext,
  MathJaxContextProps,
} from "better-react-mathjax";
import "katex/dist/katex.min.css";
import "./highlight.scss";
import "./markdown.scss";

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
 * 将指定文本复制到剪贴板。
 * 使用现代 Clipboard API，若失败则记录错误（例如在非安全上下文中）。
 * @param text - 要复制的字符串内容。
 */
function copyToClipboard(text: string): void {
  try {
    navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("[Markdown] 复制失败:", err);
  }
}

/**
 * Mermaid 图表渲染组件。
 * 接收 Mermaid 代码字符串，通过 mermaid.js 渲染为 SVG 图表。
 * 支持点击图表（预留扩展点，当前注释掉弹窗逻辑）。
 */
export function Mermaid(props: { code: string }): any {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);
  const lastCodeRef = useRef<string>("");
  // 生成唯一ID，确保每个图表实例独立
  const chartId = useMemo(
    () => `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

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
      ref.current.innerHTML = "";

      // 使用mermaid.render()方法独立渲染每个图表
      // 只传递必需的参数：id和代码
      mermaid
        .render(chartId, props.code.trim())
        .then(({ svg }) => {
          // 确保组件仍然挂载
          if (ref.current) {
            // 将生成的SVG代码插入到容器中
            ref.current.innerHTML = svg;
          }
        })
        .catch((error: any) => {
          setHasError(true);
          console.error("[Markdown] Mermaid 渲染失败:", error.message);
        });
    } catch (e: any) {
      setHasError(true);
      console.error("[Markdown] Mermaid 渲染失败:", e.message);
    }
  }, [props.code, chartId]);

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
                  ref.current.querySelector("code")?.innerText ||
                    ref.current.innerText ||
                    ""
                );
              }
            }}
          ></span>
          {props.children}
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
          className={clsx("show-hide-button", {
            collapsed,
            expanded: !collapsed,
          })}
        >
          <button type="button" onClick={toggleCollapsed}>
            {"查看全部"}
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
          maxHeight: enableCodeFold && collapsed ? "400px" : "none",
          overflowY: "hidden",
          width: "100%",
        }}
      >
        {props.children}
      </code>

      {renderShowMoreButton()}
    </>
  );
}

// ==========================================
// 1. MathJax 配置
// ==========================================
const mathJaxConfig: MathJaxContextProps["config"] = {
  loader: {
    load: [
      "[tex]/mhchem",
      "[tex]/color",
      "[tex]/noerrors",
      "[tex]/noundefined",
    ],
  },
  tex: {
    packages: { "[+]": ["mhchem", "color", "noerrors", "noundefined"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
    processEnvironments: true,
    // 3. 配置出错时的表现
    // noerrors: 处理语法错误（如括号不匹配）
    noerrors: {
      disabled: false, // 启用
      multiLine: true, // 允许跨行错误
      style: {
        "font-family": "monospace", // 出错时用等宽字体显示原文
        color: "#333", // 颜色设为深灰（默认是红色，太刺眼）
        "background-color": "#f5f5f5",
        padding: "2px 4px",
        "border-radius": "4px",
      },
    },
    // noundefined: 处理未定义的命令（如 \blabla）
    noundefined: {
      color: "#333", // 颜色设为深灰
      background: "#f5f5f5",
      family: "monospace", // 字体
    },
  },
  options: {
    skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
  },
  startup: { typeset: false },
};

// ==========================================
// 2. 核心：字符串预处理函数 (反斜杠加倍版)
// ==========================================
const preprocessLaTeX = (text: string) => {
  const protectedBlocks: string[] = [];

  const pushProtect = (content: string) => {
    const id = `__PROTECTED_${protectedBlocks.length}__`;
    protectedBlocks.push(content);
    return id;
  };

  /**
   * 核心修复逻辑：
   * 1. 转义反斜杠 \ -> \\ (让 Markdown 输出 \)
   * 2. 转义星号 * -> \* (防止 Markdown 变斜体)
   */
  const escapeMath = (str: string) => {
    return str
      .replace(/\\/g, "\\\\")      // 保护反斜杠
      .replace(/\*/g, "\\*");      // 仅保护星号，不要动下划线
  };

  // ---------------------------------------------------------
  // 🟢 第一步：绝对保护 (代码块)
  // ---------------------------------------------------------
  text = text.replace(/(`{1,3})([\s\S]*?)\1/g, (m) => pushProtect(m));

  // ---------------------------------------------------------
  // 🔴 第二步：处理 LaTeX 公式
  // ---------------------------------------------------------

  // 1. 处理 $$ (Block)
  // $$ 不是 Markdown 特殊符号，所以这里单斜杠转义即可 (JS字符串里写两个)
  text = text.replace(/\$\$([\s\S]*?)\$\$(?:[ \t]*\r?\n){0,2}/g, (match, content) => {
    const cleanContent = content.replace(/\r?\n/g, " "); // 抹平换行
    return pushProtect(`$$${escapeMath(cleanContent)}$$`);
  });

  // 2. 处理 $ (Inline)
  text = text.replace(/\$([^$\n]+?)\$/g, (match, content) => {
    return pushProtect(`$${escapeMath(content)}$`);
  });

  // 3. 处理 \[ (Block) ——【关键修复点】
  // \[ 是 Markdown 转义符，必须给它双倍反斜杠 \\\[
  // 在 JS 字符串里，\\\[ 要写成 "\\\\["
  text = text.replace(/\\\[([\s\S]*?)\\\](?:[ \t]*\r?\n){0,2}/g, (match, content) => {
    const cleanContent = content.replace(/\r?\n/g, " "); // 抹平换行
    // 🔴 改动在这里：使用 \\\\[ 和 \\\\]
    return pushProtect(`\\\\[${escapeMath(cleanContent)}\\\\]`);
  });

  // 4. 处理 \( (Inline) ——【关键修复点】
  // \( 也是 Markdown 转义符，同样需要双倍反斜杠
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, content) => {
    // 🔴 改动在这里：使用 \\\\( 和 \\\\)
    return pushProtect(`\\\\(${escapeMath(content)}\\\\)`);
  });

  // ---------------------------------------------------------
  // 🟡 第三步：处理 Environment (如 align)
  // ---------------------------------------------------------
  const envPattern =
    /\\begin\{(align|gather|matrix|cases|split|aligned)\}([\s\S]*?)\\end\{\1\}(?:[ \t]*\r?\n){0,2}/g;
  text = text.replace(envPattern, (match) => {
    const cleanMatch = match.replace(/\r?\n/g, " ");
    return pushProtect(escapeMath(cleanMatch));
  });

  // ---------------------------------------------------------
  // 🔵 第四步：兜底处理 (裸写命令)
  // ---------------------------------------------------------
  const BRACES = `\\{(?:[^{}]|\\{(?:[^{}]|\\{[^{}]*\\})*\\})*\\}`;
  const simpleEscape = (s: string) => s.replace(/\\/g, "\\\\");

  // 化学/盒子
  text = text.replace(new RegExp(`\\\\(ce|boxed)${BRACES}`, "g"), (match) => {
    return pushProtect(`$${simpleEscape(match)}$`);
  });
  // 巨算符
  const opRegex =
    /\\(sum|prod|int|lim)(?:_\{[^}]*\}|\^\{[^}]*\}|_[a-zA-Z0-9]|\^[a-zA-Z0-9]|[ \t])*/g;
  text = text.replace(opRegex, (match) => {
    return pushProtect(`$${simpleEscape(match.trim())}$`);
  });
  // 常用命令
  const cmdPattern = new RegExp(
    `\\\\(frac|sqrt|text|mathbb|mathcal|mathbf|mathit|mathrm|textcolor|color)(?:\\[[^\\]]*\\])?(?:${BRACES})*`,
    "g"
  );
  text = text.replace(cmdPattern, (match) => {
    return pushProtect(`$${simpleEscape(match)}$`);
  });
  // 符号
  text = text.replace(/\\(rightarrow|leftarrow|Rightarrow|Leftarrow|quad|qquad)\b/g, (match) => {
    return pushProtect(`$${simpleEscape(match)}$`);
  });

  // ---------------------------------------------------------
  // 🏁 第五步：还原
  // ---------------------------------------------------------
  text = text.replace(/__PROTECTED_(\d+)__/g, (_, i) => {
    return protectedBlocks[parseInt(i)];
  });

  return text;
};

// ==========================================
// 3. 组件实现
// ==========================================
interface Props {
  content: string;
}

const MathMarkdownViewer: React.FC<Props> = ({ content }) => {
  const processedContent = preprocessLaTeX(content);

  return (
    <MathJaxContext config={mathJaxConfig} version={3}>
      <MathJax key={processedContent.length}>
        <ReactMarkdown
          remarkPlugins={[
            RemarkGfm, // TODO 会引起布局过大
            RemarkBreaks,
          ]}
          components={{
            pre: PreCode, // 增强代码块容器 // TODO 会引起循环渲染
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
      </MathJax>
    </MathJaxContext>
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
  } & React.DOMAttributes<HTMLDivElement>
) {
  const mdRef = useRef<HTMLDivElement>(null);
  return (
    <div
      dir="auto"
      className="markdown-body" // 应用 GitHub 风格 Markdown 样式
      style={{
        fontSize: `${props.fontSize ?? 15}px`,
        fontFamily: props.fontFamily || "inherit",
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

// 默认导出主组件
export default ZJMarkdown;
