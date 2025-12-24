

// 检查是否包含潜在的 LaTeX 模式
const containsLatexRegex = /\\\(.*?\\\)|\\\[.*?\\\]/s

/**
 * 转换 LaTeX 公式括号 `\[\]` 和 `\(\)` 为 Markdown 格式 `$$...$$` 和 `$...$`
 *
 * remark-math 本身不支持 LaTeX 原生语法，作为替代的一些插件效果也不理想。
 *
 * 目前的实现：
 * - 保护代码块和链接，避免被 remark-math 处理
 * - 支持嵌套括号的平衡匹配
 * - 转义括号 `\\(\\)` 或 `\\[\\]` 不会被处理
 *
 * @see https://github.com/remarkjs/remark-math/issues/39
 * @param text 输入的 Markdown 文本
 * @returns 处理后的字符串
 */
export const processLatexBrackets = (text: string) => {
  // 没有 LaTeX 模式直接返回
  if (!containsLatexRegex.test(text)) {
    return text
  }

  // 保护代码块和链接
  const protectedItems: string[] = []
  let processedContent = text

  processedContent = processedContent
    // 保护代码块（多行代码块）
    .replace(/(`{3,})([\s\S]*?)\1`*/g, (match) => {
      const index = protectedItems.length
      protectedItems.push(match)
      return `__CHERRY_STUDIO_PROTECTED_${index}__`
    })
    // 保护代码块（行内代码）
    .replace(/(`{1,2})([^\r\n]*?)\1(?!`)/g, (match) => {
      const index = protectedItems.length
      protectedItems.push(match)
      return `__CHERRY_STUDIO_PROTECTED_${index}__`
    })
    // 保护链接 [text](url)
    .replace(/\[([^[\]]*(?:\[[^\]]*\][^[\]]*)*)\]\([^)]*?\)/g, (match) => {
      const index = protectedItems.length
      protectedItems.push(match)
      return `__CHERRY_STUDIO_PROTECTED_${index}__`
    })

  // LaTeX 括号转换函数
  const processMathAndProtect = (content: string, openDelim: string, closeDelim: string, wrapper: string, eatTail = false): string => {
    let result = ''
    let remaining = content

    while (remaining.length > 0) {
      const match = findLatexMatch(remaining, openDelim, closeDelim)
      if (!match) {
        result += remaining
        break
      }

      result += match.pre
      // 保护匹配内容
      const index = protectedItems.length
      protectedItems.push(`${wrapper}${match.body}${wrapper}`)
      result += `__CHERRY_STUDIO_PROTECTED_${index}__`

      // 处理尾部吞噬逻辑
      if (eatTail) {
        // 查找 match.post 中第一个换行符的位置
        const nextNewLine = match.post.indexOf('\n')
        
        if (nextNewLine === -1) {
          // 如果后面没有换行符了，说明是文件末尾，把剩下的全吞掉
          remaining = '' 
        } else {
          // 如果有换行符，跳过中间的所有字符，直接从换行符开始继续处理
          // 这样 " km/h\n下一行" 中的 " km/h" 就被丢弃了
          remaining = match.post.slice(nextNewLine)
        }
      } else {
        // 不需要吞噬，正常衔接
        remaining = match.post
      }
    }

    return result
  }

  // 先处理块级公式，再处理内联公式
  let result = processMathAndProtect(processedContent, '$$', '$$', '$$', true)
  result = processMathAndProtect(result, '\\[', '\\]', '$$', true)
  result = processMathAndProtect(result, '\\(', '\\)', '$', false)
  

  // result = processBareLatex(result)

  // 还原被保护的内容
  result = result.replace(/__CHERRY_STUDIO_PROTECTED_(\d+)__/g, (match, indexStr) => {
    const index = parseInt(indexStr, 10)
    // 添加边界检查，防止数组越界
    if (index >= 0 && index < protectedItems.length) {
      return protectedItems[index]
    }
    // 如果索引无效，保持原始匹配
    return match
  })

  return result
}


/**
 * 查找 LaTeX 数学公式的匹配括号对
 *
 * 使用平衡括号算法处理嵌套结构，正确识别转义字符
 *
 * @param text 要搜索的文本
 * @param openDelim 开始分隔符 (如 '\[' 或 '\(')
 * @param closeDelim 结束分隔符 (如 '\]' 或 '\)')
 * @returns 匹配结果对象或 null
 */
const findLatexMatch = (text: string, openDelim: string, closeDelim: string) => {
  // 统计连续反斜杠：奇数个表示转义，偶数个表示未转义
  const escaped = (i: number) => {
    let count = 0
    while (--i >= 0 && text[i] === '\\') count++
    return count & 1
  }

  // 查找第一个有效的开始标记
  for (let i = 0, n = text.length; i <= n - openDelim.length; i++) {
    // 没有找到开始分隔符或被转义，跳过
    if (!text.startsWith(openDelim, i) || escaped(i)) continue

    // 处理嵌套结构
    for (let j = i + openDelim.length, depth = 1; j <= n - closeDelim.length && depth; j++) {
      // 计算当前位置对深度的影响：+1(开始), -1(结束), 0(无关)
      const delta =
        text.startsWith(openDelim, j) && !escaped(j) ? 1 : text.startsWith(closeDelim, j) && !escaped(j) ? -1 : 0

      if (delta) {
        depth += delta

        // 找到了匹配的结束位置
        if (!depth)
          return {
            start: i,
            end: j + closeDelim.length,
            pre: text.slice(0, i),
            body: text.slice(i + openDelim.length, j),
            post: text.slice(j + closeDelim.length)
          }

        // 跳过已处理的分隔符字符，避免重复检查
        j += (delta > 0 ? openDelim : closeDelim).length - 1
      }
    }
  }

  return null
}

