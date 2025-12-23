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



The distance modulus formula is \(m - M = 5 \lg(d/\text{pc}) - 5\), where \(m\) is the apparent magnitude, \(M\) is the absolute magnitude, and \(d\) is the distance in parsecs. The logarithm used is base 10, denoted as \(\lg\).

For the first star:  
- Apparent magnitude, \(m_1 = 6.0\)  
- Distance, \(d_1 = 10\) pc  
- Absolute magnitude, \(M_1\) is to be determined.  

Using the distance modulus formula:  
\[m_1 - M_1 = 5 \lg(d_1/\text{pc}) - 5\]  
Substitute the known values:  
\[6.0 - M_1 = 5 \lg(10) - 5\]  
Since \(\lg(10) = 1\):  
\[6.0 - M_1 = 5 \times 1 - 5\]  
\[6.0 - M_1 = 0\]  
Thus, \(M_1 = 6.0\).  

The absolute magnitude of the first star is \(M_1 = 6.0\).  

For the second star:  
- Absolute magnitude, \(M_2 = M_1 = 6.0\) (same as the first star)  
- Distance, \(d_2 = 100\) pc  
- Apparent magnitude, \(m_2\), is to be found.  

Using the distance modulus formula:  
\[m_2 - M_2 = 5 \lg(d_2/\text{pc}) - 5\]  
Substitute the known values:  
\[m_2 - 6.0 = 5 \lg(100) - 5\]  
Since \(\lg(100) = \lg(10^2) = 2 \times \lg(10) = 2 \times 1 = 2\):  
\[m_2 - 6.0 = 5 \times 2 - 5\]  
\[m_2 - 6.0 = 10 - 5\]  
\[m_2 - 6.0 = 5\]  
Thus, \(m_2 = 6.0 + 5 = 11.0\). 

The apparent magnitude of the second star is 11.0.

\boxed{11.0}


The absolute magnitudes are given as \(M_A = 1.0\) and \(M_B = 6.0\). The luminosity ratio \(L_A / L_B\) can be found using the magnitude difference and the given hint.

The magnitude difference is:
\[
\Delta m = M_B - M_A = 6.0 - 1.0 = 5.0
\]

The hint states that a difference of 5 magnitudes corresponds to a luminosity ratio of 100, meaning:
\[
100 = 10^{0.4 \Delta m}
\]
For \(\Delta m = 5\):
\[
10^{0.4 \times 5} = 10^2 = 100
\]
Thus, the luminosity ratio is:
\[
\frac{L_A}{L_B} = 10^{0.4 \Delta m}
\]
Substituting \(\Delta m = 5\):
\[
\frac{L_A}{L_B} = 10^{0.4 \times 5} = 10^2 = 100
\]

Alternatively, using the formula from the hint:
\[
m_2 - m_1 = -2.5 \lg\left(\frac{L_2}{L_1}\right)
\]
Set \(m_1 = M_A = 1.0\), \(m_2 = M_B = 6.0\), and \(L_2 / L_1 = L_B / L_A\):
\[
6.0 - 1.0 = -2.5 \lg\left(\frac{L_B}{L_A}\right)
\]
\[
5.0 = -2.5 \lg\left(\frac{L_B}{L_A}\right)
\]
Solving for \(\lg\left(\frac{L_B}{L_A}\right)\):
\[
\lg\left(\frac{L_B}{L_A}\right) = \frac{5.0}{-2.5} = -2.0
\]
Then:
\[
\frac{L_B}{L_A} = 10^{-2.0} = 0.01
\]
Thus:
\[
\frac{L_A}{L_B} = \frac{1}{0.01} = 100
\]

Both methods confirm that the luminosity ratio \(L_A / L_B = 100\).

\boxed{100}

The Stefan-Boltzmann law states that the luminosity \(L\) of a star is given by \(L = 4\pi R^2 \sigma T^4\), where \(R\) is the radius, \(T\) is the surface temperature, and \(\sigma\) is the Stefan-Boltzmann constant.

For the star and the Sun, the luminosities and temperatures are given relative to the Sun. Let \(L_\odot\) and \(T_\odot\) be the luminosity and surface temperature of the Sun, respectively. The star has \(L_* = 100 L_\odot\) and \(T_* = 2 T_\odot\).

