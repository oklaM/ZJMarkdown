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