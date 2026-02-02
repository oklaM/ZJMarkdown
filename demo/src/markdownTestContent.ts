export const markdownTestContent: any = `---

# 📘 全面 Markdown 测试文档

> 用于测试解析器对各种 Markdown 语法的支持程度与容错能力。

---

## 一、基础元素

### 1. 标题（Headers）

\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
\`\`\`

渲染效果：

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

> 注意：超过六级的 \`#######\` 不应被识别为标题。

---

### 2. 段落与换行

普通段落由一行或多行文本组成，段落之间需空一行。

这是第一段。  
这是同一段内的强制换行（行尾两个空格）。

这是第二段。

---

### 3. 强调（Emphasis）

\`\`\`markdown
*斜体* 或 _斜体_  
**粗体** 或 __粗体__  
***粗斜体*** 或 ___粗斜体___  
~~删除线~~（GFM 扩展）
\`\`\`

渲染效果：

*斜体* 或 _斜体_  
**粗体** 或 __粗体__  
***粗斜体*** 或 ___粗斜体___  
~~删除线~~

嵌套测试：**粗体包含 *斜体* 和 ~~删除线~~**

---

### 4. 列表

#### 无序列表

\`\`\`markdown
- 项目一
- 项目二
  - 子项目 A
    - 子子项目 α
  - 子项目 B
- 项目三
\`\`\`

渲染效果：

- 项目一
- 项目二
  - 子项目 A
    - 子子项目 α
  - 子项目 B
- 项目三

#### 有序列表

\`\`\`markdown
1. 第一项
2. 第二项
   1. 子项（注意：数字可任意，但建议连续）
   8. 另一个子项（实际仍显示为 2.）
3. 第三项
\`\`\`

渲染效果：

1. 第一项
2. 第二项
   1. 子项（注意：数字可任意，但建议连续）
   8. 另一个子项（实际仍显示为 2.）
3. 第三项

#### 混合列表（任务列表 - GFM）

\`\`\`markdown
- [x] 完成任务
- [ ] 未完成任务
  - [x] 子任务完成
\`\`\`

渲染效果：

- [x] 完成任务
- [ ] 未完成任务
  - [x] 子任务完成

---

### 5. 引用（Blockquotes）

\`\`\`markdown
> 这是一级引用。
>
> > 这是嵌套引用。
>
> 回到一级。
\`\`\`

渲染效果：

> 这是一级引用。
>
> > 这是嵌套引用。
>
> 回到一级。

带其他元素的引用：

> - 列表在引用中
> 1. 有序列表
> **粗体文字**

---

### 6. 代码

#### 行内代码

使用反引号：\`console.log("Hello")\` 是行内代码。

#### 代码块（围栏式）

\`\`\`\`markdown
\`\`\`javascript
function greet() {
  console.log("Hello, world!");
}
\`\`\`
\`\`\`\`

渲染效果：

\`\`\`javascript
function greet() {
  console.log("Hello, world!");
}
\`\`\`

支持无语言标识：

\`\`\`
这是一个无语言的代码块。
\`\`\`

也支持缩进式代码块（四个空格或一个制表符）：

\`\`\`
    这是缩进式代码块。
    第二行。
\`\`\`

> ⚠️ 注意：围栏式优先于缩进式。

---

### 7. 分隔线（Horizontal Rule）

以下任一形式应生成分隔线：

\`\`\`markdown
---
***
___
- - -
* * *
_ _ _
\`\`\`

渲染效果：

---

***

___

- - -

* * *

_ _ _

---

### 8. 链接与图片

#### 链接

\`\`\`markdown
[阿里巴巴](https://www.alibaba.com)
[带 title 的链接](https://www.aliyun.com "阿里云")
<https://www.taobao.com>（自动链接）
[相对路径](./about.md)
[引用式链接][ref]

[ref]: https://www.dingtalk.com
\`\`\`

渲染效果：

[阿里巴巴](https://www.alibaba.com)  
[带 title 的链接](https://www.aliyun.com "阿里云")  
<https://www.taobao.com>  
[相对路径](./about.md)  
[引用式链接][ref]

[ref]: https://www.dingtalk.com

#### 图片

\`\`\`markdown
![替代文本](https://example.com/image.png "可选标题")
![本地图](./logo.png)
![引用式图片][img]

[img]: /path/to/image.jpg
\`\`\`

渲染效果：

![替代文本](https://example.com/image.png "可选标题")
![本地图](./logo.png)
![引用式图片][img]

[img]: /path/to/image.jpg

> 注：此处不实际加载图片，仅测试语法。

---

### 9. 表格（GFM）

\`\`\`markdown
| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| A      | B    | C      |
| 100    | 200  | 300    |
| \`code\` | **bold** | *italic* |
\`\`\`

渲染效果：

| 左对齐 | 居中 | 右对齐 |
|:-------|:----:|-------:|
| A      | B    | C      |
| 100    | 200  | 300    |
| \`code\` | **bold** | *italic* |

> 表头必须存在，对齐标记可省略。

---

### 10. 转义字符

\`\`\`markdown
\\*这不是斜体\\*  
\\# 不是标题
\`\`\`

渲染效果：

\\*这不是斜体\\*  
\\# 不是标题

特殊字符转义：  
反斜杠 \\、反引号 \`、星号 \\*、下划线 \\_、花括号 \\{\\}、方括号 \\[\\]、尖括号 \\<\\>、圆括号 \\(\\)、井号 \\#、加号 \\+、减号 \\-、点 \\.、感叹号 \\!、竖线 \\|、波浪线 \\~

---

### 11. HTML 混合（CommonMark 允许）

\`\`\`html
<p>这是原始 HTML 段落。</p>

<div>
  <h3>HTML 中的标题</h3>
  <ul>
    <li>列表项</li>
  </ul>
</div>
\`\`\`

渲染效果：

<p>这是原始 HTML 段落。</p>

<div>
  <h3>HTML 中的标题</h3>
  <ul>
    <li>列表项</li>
  </ul>
</div>

> 大多数 Markdown 解析器会原样保留块级 HTML（除非特别配置过滤）。

---

### 12. 脚注（部分解析器支持，如 Pandoc）

\`\`\`markdown
这是一个脚注示例[^1]。

[^1]: 这是脚注内容，可以跨多行，
      也可以包含 *格式* 和 [链接](https://example.com)。
\`\`\`

渲染效果：

这是一个脚注示例[^1]。

[^1]: 这是脚注内容，可以跨多行，
      也可以包含 *格式* 和 [链接](https://example.com)。

> 注：CommonMark 不支持脚注，但许多扩展支持。

---

### 13. KaTeX 数学公式（非标准，但广泛使用）

#### 1. 行内公式（Inline Math）

- 勾股定理：$a^2 + b^2 = c^2$
- 二次方程求根公式：$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
- 欧拉公式：$e^{i\\pi} + 1 = 0$
- 向量：$\\vec{v} = \\langle x, y, z \\rangle$
- 集合：$A \\subseteq B \\iff \\forall x (x \\in A \\Rightarrow x \\in B)$
- 极限：$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$
- 积分（行内）：$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$

---

#### 2. 块级公式（Display Math）

使用双美元符 \`$$...$$\` 或 \`\\[...\\]\`：

\`\`\`markdown
$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$

\\[
\\mathbf{F} = m\\mathbf{a} = m\\frac{d^2\\mathbf{r}}{dt^2}
\\]
\`\`\`

渲染效果：

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$

\\[
\\mathbf{F} = m\\mathbf{a} = m\\frac{d^2\\mathbf{r}}{dt^2}
\\]

---

#### 3. 多行公式与对齐（使用 \`aligned\` 环境）

\`\`\`latex
$$
\\begin{aligned}
f(x) &= (x + 1)^2 \\
     &= x^2 + 2x + 1 \\
     &= (x - (-1))^2
\\end{aligned}
$$
\`\`\`

渲染效果：

$$
\\begin{aligned}
f(x) &= (x + 1)^2 \\
     &= x^2 + 2x + 1 \\
     &= (x - (-1))^2
\\end{aligned}
$$

> ✅ KaTeX 支持 \`aligned\`、\`gathered\`、\`cases\` 等 AMS 环境。

---

#### 4. 分段函数（\`cases\`）

\`\`\`latex
$$
f(n) =
\\begin{cases}
n/2 & \\text{if } n \\text{ is even} \\
3n+1 & \\text{if } n \\text{ is odd}
\\end{cases}
$$
\`\`\`

渲染效果：

$$
f(n) =
\\begin{cases}
n/2 & \\text{if } n \\text{ is even} \\
3n+1 & \\text{if } n \\text{ is odd}
\\end{cases}
$$

---

#### 5. 矩阵（Matrix）

\`\`\`latex
$$
\\begin{bmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{bmatrix}
\\quad
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\quad
\\begin{Bmatrix}
x \\\\ y
\\end{Bmatrix}
$$
\`\`\`

渲染效果：

$$
\\begin{bmatrix}
1 & 2 & 3 \\\\
4 & 5 & 6 \\\\
7 & 8 & 9
\\end{bmatrix}
\\quad
\\begin{pmatrix}
a & b \\\\
c & d
\\end{pmatrix}
\\quad
\\begin{Bmatrix}
x \\\\ y
\\end{Bmatrix}
$$

支持环境：\`matrix\`, \`pmatrix\`, \`bmatrix\`, \`Bmatrix\`, \`vmatrix\`, \`Vmatrix\`

---

#### 6. 希腊字母与特殊符号

\`\`\`markdown
$ \\alpha, \\beta, \\gamma, \\delta, \\epsilon, \\zeta, \\eta, \\theta $  
$ \\Gamma, \\Delta, \\Theta, \\Lambda, \\Xi, \\Pi, \\Sigma, \\Phi, \\Psi, \\Omega $  
$ \\mathbb{R}, \\mathbb{Z}, \\mathbb{N}, \\mathbb{C} $ （黑板粗体）  
$ \\mathcal{L}, \\mathcal{F}, \\mathscr{L} $ （花体 / 手写体）  
$ \\hbar, \\partial, \\nabla, \\infty, \\forall, \\exists, \\emptyset $
\`\`\`

渲染效果：

$ \\alpha, \\beta, \\gamma, \\delta, \\epsilon, \\zeta, \\eta, \\theta $  
$ \\Gamma, \\Delta, \\Theta, \\Lambda, \\Xi, \\Pi, \\Sigma, \\Phi, \\Psi, \\Omega $  
$ \\mathbb{R}, \\mathbb{Z}, \\mathbb{N}, \\mathbb{C} $  
$ \\mathcal{L}, \\mathcal{F}, \\mathscr{L} $  
$ \\hbar, \\partial, \\nabla, \\infty, \\forall, \\exists, \\emptyset $

> 🔸 注意：\`\\mathscr\` 需要加载 \`mathscr\` 扩展（KaTeX 默认启用）。

---

#### 7. 上标、下标、上下重叠

\`\`\`markdown
$ a_i^j $,  
$ \\overset{\\text{def}}{=} $,  
$ \\underset{x \\to 0}{\\lim} f(x) $,  
$ \\hat{y}, \\bar{x}, \\vec{v}, \\dot{x}, \\ddot{x} $
\`\`\`

渲染效果：

$ a_i^j $,  
$ \\overset{\\text{def}}{=} $,  
$ \\underset{x \\to 0}{\\lim} f(x) $,  
$ \\hat{y}, \\bar{x}, \\vec{v}, \\dot{x}, \\ddot{x} $

---

#### 8. 自定义颜色与样式（KaTeX 支持有限 CSS）

\`\`\`latex
$$
\\textcolor{red}{x^2} + \\textcolor{blue}{y^2} = \\textcolor{green}{r^2}
$$
\`\`\`

渲染效果：

$$
\\textcolor{red}{x^2} + \\textcolor{blue}{y^2} = \\textcolor{green}{r^2}
$$

> ✅ KaTeX 支持 \`\textcolor{color}{...}\` 和 \`\\color{color} ...\`（需启用 \`color\` 扩展，默认开启）。

---

#### 9. 错误与边界测试（应优雅降级或报错）

\`\`\`markdown
$ \\invalidcommand $
$$
\\begin{unknownenv}
x
\\end{unknownenv}
$$
$ missing end $
\`\`\`

渲染效果：

$ \\invalidcommand $
$$
\\begin{unknownenv}
x
\\end{unknownenv}
$$
$ missing end $

> 良好的 KaTeX 集成应显示错误提示（如红色框）而非崩溃。

---

#### 10. 与 Markdown 元素混合

- 列表中的公式：
  - 能量：$E = mc^2$
  - 动量：$\\vec{p} = m\\vec{v}$

- 表格中的公式：

| 公式 | 名称 |
|------|------|
| $ \\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_0} $ | 高斯定律 |
| $ \\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I $ | 安培环路定理 |

> ✅ 测试 KaTeX 是否在复杂上下文中仍能正确渲染。

---

## 二、🧪 乱模块（故意违规、边界、模糊情况）

> 本节用于测试解析器的**容错性**与**规范一致性**。所有内容均为**非标准或错误用法**。

---

### 1. 标题混乱

\`\`\`markdown
 # 前面有空格（不应是标题？但多数解析器仍识别）
##后面没空格（CommonMark 要求至少一个空格，但有些解析器宽松）
####### 七级标题（无效）
# 
## （空标题）
\`\`\`

渲染效果：

 # 前面有空格（不应是标题？但多数解析器仍识别）
##后面没空格（CommonMark 要求至少一个空格，但有些解析器宽松）
####### 七级标题（无效）
# 
## （空标题）

### 2. 强调嵌套冲突

\`\`\`markdown
**粗体 *斜体 ** 更多文字*
***混合_下划线__强调***
__不闭合的粗体
*单个星号
\`\`\`

渲染效果：

**粗体 *斜体 ** 更多文字*
***混合_下划线__强调***
__不闭合的粗体
*单个星号

### 3. 列表格式错乱

\`\`\`markdown
- 项目
  1. 错误混用
- [ ] 任务但前面有空格不对齐
  - [x]子项没空格
1. 有序
- 无序紧跟（无空行）
2. 继续有序？
\`\`\`

渲染效果：

- 项目
  1. 错误混用
- [ ] 任务但前面有空格不对齐
  - [x]子项没空格
1. 有序
- 无序紧跟（无空行）
2. 继续有序？

### 4. 引用与代码混合错误

\`\`\`markdown
> \`\`\`js
> console.log("引用中的代码块？")
这是不在引用中的文字但没空行
> 继续引用？
\`\`\`

渲染效果：

> \`\`\`js
> console.log("引用中的代码块？")
这是不在引用中的文字但没空行
> 继续引用？

### 5. 链接与图片语法错误

\`\`\`markdown
[坏链接(https://bad.com)
![坏图片 alt text](missing-quote.jpg
[ref without def]
![undefined ref][]
[empty]()

<unclosed<tag>
\`\`\`

渲染效果：

[坏链接(https://bad.com)
![坏图片 alt text](missing-quote.jpg
[ref without def]
![undefined ref][]
[empty]()

<unclosed<tag>

### 6. 表格错位

\`\`\`markdown
| A | B |
|---|
| 1 | 2 | 3 | 4 |
| too many cols
\`\`\`

渲染效果：

| A | B |
|---|
| 1 | 2 | 3 | 4 |
| too many cols

### 7. 代码块围栏错误

\`\`\`\`markdown
\`\`\`python
print("开始")
\`\` missing backticks
still code?
\`\`\`
\`\`\`\`

渲染效果：

\`\`\`python
print("开始")
\`\` missing backticks
still code?
\`\`\`

### 8. 转义滥用

\`\`\`markdown
\\*
\\#
\\\
\\\\*
\`\`\`

渲染效果：

\\*
\\#
\\\
\\\\*

### 9. HTML 与 Markdown 混淆

\`\`\`markdown
<div>*这会被解析为斜体吗？*</div>

<span>**粗体？**</span>

<p>
  - 列表在 HTML 中？
</p>
\`\`\`

渲染效果：

<div>*这会被解析为斜体吗？*</div>

<span>**粗体？**</span>

<p>
  - 列表在 HTML 中？
</p>

### 10. 特殊 Unicode 与控制字符

\`\`\`markdown
标题　（全角空格）
*斜体​*（零宽空格）
**粗体﻿**（零宽非断空格）
\`\`\`

渲染效果：

标题　（全角空格）
*斜体​*（零宽空格）
**粗体﻿**（零宽非断空格）

### 11. 无限嵌套尝试

\`\`\`markdown
> > > > > > > > > > 10层引用
\`\`\`

渲染效果：

> > > > > > > > > > 10层引用

### 12. 空元素堆叠

\`\`\`markdown



（多个空行）



\`\`\`

渲染效果：




（多个空行）




---

## 结语

此文档可用于：

- 测试 Markdown 解析器的**标准兼容性**
- 验证**错误恢复能力**
- 检查**安全过滤机制**（如 XSS 防护）
- 对比不同引擎（如 CommonMark、GitHub、Typora、Obsidian、Marked.js 等）的行为差异

> 提示：将此文件使用 Markdown 渲染器打开，观察各部分是否按预期显示。`