The ratio of the luminosities is:
\[
\frac{L_*}{L_\odot} = \frac{4\pi R_*^2 \sigma T_*^4}{4\pi R_\odot^2 \sigma T_\odot^4} = \left( \frac{R_*}{R_\odot} \right)^2 \left( \frac{T_*}{T_\odot} \right)^4
\]

Substitute the given values:
\[
100 = \left( \frac{R_*}{R_\odot} \right)^2 \left( 2 \right)^4 = \left( \frac{R_*}{R_\odot} \right)^2 \cdot 16
\]

Solve for the radius ratio:
\[
\left( \frac{R_*}{R_\odot} \right)^2 = \frac{100}{16} = \frac{25}{4}
\]

Take the square root of both sides:
\[
\frac{R_*}{R_\odot} = \sqrt{\frac{25}{4}} = \frac{5}{2}
\]

Thus, the ratio of the radius of the star to the Sun's radius is \(\frac{5}{2}\).

\boxed{\dfrac{5}{2}}


Alright, let’s go step by step.  

---

**Step 1: Understand the problem**  
The Sun’s total mass: \( M_{\text{total}} = 2 \times 10^{30} \, \text{kg} \)  
Only **10%** of this mass is converted to energy via fusion over the Sun’s lifetime.  
Mass-energy conversion efficiency: **0.7%** of that 10% mass is actually converted to energy.  
Sun’s lifetime: \( T = 10 \, \text{billion years} = 10 \times 10^9 \, \text{years} \)  
We use \( E = mc^2 \) to find total energy produced, then divide by time to get luminosity.

---

**Step 2: Mass converted to energy**  
Mass available for fusion:  
\[
M_{\text{available}} = 0.10 \times M_{\text{total}} = 0.10 \times 2 \times 10^{30} = 2 \times 10^{29} \, \text{kg}
\]  
Efficiency \( \eta = 0.007 \) (0.7% of that mass is converted to energy).  
Mass actually converted:  
\[
M_{\text{converted}} = \eta \times M_{\text{available}} = 0.007 \times 2 \times 10^{29} = 1.4 \times 10^{27} \, \text{kg}
\]

---

**Step 3: Total energy produced over Sun’s lifetime**  
\[
E_{\text{total}} = M_{\text{converted}} \times c^2
\]  
\[
c = 3 \times 10^8 \, \text{m/s}
\]  
\[
c^2 = 9 \times 10^{16} \, \text{m}^2/\text{s}^2
\]  
\[
E_{\text{total}} = (1.4 \times 10^{27}) \times (9 \times 10^{16}) = 1.26 \times 10^{44} \, \text{J}
\]

---

**Step 4: Sun’s lifetime in seconds**  
\[
T = 10 \times 10^9 \, \text{years} = 10^{10} \, \text{years}
\]  
Seconds per year: \( 365.25 \times 24 \times 3600 \approx 3.15576 \times 10^7 \, \text{s} \)  
\[
T = 10^{10} \times 3.15576 \times 10^7 \approx 3.15576 \times 10^{17} \, \text{s}
\]

---

**Step 5: Luminosity**  
\[
L = \frac{E_{\text{total}}}{T} = \frac{1.26 \times 10^{44}}{3.15576 \times 10^{17}}
\]  
\[
L \approx 3.99 \times 10^{26} \, \text{W}
\]

---

**Step 6: Compare with actual solar luminosity**  
Actual solar luminosity is about \( 3.828 \times 10^{26} \, \text{W} \), so our calculation is close, which makes sense given the approximations.

---

ANSWER: \( 3.99 \times 10^{26} \, \text{W} \)

Alright, let’s go step-by-step.  

---

**Step 1: Understand the given data**  
Absolute magnitude \( M \) is related to luminosity \( L \) by:  

\[
M_2 - M_1 = -2.5 \log_{10}\left( \frac{L_2}{L_1} \right)
\]  

Here:  
Star A: \( M_A = 1.0 \)  
Star B: \( M_B = 6.0 \)  

---

**Step 2: Compute magnitude difference**  
\[
M_B - M_A = 6.0 - 1.0 = 5.0
\]  

---

