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

// 辅助工具：递归获取节点文本 (用于 Block Math 处理)
const getNodeText = (node: Node): string => {
  if (node.type === 'text' || node.type === 'inlineCode') {
    return (node as Literal).value as string;
  }
  if (node.type === 'break') return '\n';
  if ('children' in node) {
    return (node as Parent).children.map(getNodeText).join('');
  }
  return '';
};

// =================================================================
// 核心算法工具
// =================================================================

/**
 * 平衡括号扫描器
 * 从指定位置开始，读取一个平衡的大括号组 {...}
 * 支持跳过转义字符 \{ 和 \}
 * @param text 完整字符串
 * @param startIndex '{' 所在的索引
 * @returns 闭合 '}' 的索引。如果未闭合，返回 -1
 */
const findBalancedClosing = (text: string, startIndex: number): number => {
  if (text[startIndex] !== '{') return -1;
  
  let depth = 1;
  let i = startIndex + 1;
  
  while (i < text.length && depth > 0) {
    const char = text[i];
    
    // 关键：遇到转义符时，跳过下一个字符，不计入深度
    if (char === '\\') {
      i += 2; 
      continue;
    }

    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
    }
    
    if (depth === 0) return i; // 找到匹配的闭合括号
    i++;
  }
  
  return -1; // 未找到闭合
};

/**
 * 判断字符是否属于 LaTeX 命令名 (a-z, A-Z)
 */
const isCmdChar = (char: string) => /[a-zA-Z]/.test(char);

/**
 * 强容器命令列表
 * 这些命令如果后面没有紧跟参数 { 或 [，则不被视为 LaTeX 公式。
 * 防止普通文本中的 (\ce) 被误渲染。
 */
const CONTAINER_CMDS = new Set([
  'boxed', 'text', 'mathrm', 'mathbf', 'mathit', 'mathbb', 'mathcal', 
  'frac', 'dfrac', 'sqrt', 'binom', 'ce', 'textcolor', 'color'
]);

// =================================================================
// Plugin 主体
// =================================================================

