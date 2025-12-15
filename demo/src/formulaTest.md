# LaTeX 公式测试

## 用户提到的失败公式测试

1. 求和公式：$\sum_{n=1}^{\infty}$ $\frac{1}{n^2}$ = $\frac{\pi^2}{6}$

2. 向量公式：$\mathbf{F}$ = m$\mathbf{a}$ = m$\frac{d^2\mathbf{r}}{dt^2}$

3. 积分公式：$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$

## 其他公式测试

### 行内公式
- 基本行内公式：$E = mc^2$
- 带上下标的公式：$a_{ij} + b^k = c^{i}_{jk}$
- 复杂行内公式：$\sum_{k=1}^n k^2 = \frac{n(n+1)(2n+1)}{6}$

### 块级公式
$$
\textcolor{red}{x^2} + \textcolor{blue}{y^2} = \textcolor{green}{r^2}
$$

$$
\frac{d}{dx}\left(\int_{a}^{x} f(t) dt\right) = f(x)
$$

### 数学环境
$$
\begin{align}
x + y &= 5 \\
2x - y &= 1
\end{align}
$$

$$
\begin{matrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{matrix}
$$

### 旧式语法
\[x^2 + y^2 = r^2\]

\((a + b)^2 = a^2 + 2ab + b^2\)

$$
\begin{align}
x + y &= 5 \\
2x - y &= 1
\end{align}
$$

#### test

The given system of equations is:

\[
\begin{align}
x + y &= 5 \quad \text{(1)} \\
2x - y &= 1 \quad \text{(2)}
\end{align}
\]

To solve for \(x\) and \(y\), add equations (1) and (2) to eliminate \(y\):

\[
(x + y) + (2x - y) = 5 + 1
\]

Simplify:

\[
3x = 6
\]

Solve for \(x\):

\[
x = 2
\]

Substitute \(x = 2\) into equation (1) to solve for \(y\):

\[
2 + y = 5
\]

\[
y = 3
\]

Verify the solution by substituting \(x = 2\) and \(y = 3\) into equation (2):

\[
2(2) - 3 = 4 - 3 = 1
\]

The solution satisfies both equations. Thus, the solution is \(x = 2\) and \(y = 3\).

\[
\boxed{(2,\ 3)}
\]



#### test 

The conditional convex hull \(M_p(X|\mathcal{H})\) of a random set \(X\) in a separable Banach space, given the sub-sigma-algebra \(\mathcal{H}\), is defined as the smallest \(\mathcal{H}\)-measurable random convex closed set containing \(X\). Its support function is given by the conditional essential supremum of the support function of \(X\):

\[
h_{M_p(X|\mathcal{H})}(\zeta) = \text{ess sup}_{\mathcal{H}} h_X(\zeta), \quad \zeta \in L^0(\mathcal{X}^*, \mathcal{H}),
\]

where \(h_X(\zeta) = \sup\{ \langle x, \zeta \rangle \mid x \in X \}\) is the support function of \(X\), and \(\text{ess sup}_{\mathcal{H}}\) denotes the conditional essential supremum with respect to \(\mathcal{H}\). This characterization arises because the epigraph of the support function of a random convex closed set is a random closed set in \(\mathcal{X}^* \times \mathbb{R}\), and applying the conditional core operation to this epigraph yields the epigraph of the support function of the conditional convex hull. The proof relies on measurable selection arguments and properties of infinite decomposability.

A key duality exists between the conditional core and the conditional convex hull, assuming \(X\) contains at least one \(\mathcal{H}\)-measurable selection. Specifically, if \(\gamma \in S_0(X, \mathcal{H})\) (the set of \(\mathcal{H}\)-measurable selections from \(X\)), then:

\[
M_p(X - \gamma | \mathcal{H}) = (m((X - \gamma)^{\circ} | \mathcal{H}))^{\circ},
\]

where \(X^{\circ} = \{ u \in \mathcal{X}^* \mid h_X(u) \leq 1 \}\) denotes the polar set of \(X\). This duality reflects the general principle that the polar of the conditional core of the polar set equals the conditional convex hull. Similar dualities hold for epigraphs:

\[
M(\text{epi } h_X | \mathcal{H}) = \text{epi } h_{m(X|\mathcal{H})}, \quad m(\text{epi } h_X | \mathcal{H}) = \text{epi } h_{M(X|\mathcal{H})}.
\]

These relationships highlight the complementary roles of the conditional core and convex hull in the theory of random sets, analogous to the interplay between infimum and supremum in classical analysis.

\boxed{M_p(X|\mathcal{H})} \text{ is the smallest } \mathcal{H}\text{-measurable random convex closed set containing } X\text{, with support function } \text{ess sup}_{\mathcal{H}} h_X(\zeta). \text{ Under the assumption that } X \text{ has an } \mathcal{H}\text{-measurable selection, it satisfies } M_p(X - \gamma | \mathcal{H}) = (m((X - \gamma)^{\circ} | \mathcal{H}))^{\circ}\text{ for } \gamma \in S_0(X, \mathcal{H}).}

### 错误的证明

The provided proof that the mass ratio \( \frac{m_1}{m_2} = \frac{r_2}{r_1} \) is incorrect due to a misunderstanding of the center of mass condition and the forces in a binary system. Below is a corrected derivation that properly handles the center of mass and gravitational and centripetal forces.

### Corrected Proof:
Consider a binary system where two stars, \( m_1 \) and \( m_2 \), orbit around their common center of mass. Let \( r_1 \) and \( r_2 \) be the distances from the center of mass to \( m_1 \) and \( m_2 \), respectively, and let \( d \) be the separation between the stars (\( d = r_1 + r_2 \)).

