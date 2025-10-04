## Most Influential Subset Selection (MISS)
### Challenges, Promises, and Beyond  
*Hu et al., NeurIPS 2024*

---
## 🧠 Motivation

- How do training samples affect ML model behavior?
- **Influence functions** quantify *individual* sample effects [Koh & Liang 2017].
- But real-world decisions often require understanding the **collective** influence of groups.

---
## 🎯 What is MISS?

> **Most Influential Subset Selection (MISS):**  
> Find the subset of training samples whose removal leads to the largest change in a model's behavior.

---
### Formal Definition
Given:
- Training set: $\{(x_i, y_i)\}_{i=1}^n$
- Target function: $\phi(\hat{\theta})$
- Goal: $\underset{S \subset [n], |S| \leq k}{\arg\max} \ A_{-S} = \phi(\hat{\theta}_{-S}) - \phi(\hat{\theta})$

---
For models trained by Empirical Risk Minimization (ERM):

$$
\theta_{\mathcal{D}} = \arg\min_\theta \sum_{(x_i, y_i) \in \mathcal{D}} \ell(x_i, y_i; \theta)
$$
Then, the influence of a single data point $z_i$ is: $\delta_i = \left\| \theta_{\mathcal{D}} - \theta_{\mathcal{D} \setminus \{z_i\}} \right\|$

---
## ⚙️ Influence-Based Greedy Heuristics
For differentiable models, we can approximate influence using:

$$
\hat{\delta}_i \approx \nabla_\theta \ell(z_{\text{test}}, \theta)^\top \cdot H_\theta^{-1} \cdot \nabla_\theta \ell(z_i, \theta)
$$

Where:
- $H_\theta$: Hessian of total training loss  
- $\nabla_\theta \ell(z_i, \theta)$: gradient for training point  
- $\nabla_\theta \ell(z_{\text{test}}, \theta)$: gradient for test point
---
✅ **Pros**:
- Fast, general.
- Works for differentiable objectives.

❌ **Cons**:
- Ignore leverage.
- Assumes additivity -> Fails to account for sample interactions.
---
## 🦾 What is Leverage?

**Leverage** measures how "extreme" a data point is in input space.

Extreme points may slightly change their prediction but massively impact on the model

---
In linear regression: $\hat{y} = X (X^\top X)^{-1} X^\top y$

Define the **hat matrix**: $H = X (X^\top X)^{-1} X^\top$

Then the **leverage score** of point $i$ is: $h_i = H_{ii}$
- $h_i \in [0, 1]$  
- High $h_i$ means point $i$ is far from the average feature vector  
- Leverage is purely based on the input data $X$

---
## 🛑 Inaccurate Influence (Even in Linear Models)
- Influence estimates (no leverage): $r_i = \left\| \hat{y}_i - y_i \right\|$ doesn't consider second order approximation: $v_i = \frac{r_i}{1-h_{ii}}$
- Points that skew the model a lot are not considered if they have a low influence
---
## ➕ Non-Additive Group Effects
Second order interactions cannot be ignored:
$$
\frac{(1 - h_{ii})(1 - h_{jj})(A_{\setminus \{i\}} + A_{\setminus \{j\}}) + h_{ij} x_{\text{test}}^\top N^{-1} (x_i r_j + x_j r_i)}{(1 - h_{ii})(1 - h_{jj}) - h_{ij}^2}

$$
- **Amplification**: Cluster of low-influence samples have large joint effect.
- **Cancellation**: Two influential points may cancel each other.

---
## ➡ Implications

Ranking **top k** samples by influence assumes **additivity**.

We assume that if on dataset $S$ points $z_i, z_j$ are the most influent $\implies$ point $z_j$ is the most influent of $S_{-z_i}$

This means that **ranking the points** cannot be done, or at least is a large approximation.

---
## 💡 Adaptive Greedy Algorithm

### Iterative Heuristic (Kuschnig et al., 2021)
1. At each step:
   - Find highest influence (with leverage) point and remove it
   - Repeat with new dataset

✅ Captures **interactions**  
✅ Handles **cancellation** and **amplification**

---

## 🧪 Experiments
Datasets:
- **Linear regression**: Concrete (UCI)
- **Classification**: Waveform (logistic), MNIST (MLP)
Metrics:
- **Average actual effect** $A_{-S}$
- **Winning rate** (% of test points where algorithm wins)
---
![[Pasted image 20250514173022.png| 1200]]
🟠 and 🟣 represent **adaptive greedy**
🔵 and 🟡 represent **static greedy**

---

## ⚖️ Trade-offs and Open Questions

- **Efficiency vs. Performance**: Adaptive methods are slower (repeat at each step).
- **Non-submodularity**: Actual effect is **not submodular**, limiting approximation guarantees.
- **Target-dependent behavior**: Performance varies with the choice of $\phi$.

---