export const remarkBareLatex: Plugin = () => {
  return (tree) => {
    
    // =================================================================
    // Phase 1: Block Math 处理 (环境块)
    // 处理如 \begin{align} ... \end{align}
    // =================================================================
    visit(tree, 'paragraph', (paragraph: Parent) => {
      if (!paragraph.children || paragraph.children.length === 0) return;

      const newChildren: Node[] = [];
      let i = 0;

      while (i < paragraph.children.length) {
        const child = paragraph.children[i];
        const childText = getNodeText(child);

        // 1. 匹配环境开始 \begin{...}
        const startMatch = childText.match(/\\begin\{(align|gather|matrix|cases|split|aligned|equation|flalign)\}/);

        if (startMatch) {
          const envName = startMatch[1];
          const endString = `\\end{${envName}}`;
          const startIndex = startMatch.index!;
          
          // 缓冲区：从 \begin 开始的内容
          let buffer = childText.slice(startIndex); 
          
          let j = i;
          let foundEnd = false;
          
          // 检查当前节点是否已闭合
          if (buffer.includes(endString)) {
             foundEnd = true;
          } else {
             // 否则向后贪婪扫描，直到找到 \end
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
            // 修复 Markdown 转义导致的双反斜杠问题
            buffer = buffer.replace(/\\\n/g, '\\\\\n');
            buffer = buffer.replace(/\\$/g, '\\\\');

            // A. 保留 \begin 之前的普通文本
            if (startIndex > 0) {
              newChildren.push({
                type: 'text',
                value: childText.slice(0, startIndex),
              } as TextNode);
            }

            // B. 插入 Math 节点
            newChildren.push({
              type: 'math',
              value: buffer.trim(),
              data: {
                hName: 'div',
                hProperties: { className: ['math', 'math-display'] },
                hChildren: [{ type: 'text', value: buffer.trim() }]
              }
            } as MathNode);

            // C. 移动主循环指针，跳过已合并的节点
            i = j + 1; 
            continue;
          }
        }

        // 未匹配或未闭合，保留原节点
        newChildren.push(child);
        i++;
      }

      paragraph.children = newChildren;
    });

    // =================================================================
    // Phase 2: Inline Math 处理 (手动扫描 + 递归下降)
    // 处理如 \boxed{...}, \alpha, \sum_{i=1}^n
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
      const originalText = textNode.value;
      const len = originalText.length;

      // 如果文本中连反斜杠都没有，直接跳过 (性能优化)
      if (originalText.indexOf('\\') === -1) return;

      const newNodes: Node[] = [];
      let lastIndex = 0;
      let i = 0;
      let hasMath = false; // 标记是否真的发现了公式，避免无效的 DOM 替换

      while (i < len) {
        const char = originalText[i];

        // 1. 触发点：遇到 '\'
        if (char === '\\') {
          // 读取命令名
          let cmdStart = i + 1;
          let cmdEnd = cmdStart;
          while (cmdEnd < len && isCmdChar(originalText[cmdEnd])) {
            cmdEnd++;
          }
          
          const cmdName = originalText.slice(cmdStart, cmdEnd);
          
          // 2. 预判：这是否是一个有效的 LaTeX 开始？
          let isLatex = false;

          // 策略 A: 强容器命令 (如 \ce, \frac)，必须紧跟 { 或 [
          if (CONTAINER_CMDS.has(cmdName)) {
            let peek = cmdEnd;
            // 跳过命令后的空格
            while (peek < len && /[ \t]/.test(originalText[peek])) {
              peek++;
            }
            // 只有紧跟参数才算公式
            if (peek < len && (originalText[peek] === '{' || originalText[peek] === '[')) {
               isLatex = true;
            }
          }
          // 策略 B: 普通命令 (如 \alpha, \sum)，或者是未知命令，默认视为公式
          else if (cmdName.length > 0) {
            isLatex = true;
          }
          // 策略 C: 单独的反斜杠 (如 "\ ")，暂不处理，视为普通文本
          
          if (isLatex) {
            hasMath = true; // 标记已发现公式

            // --- 3. 贪婪吞噬逻辑 ---
            // 尝试读取尽可能长的合法数学序列
            let cursor = i; 
            
            while (cursor < len) {
              // 3.1 跳过间隔处的空格
              while (cursor < len && /[ \t]/.test(originalText[cursor])) {
                cursor++;
              }
              if (cursor >= len) break;

              // 3.2 根据当前字符决定下一步
              if (originalText[cursor] === '\\') {
                 // 如果反斜杠是最后一位，或者紧接着换行，停止吞噬
                 if (cursor + 1 >= len || originalText[cursor + 1] === '\n') {
                   break;
                 }
                 // 遇到新命令，跳过反斜杠和命令名，继续循环
                 cursor++; 
                 while (cursor < len && isCmdChar(originalText[cursor])) cursor++; 
              } 
              else if (originalText[cursor] === '{') {
                // 遇到参数块，使用平衡算法一次性读完
                const closeIndex = findBalancedClosing(originalText, cursor);
                if (closeIndex !== -1) {
                  cursor = closeIndex + 1; // 移动到 '}' 之后
                } else {
                  // 括号不匹配 (语法错误)，停止贪婪
                  break;
                }
              } 
              else if (/[\+\-\=\*\/\(\)\[\]\.\,\_\^0-9a-zA-Z]/.test(originalText[cursor])) {
                // 遇到允许连接的数学字符 (算符、数字、上下标等)，继续
                cursor++;
              } 
              else {
                // 遇到非法字符 (如中文、换行)，结束当前公式块
                break;
              }
            }

            // 提取公式内容
            const mathContent = originalText.slice(i, cursor);

            // 再次校验：确保截取的内容里确实包含反斜杠 (防止误把纯数字当公式)
            if (mathContent.includes('\\')) {
              // A. 推入之前的普通文本
              if (i > lastIndex) {
                newNodes.push({
                  type: 'text',
                  value: originalText.slice(lastIndex, i)
                } as TextNode);
              }

              // B. 推入 Math 节点
              newNodes.push({
                type: 'inlineMath',
                value: mathContent.trim(),
                data: {
                  hName: 'span',
                  hProperties: { className: ['math', 'math-inline'] },
                  hChildren: [{ type: 'text', value: mathContent.trim() }]
                }
              } as MathNode);

              // C. 更新指针
              lastIndex = cursor;
              i = cursor;
              continue; // 继续外层循环
            }
          }
        }
        
        // 不是公式起点，继续扫描下一个字符
        i++;
      }

      // 如果整个字符串扫描完都没发现公式，直接返回，不做任何修改
      if (!hasMath) return;

      // 处理剩余的尾部文本
      if (lastIndex < len) {
        newNodes.push({
          type: 'text',
          value: originalText.slice(lastIndex)
        } as TextNode);
      }

      // 替换节点
      parent.children.splice(index, 1, ...newNodes);
      return index + newNodes.length;
    });
  };
};