/**
 * 处理裸露的 LaTeX 命令，将其包裹在 `$` 中。
 * 这个函数应该在 `processLatexBrackets` 之后调用，以避免影响已有的公式。
 *
 * @param text 已经处理过 `\(` 和 `\[` 括号的 Markdown 文本
 * @returns 处理了裸命令的字符串
 */
export const processBareLatex = (text: string) => {
  const protectedBlocks: string[] = [];

  // 保护机制：将不需要处理的内容（代码块、已经包裹好的公式）暂时移出
  const pushProtect = (content: string) => {
    const id = `__PROTECTED_${protectedBlocks.length}__`;
    protectedBlocks.push(content);
    return id;
  };

  // 1. 保护代码块 (保持不变，防止代码里的 LaTeX 被误伤)
//   text = text.replace(/(`+)([\s\S]*?)\1`*/g, (match) => pushProtect(match));

  // 2. 保护已经存在的 $$ Block
  // KaTeX 对于换行比较敏感，align 环境里需要保留换行，不要随意替换成空格
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match) => pushProtect(match));

  // 3. 保护已经存在的 $ Inline
  text = text.replace(/\$([^$\n]+?)\$/g, (match) => pushProtect(match));

  // =========================================================
  // 处理裸露的 LaTeX (Bare LaTeX) 适配 KaTeX
  // =========================================================

  // 辅助函数：简单的转义，防止生成的 LaTeX 内部包含意外的 markdown 符号
  // 注意：KaTeX 不需要把 \frac 转义成 \\frac，所以这里去掉了对 \ 的转义
  // 只需要处理可能导致 Markdown 解析错误的特殊字符（视具体 Markdown 渲染器而定，通常保持原样即可）
  const wrapInline = (content: string) => {
    return pushProtect(`$${content}$`);
  };

  const wrapBlock = (content: string) => {
    return pushProtect(`$$\n${content}\n$$`);
  };

  // 4. 处理 Environment (如 align, gather 等)
  // KaTeX 要求这些环境必须在 displayMode ($$) 下，或者使用 aligned 等行内变体
  // 这里我们将裸写的 environment 强制包裹在 $$ 中
  const envPattern = /\\begin\{(align|gather|matrix|cases|split|aligned|equation|flalign)\}([\s\S]*?)\\end\{\1\}/g;
  text = text.replace(envPattern, (match) => {
    return wrapBlock(match); 
  });

  // 5. 处理 LaTeX inline 命令和符号
  // 定义水平空白字符（空格和制表符）
  const H_SPACE = "[ \\t]"; 
  // 支持递归嵌套的大括号正则
  const BRACES = `\\{(?:[^{}]|\\{(?:[^{}]|\\{[^{}]*\\})*\\})*\\}`;

  // 定义那些【必须】带参数才有数学意义的命令
  // 如果只写 \ce 或 \frac 而不带括号，通常只是在文本中提到它们，不应渲染
  const cmdsRequiringArgs = "frac|sqrt|text|mathbb|mathcal|mathbf|mathit|mathrm|textcolor|color|ce|boxed";
  
  // 关键修改：将末尾的 * (零或多) 改为 + (一或多)
  // 含义：匹配 \cmd，后面可能有可选参数 [], 然后【必须】紧跟至少一组花括号 {}
  const cmdAtomWithArgs = `\\\\(?:${cmdsRequiringArgs})(?:\\[[^\\]]*\\])?(?:${BRACES})+`;

  // 运算符 (sum, prod 等) 可以不带花括号单独存在 (比如后面跟空格)
  // 结尾继续使用 H_SPACE*，允许 \sum 后面跟空格
  const opAtom = `\\\\(?:sum|prod|int|lim)(?:_\\{[^}]*\\}|\\^\\{[^}]*\\}|_[a-zA-Z0-9]|\\^[a-zA-Z0-9]|${H_SPACE})*`;

  // 符号和希腊字母 (alpha, beta 等) 本身就是独立的，不需要参数
  const symbols = "alpha|beta|gamma|delta|theta|lambda|pi|sigma|omega|Delta|Theta|Lambda|Pi|Sigma|Omega|infty|approx|neq|leq|geq|times|div|pm|cdot|rightarrow|leftarrow|Rightarrow|Leftarrow|quad|qquad";
  const symbolAtom = `\\\\(?:${symbols})\\b`;

  // 组合所有可能的原子类型
  const latexAtom = `(?:${cmdAtomWithArgs}|${opAtom}|${symbolAtom})`;

  // 链式匹配正则 (保持不变，使用水平空白防止吃换行)
  const latexChainRegex = new RegExp(`(${latexAtom})(${H_SPACE}*${latexAtom})*`, "g");

  text = text.replace(latexChainRegex, (match) => {
    return wrapInline(match.trim());
  });

  // =========================================================
  // 还原
  // =========================================================
  text = text.replace(/__PROTECTED_(\d+)__/g, (_, i) => protectedBlocks[parseInt(i)]);

  return text;
};