**Step 3: Apply the formula**  
\[
5.0 = -2.5 \log_{10}\left( \frac{L_B}{L_A} \right)
\]  

---

**Step 4: Solve for \( L_B / L_A \)**  
Divide both sides by \(-2.5\):  
\[
\log_{10}\left( \frac{L_B}{L_A} \right) = \frac{5.0}{-2.5} = -2
\]  

So:  
\[
\frac{L_B}{L_A} = 10^{-2} = 0.01
\]  

---

**Step 5: Interpret**  
\( L_B / L_A = 0.01 \) means \( L_A \) is 100 times more luminous than \( L_B \).  

Thus:  
\[
\frac{L_A}{L_B} = \frac{1}{0.01} = 100
\]  

---

**Step 6: Check with the hint**  
Hint says: difference of 5 magnitudes → luminosity ratio of 100.  
Since \( M_B \) is fainter (larger magnitude), \( L_A / L_B = 100 \) indeed.  

---

ANSWER: 100


Alright, let’s go step by step.  

**Step 1: Understand the given information**  
First star:  
- Apparent magnitude \( m_1 = 6.0 \)  
- Distance \( d_1 = 10 \ \text{pc} \)  
- Absolute magnitude \( M_1 = M \) (unknown)  

Second star:  
- Absolute magnitude \( M_2 = M_1 = M \) (same as first star)  
- Distance \( d_2 = 100 \ \text{pc} \)  
- Apparent magnitude \( m_2 = ? \)  

**Step 2: Find \( M \) from the first star using distance modulus formula**  
The formula is:  
\[
m - M = 5\log_{10}(d/\text{pc}) - 5
\]  
For the first star:  
\[
6.0 - M = 5\log_{10}(10) - 5
\]  
\[
6.0 - M = 5 \times 1 - 5
\]  
\[
6.0 - M = 0
\]  
\[
M = 6.0
\]  

**Step 3: Apply the same \( M \) to the second star**  
For the second star:  
\[
m_2 - M = 5\log_{10}(100) - 5
\]  
\[
m_2 - 6.0 = 5 \times 2 - 5
\]  
\[
m_2 - 6.0 = 10 - 5
\]  
\[
m_2 - 6.0 = 5
\]  
\[
m_2 = 11.0
\]  

**Step 4: Interpret the result**  
The second star is farther away (100 pc vs. 10 pc), so it appears fainter.  
The magnitude difference is \( 5 \log_{10}(100/10) = 5 \) magnitudes, so \( m_2 = 6.0 + 5 = 11.0 \), matching our calculation.  

ANSWER: 11.0


The spectral energy density per unit wavelength for a blackbody is given by:

\[ u_\lambda = \frac{8\pi h c}{\lambda^5} \frac{1}{e^{h c / (\lambda k T)} - 1} \]

To find the maximum value of \( u_\lambda \) with respect to wavelength \( \lambda \), introduce the substitution \( y = \frac{h c}{\lambda k T} \). Then:

\[ u_\lambda = \frac{8\pi (kT)^5}{h^4 c^4} \frac{y^5}{e^y - 1} \]

The function \( h(y) = \frac{y^5}{e^y - 1} \) has a maximum at a specific value of \( y \), denoted \( y_{\text{max}} \), which is a constant determined by solving \( \frac{d}{dy} \left( \frac{y^5}{e^y - 1} \right) = 0 \). This equation simplifies to \( (5 - y) e^y = 5 \), which has a numerical solution \( y_{\text{max}} \approx 4.965 \), but the key point is that \( y_{\text{max}} \) is independent of temperature \( T \).

Thus, at the maximum:

\[ u_\lambda^{\text{max}} = \frac{8\pi (kT)^5}{h^4 c^4} h(y_{\text{max}}) \]

Since \( h(y_{\text{max}}) \) is a constant, it follows that:

\[ u_\lambda^{\text{max}} \propto (kT)^5 \propto T^5 \]

Therefore, the maximum value of the spectral energy density per unit wavelength is proportional to the fifth power of the equilibrium temperature \( T \).

\boxed{u_{\lambda,\text{max}} \propto T^{5}}


\boxed{Cc1c(C(=O)C2CCCCC2)oc2ccc(N3CCSCC3)cc12}