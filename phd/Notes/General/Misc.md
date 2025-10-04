## 🔁 Softmax Function
The softmax function converts a vector of logits (real values) into a probability distribution:
$$
\text{softmax}(x_i) = \frac{e^{x_i}}{\sum_{j=0}^{C-1} e^{x_j}}
$$
This ensures:
$$
\sum_i \text{softmax}(x_i) = 1
$$
Which produces a probability vector:
$$
\mathbf{p} = [p_0, p_1, \dots, p_{C-1}]
$$

## 🧮 Logits — Notes

### ❓ _What is a logit?_

- A **logit** is the raw output of a model before applying a probability transformation like **softmax** (for multi-class) or **sigmoid** (for binary).
- Logits are **real-valued** and **unbounded** — they are not probabilities.
- They represent a model’s **relative confidence**, not a calibrated score.

---

### ❓ _Do logits need to sum to 1?_

- **No.** Logits do not and should not sum to 1.
- It is the **softmax** transformation that converts logits into a probability distribution summing to 1.

---

### ❓ _How do I turn logits into meaningful scores?_

- Apply **softmax** to get probabilities.
- Use **log-softmax** if you're interested in log-probabilities (e.g. for loss computation).
- To compare or rank logits without computing probabilities, you can use:
    - Relative **margins**: `max - logits[true_class]`
    - **Negative log-softmax**: gives a calibrated penalty for low confidence.

---

## 📉 Cross-Entropy Loss — Notes

You have:
- A vector of **logits**$x=[x_0,x1_,…,x,C−1]$(raw model outputs, one per class)
- A **true class** label$y∈{0,1,…,C−1}$
- The formula is
$$CE(x,y)=−x_y+log⁡(∑_j e^{x_j})$$

---
### ❓ _Do I need probabilities for cross-entropy?_

- **No.** Cross-entropy expects **logits**, not softmax outputs.
- It internally uses the **log-sum-exp trick** for numerical stability.

---
### ❓ _Does the true class logit really matter?_

- **Yes, critically.**
- The loss **decreases** as xy increases relative to other logits.
- The model is optimized to **maximize** the logit for the true class while **minimizing** others.

---
### ❓ _How do I achieve perfect (zero) loss?_
- Set$x_y→∞$and all other$logits →−∞$
- This makes softmax(x)y=1, so:$CE=−log⁡(1)=0$

---

### 🧮 Cross-Entropy relation to Softmax

Starting from$\text{softmax}(x_i) = \frac{e^{x_i}}{\sum_{j=0}^{C-1} e^{x_j}}$, if we use$-\log$on it we get
$$-\log(\text{softmax}(x_i)) = -\log(\frac{e^{x_i}}{\sum_{j=0}^{C-1} e^{x_j}}) = −x_y+log⁡(∑_j e^{x_j}) = CE(x,y)$$

### ✅ Summary
- **Softmax** normalizes logits into probabilities.
- **Cross-entropy** computes the negative log-likelihood of the true class.
- **Direct logit-based CE** avoids computing probabilities explicitly.

# 🧠 Energy-Based Models (EBMs)

Energy-Based Models (EBMs) define a scalar energy function$E(x, y) \in \mathbb{R}$over input–output pairs. The model's goal is to assign **low energy to valid outputs** and **high energy to invalid ones**

---

## 🔋 Core Concepts

- **Energy Function**:$E(x, y)$measures how "bad" or "unpreferred" a candidate output$y$is for input$x$.
- **No direct prediction** of probabilities like in softmax or cross-entropy models.
- **Inference** is about finding $\arg\min_y E(x, y)$.

---

## 🧮 Training Objectives

### 1. **Contrastive Loss** (Margin-based):

$$
\mathcal{L} = \max\left(0, E(x, y^+) - E(x, y^-) + \text{margin} \right)
$$

 - $y^+$: valid (gold) output  
- $y^-$: corrupted (invalid) output

### 2. **Negative Log-Likelihood** (Optional):

Define probability from energy (Boltzmann Distribution):

$$
P(y|x) = \frac{e^{-E(x,y)}}{Z(x)}, \quad Z(x) = \sum_{y'} e^{-E(x, y')}
$$

Loss becomes:

$$
\mathcal{L} = E(x, y^+) + \log \sum_{y'} e^{-E(x, y')}
$$

> Computing$Z(x)$is usually intractable → approximated with sampling.

---

## 💡 Comparison: EBM vs Regular Models

|                         | Regular NN                     | EBM                                |
| ----------------------- | ------------------------------ | ---------------------------------- |
| **Output**              | Probabilities / logits         | Arbitrary structured object        |
| **Loss**                | Cross-entropy, MSE, etc.       | Energy: low for good, high for bad |
| **Structure awareness** | Rare (unless explicitly added) | Built-in via energy design         |
| **Ground truth needed** | Yes                            | Optional (can be unsupervised)     |

---

## 🧩 Use Case: Enforcing Loop Structure in a Graph

Given a predicted adjacency matrix$A \in [0, 1]^{N \times N}$:

### Loop Participation Score:

$$
S_{i,j} = \sum_{k=1}^{K} A[i,j] \cdot A^k[j,i]
$$

This soft score reflects how much arc$A[i,j]$participates in loops.

### Backward Jump Penalty:

Let$B = \{ (i,j) \mid i > j \}$be backward arcs.

Estimate if loops involving$A[i,j]$exceed 1 backward jump:

$$
\text{penalty}(A) = \lambda \cdot \max(0, \text{expected\_backward\_jumps} - 1)^2
$$

---

## 🧪 Using Energy as a Regularizer

You can use the energy function as a **soft constraint** in a regular loss:

$$
\mathcal{L}_{TOTAL} = \mathcal{L}_{Logit}+\lambda E
$$
