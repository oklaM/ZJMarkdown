import clsx from "clsx";
import "katex/dist/katex.min.css";
import mermaid from "mermaid";
import React, { RefObject, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import "./markdown.scss";
import "./highlight.scss";

// 内置 copyToClipboard 函数
function copyToClipboard(text: string): void {
  try {
    navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}
import ReactMarkdown from "react-markdown";
import RehypeHighlight from "rehype-highlight";
import RehypeKatex from "rehype-katex";
import RemarkBreaks from "remark-breaks";
import RemarkGfm from "remark-gfm";
import RemarkMath from "remark-math";
import RehypeRaw from "rehype-raw";

export function Mermaid(props: { code: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (props.code && ref.current) {
      mermaid
        .run({
          nodes: [ref.current],
          suppressErrors: true,
        })
        .catch((e) => {
          setHasError(true);
          console.error("[Mermaid] ", e.message);
        });
    }
  }, [props.code]);

  function viewSvgInNewWindow() {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    // const text = new XMLSerializer().serializeToString(svg);
    // const blob = new Blob([text], { type: 'image/svg+xml' });
    // showImageModal(URL.createObjectURL(blob));
  }

  if (hasError) {
    return null;
  }

  return (
    <div
      className={clsx("no-dark", "mermaid")}
      style={{
        cursor: "pointer",
        overflow: "auto",
      }}
      ref={ref}
      onClick={() => viewSvgInNewWindow()}
    >
      {props.code}
    </div>
  );
}

export function PreCode(props: { children?: any }) {
  const ref = useRef<HTMLPreElement>(null);
  const [mermaidCode, setMermaidCode] = useState("");
  const [language, setLanguage] = useState("");

  const renderArtifacts = useDebouncedCallback(() => {
    if (!ref.current) return;

    const codeDom = ref.current.querySelector("code");
    if (codeDom) {
      // 获取语言类型
      const languageClass = codeDom.className.match(/language-(\w+)/);
      const detectedLanguage = languageClass ? languageClass[1] : "text";
      setLanguage(detectedLanguage);

      // 处理Mermaid
      if (detectedLanguage === "mermaid") {
        setMermaidCode(codeDom.innerText);
      }
    }
  }, 600);
  const mermaidDom = ref.current?.querySelector("code.language-mermaid");
  if (mermaidDom) {
    setMermaidCode((mermaidDom as HTMLElement).innerText);
  }
  //Wrap the paragraph for plain-text
  useEffect(() => {
    if (ref.current) {
      const codeElements = ref.current.querySelectorAll(
        "code"
      ) as NodeListOf<HTMLElement>;
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
      codeElements.forEach((codeElement) => {
        const languageClass = codeElement.className.match(/language-(\w+)/);
        const name = languageClass ? languageClass[1] : "";
        if (wrapLanguages.includes(name)) {
          codeElement.style.whiteSpace = "pre-wrap";
        }
      });
      setTimeout(renderArtifacts, 1);
    }
  }, []);
  return (
    <>
      <div style={{ position: "relative" }}>
        <pre ref={ref}>
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
          <span
            className="copy-code-button"
            onClick={() => {
              if (ref.current) {
                copyToClipboard(
                  ref.current.querySelector("code")?.innerText ?? ""
                );
              }
            }}
          ></span>
          {props.children}
        </pre>
      </div>
      {mermaidCode.length > 0 && (
        <Mermaid code={mermaidCode} key={mermaidCode} />
      )}
    </>
  );
}

function CustomCode(props: { children?: any; className?: string }) {
  const enableCodeFold = true;

  const ref = useRef<HTMLPreElement>(null);
  const [collapsed, setCollapsed] = useState(true);
  const [showToggle, setShowToggle] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const codeHeight = ref.current.scrollHeight;
      setShowToggle(codeHeight > 400);
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [props.children]);

  const toggleCollapsed = () => {
    setCollapsed((collapsed) => !collapsed);
  };
  const renderShowMoreButton = () => {
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
        }}
      >
        {props.children}
      </code>

      {renderShowMoreButton()}
    </>
  );
}

function escapeBrackets(text: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(
    pattern,
    (match, codeBlock, squareBracket, roundBracket) => {
      if (codeBlock) {
        return codeBlock;
      } else if (squareBracket) {
        return `$$${squareBracket}$$`;
      } else if (roundBracket) {
        return `$${roundBracket}$`;
      }
      return match;
    }
  );
}

// 过滤危险标签
function tryWrapHtmlCode(text: string) {
  // 提取所有公式（行内和块级），并用唯一标识符替代
  const formulaRegex = /(\$\$[\s\S]*?\$\$)|(?<!\$)\$(?!\$)[\s\S]*?\$(?!\$)/g;
  const placeholders = new Map<string, string>();
  let placeholderIndex = 0;

  text = text.replace(formulaRegex, (match) => {
    const placeholder = `__FORMULA_PLACEHOLDER_KATEX_${placeholderIndex++}_CODE__`;
    placeholders.set(placeholder, match);
    return placeholder;
  });

  // 先匹配并保留代码块
  const codeBlockPattern = /```[\s\S]*?```|`.*?`/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  // 分割文本为代码块和非代码块部分
  while ((match = codeBlockPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        isCode: false,
      });
    }
    parts.push({
      text: match[0],
      isCode: true,
    });
    lastIndex = codeBlockPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isCode: false,
    });
  }

  // 只处理非代码块部分
  const processedParts = parts.map((part) => {
    if (part.isCode) {
      return part.text;
    }
    const replaceText = part.text.replace(/[<>/=]/g, (match) => {
      return (
        {
          "<": "&lt;",
          ">": "&gt;",
          "/": "&#47;",
          "=": "&#61;",
        }[match] || match
      );
    });
    return replaceText;
  });

  let result = processedParts.join("");

  // 还原公式内容
  placeholders.forEach((original, placeholder) => {
    result = result.replace(
      placeholder,
      original
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&#47;", "/")
        .replace("&&#61;", "=")
    );
  });
  return result;
}

function _MarkDownContent(props: { content: string }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const escapedContent = useMemo(() => {
    return tryWrapHtmlCode(escapeBrackets(props.content));
  }, [props.content]);
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeRaw,
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
      components={{
        pre: PreCode,
        code: CustomCode,
        p: (pProps) => <p {...pProps} dir="auto" />,
        a: (aProps) => {
          const href = aProps.href || "";
          if (/\.(aac|mp3|opus|wav)$/.test(href)) {
            return (
              <figure>
                <audio controls src={href}></audio>
              </figure>
            );
          }
          if (/\.(3gp|3g2|webm|ogv|mpeg|mp4|avi)$/.test(href)) {
            return (
              <video controls width="99.9%">
                <source src={href} />
              </video>
            );
          }
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : (aProps.target ?? "_blank");
          return <a {...aProps} target={target} />;
        },
      }}
    >
      {escapedContent}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);

export function ZJMarkdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    color?: string;
    isUser?: boolean;
    fontFamily?: string;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>
) {
  const mdRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 16}px`,
        fontFamily: props.fontFamily || "inherit",
        // color: props.color || "inherit",
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
      dir="auto"
    >
      <MarkdownContent content={props.content} />
    </div>
  );
}

// 添加默认导出
export default ZJMarkdown;