1. **Center of Mass Condition**:  
   The center of mass is the point where the system balances. For equilibrium, the gravitational forces must balance the centripetal forces, but the center of mass condition arises from the requirement that the net force on the system is zero. Thus:
   \[
   m_1 r_1 = m_2 r_2
   \]
   Rearranged, this gives:
   \[
   \frac{m_1}{m_2} = \frac{r_2}{r_1}
   \]
   This is a general result for any two-body system and does not assume circular motion or equal masses.

2. **Gravitational and Centripetal Forces**:  
   The gravitational force between the stars provides the centripetal force for their circular motion around the center of mass. The gravitational force is:
   \[
   F_g = \frac{G m_1 m_2}{d^2}
   \]
   For star 1, the centripetal force is:
   \[
   F_{c1} = m_1 \omega^2 r_1
   \]
   For star 2, the centripetal force is:
   \[
   F_{c2} = m_2 \omega^2 r_2
   \]
   where \( \omega \) is the orbital angular velocity.

3. **Equating Forces**:  
   Since the gravitational force provides the centripetal force for both stars, and considering the center of mass frame:
   \[
   F_g = F_{c1} + F_{c2}
   \]
   Substituting the expressions:
   \[
   \frac{G m_1 m_2}{d^2} = m_1 \omega^2 r_1 + m_2 \omega^2 r_2
   \]
   From the center of mass condition (\( m_1 r_1 = m_2 r_2 \)), we can write:
   \[
   m_1 \omega^2 r_1 = m_2 \omega^2 r_2
   \]
   Therefore:
   \[
   F_g = 2 m_2 \omega^2 r_2
   \]
   But also:
   \[
   F_g = \frac{G m_1 m_2}{d^2}
   \]
   Equating these:
   \[
   \frac{G m_1 m_2}{d^2} = 2 m_2 \omega^2 r_2
   \]
   Dividing both sides by \( m_2 \) (assuming \( m_2 \neq 0 \)):
   \[
   \frac{G m_1}{d^2} = 2 \omega^2 r_2
   \]
   This equation relates the masses, separation, and orbital parameters but does not directly give the mass ratio. However, from the center of mass condition alone:
   \[
   \frac{m_1}{m_2} = \frac{r_2}{r_1}
   \]
   is consistent and correct.

4. **Why the Original Proof Was Incorrect**:  
   The original proof incorrectly assumed that the centripetal forces are equal, which is not true for a binary system with different masses. Specifically:
   - The centripetal force for star 1 is \( m_1 \omega^2 r_1 \).
   - The centripetal force for star 2 is \( m_2 \omega^2 r_2 \).
   - These forces are equal only if \( m_1 r_1 = m_2 r_2 \), which is the center of mass condition, not a force equality. The gravitational force is equal to the sum of the centripetal forces for both stars, not individually to each.

### Conclusion:
The correct mass ratio is \( \frac{m_1}{m_2} = \frac{r_2}{r_1} \), derived directly from the center of mass condition. The gravitational force provides the centripetal force for the system, but the ratio of the masses is determined solely by the distances from the center of mass. This holds for any binary system, regardless of orbital shape, as long as the center of mass is defined. The centripetal force equation confirms the center of mass condition but does not alter it.


这是一个非常全面的 Markdown 测试用例。它覆盖了你的代码中所有的正则逻辑路径，包括预处理、保护机制、环境处理、特定命令转化以及最后的单美元符号兜底。


# LaTeX 公式转换全量测试

## 1. 基础括号预处理 (Preprocess)
这里测试 `\[` and `\(` 的转换：
块级公式：\[ E = mc^2 \]
行内公式：\( a^2 + b^2 = c^2 \)

## 2. 块级环境 (Environments)
这里测试 align, gather, matrix 是否被正确包裹在 `$$` 中：

Align 环境：
\begin{align}
a &= b + c \\
  &= d + e
\end{align}

Gather 环境：
\begin{gather}
a = b \\
c = d
\end{gather}

Matrix 环境 (重点测试：是否补全了 begin/end)：
\begin{matrix}
1 & 0 \\
0 & 1
\end{matrix}

## 3. Boxed 处理 (支持嵌套)
普通 Boxed：\boxed{F=ma}
嵌套 Boxed：\boxed{\frac{1}{2}}

## 4. 化学公式 (\ce)
水分子：\ce{H2O}
复杂反应：\ce{SO4^2- + Ba^2+ -> BaSO4 v}

## 5. 字体与文本命令
Mathbb: \mathbb{R}
Mathcal: \mathcal{L}
Mathbf: \mathbf{v}
Mathit: \mathit{x}
Mathrm: \mathrm{d}x
Text: \text{Check constraint}

## 6. 数学结构与运算
分数：\frac{a}{b}
开平方：\sqrt{x}
开多次方：\sqrt[3]{y}
求和：\sum_{i=1}^{n}^{n}
乘积：\prod_{i=1}^{n}^{n}
积分：\int_{0}^{\infty}^{100}
极限：\lim_{x \rightarrow 0}

## 7. 符号与间距
箭头测试：\rightarrow \leftarrow \Rightarrow \Leftarrow
间距测试：x \quad y \qquad z

## 8. 单美元符号兜底 (Single Dollar)
这是一段包含单美元符号的文本：$a=b$ 以及 $x+y=z$。
(注意：根据你的逻辑，这些会被转化为 $$...$$ 格式)

## 9. 保护机制测试 (Protection)
**以下内容不应该被改变：**

代码块中的 LaTeX：
```latex
\begin{align}
  Raw Code
\end{align}
````

行内代码中的 LaTeX：`\frac{1}{2}`

原本已经是双美元的公式：

$$
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

原本已经是单美元的公式（如果有被正则保护捕获）：
$ e^{i\\pi} + 1 = 0 $

