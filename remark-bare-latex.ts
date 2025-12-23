import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Node, Parent, Literal } from 'unist';

// --- 类型定义 ---
interface TextNode extends Literal {
  type: 'text';
  value: string;
}

interface MathNode extends Literal {
  type: 'math' | 'inlineMath';
  value: string;
  data?: {
    hName: string;
    hProperties: any;
    hChildren: any[];
  };
}

// 辅助工具：递归获取节点文本 (带类型断言)
const getNodeText = (node: Node): string => {
  if (node.type === 'text' || node.type === 'inlineCode') {
    return (node as Literal).value as string;
  }
  if (node.type === 'break') {
    return '\n';
  }
  if ('children' in node) {
    return (node as Parent).children.map(getNodeText).join('');
  }
  return '';
};

export const remarkBareLatex: Plugin = () => {
  return (tree) => {
    
    // =================================================================
    // Phase 1: Block Math 处理 (带前缀切分功能)
    // =================================================================
    visit(tree, 'paragraph', (paragraph: Parent, index: number | undefined, parent: Parent | undefined) => {
      if (!paragraph.children || paragraph.children.length === 0) return;

      const newChildren: Node[] = [];
      let i = 0;

      while (i < paragraph.children.length) {
        const child = paragraph.children[i];
        const childText = getNodeText(child);

        // 1. 匹配环境开始
        const startMatch = childText.match(/\\begin\{(align|gather|matrix|cases|split|aligned|equation|flalign)\}/);

        if (startMatch) {
          const envName = startMatch[1];
          const endString = `\\end{${envName}}`;
          const startIndex = startMatch.index!; // \begin 出现的起始位置
          
          // --- 核心修复：缓冲区只从 \begin 开始，不包含前面的文本 ---
          let buffer = childText.slice(startIndex); 
          
          let j = i;
          let foundEnd = false;
          
          // 如果当前这一个节点里就已经包含了 \end (单节点闭合)
          if (buffer.includes(endString)) {
             foundEnd = true;
             // 如果在同一节点闭合，我们需要截断 buffer 到 \end 结束的位置
             // 这里的逻辑稍微简化处理，假设 Block Environment 通常占据剩余内容
             // 如果你要支持 "Text \begin..\end Text"，这里需要更复杂的 substring
          } else {
             // 否则，向后贪婪扫描后续节点
             j = i + 1;
             while (j < paragraph.children.length) {
                const nextNodeText = getNodeText(paragraph.children[j]);
                buffer += nextNodeText;
                
                if (buffer.includes(endString)) {
                  foundEnd = true;
                  break; 
                }
                j++;
             }
          }

          if (foundEnd) {
            // --- 切分与合并 ---

            // 逻辑：
            // 1. Markdown 把 "a \\" 解析成了 "a \" (AST Value)
            // 2. 我们正则查找：以 \ 结尾，后面紧跟换行符 \n 或者 字符串结束 $ 的情况
            // 3. 将其替换回 \\
            
            // 处理行末的 \
            buffer = buffer.replace(/\\\n/g, '\\\\\n');
            // 处理最后一行的 \ (如果用户习惯最后一行也加 \\)
            buffer = buffer.replace(/\\$/g, '\\\\');

            // A. 处理前缀文本 (即 "Align 环境：" 这部分)
            if (startIndex > 0) {
              newChildren.push({
                type: 'text',
                value: childText.slice(0, startIndex), // 只保留 \begin 之前的部分
              } as TextNode);
            }

            // B. 处理公式部分
            // 此时 buffer 是干净的 LaTeX 代码 (从 \begin 开始)
            newChildren.push({
              type: 'math', // Block Math
              value: buffer.trim(),
              data: {
                hName: 'div',
                hProperties: { className: ['math', 'math-display'] },
                hChildren: [{ type: 'text', value: buffer.trim() }]
              }
            } as MathNode);

            // C. 移动指针
            // i 变成 j + 1，跳过所有已合并的节点
            // 注意：如果是单节点内闭合 (i===j)，这里逻辑也是对的 (i = i + 1)
            i = j + 1; 
            continue;
          }
        }

        // 没匹配到，或者是匹配到了但没找到闭合，保留原样
        newChildren.push(child);
        i++;
      }

      paragraph.children = newChildren;
    });

    // =================================================================
    // Phase 2: Inline Math 处理 (保持不变)
    // =================================================================
    visit(tree, 'text', (node: Node, index: number | undefined, parent: Parent | undefined) => {
      if (
        !parent ||
        parent.type === 'code' ||
        parent.type === 'inlineCode' ||
        parent.type === 'math' || 
        parent.type === 'inlineMath' ||
        index === undefined
      ) {
        return;
      }

      const textNode = node as TextNode;
      const textValue = textNode.value;

      const H_SPACE = "[ \\t]";
      const BRACES = `\\{(?:[^{}]|\\{(?:[^{}]|\\{[^{}]*\\})*\\})*\\}`;
      const cmdsRequiringArgs = "frac|sqrt|text|mathbb|mathcal|mathbf|mathit|mathrm|textcolor|color|ce|boxed";
      const cmdAtom = `\\\\(?:${cmdsRequiringArgs})(?:\\[[^\\]]*\\])?(?:${BRACES})+`;
      const opAtom = `\\\\(?:sum|prod|int|lim)(?:_\\{[^}]*\\}|\\^\\{[^}]*\\}|_[a-zA-Z0-9]|\\^[a-zA-Z0-9]|${H_SPACE})*`;
      const symbols = "alpha|beta|gamma|delta|theta|lambda|pi|sigma|omega|Delta|Theta|Lambda|Pi|Sigma|Omega|infty|approx|neq|leq|geq|times|div|pm|cdot|rightarrow|leftarrow|Rightarrow|Leftarrow|quad|qquad";
      const symbolAtom = `\\\\(?:${symbols})\\b`;
      const latexAtom = `(?:${cmdAtom}|${opAtom}|${symbolAtom})`;
      
      const chainRegex = new RegExp(`(${latexAtom})(${H_SPACE}*${latexAtom})*`, "g");

      if (!chainRegex.test(textValue)) return;
      chainRegex.lastIndex = 0;

      const newNodes: (TextNode | MathNode)[] = [];
      let lastIndex = 0;
      let match;

      while ((match = chainRegex.exec(textValue)) !== null) {
        const fullMatch = match[0];
        
        if (match.index > lastIndex) {
          newNodes.push({
            type: 'text',
            value: textValue.slice(lastIndex, match.index),
          } as TextNode);
        }

        newNodes.push({
          type: 'inlineMath',
          value: fullMatch.trim(), 
          data: {
            hName: 'span',
            hProperties: { className: ['math', 'math-inline'] },
            hChildren: [{ type: 'text', value: fullMatch.trim() }]
          }
        } as MathNode);

        lastIndex = chainRegex.lastIndex;
      }

      if (lastIndex < textValue.length) {
        newNodes.push({
          type: 'text',
          value: textValue.slice(lastIndex),
        } as TextNode);
      }

      parent.children.splice(index, 1, ...newNodes);
      return index + newNodes.length;
    });
  };
};