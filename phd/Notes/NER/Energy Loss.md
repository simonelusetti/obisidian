Structured Loop Energy Loss for NER Adjacency Matrices

1. Problem Setup

We predict an adjacency matrix $ A $ representing arcs between tokens in a sentence:

$$ 
A \in \mathbb{R}^{N \times N \times C}
$$

- $N$: number of tokens
- $C$: number of classes (0 = no arc, 1 = forward arc, $2+$ = backward arc)

After applying softmax along the class dimension:

$$
P_{i,j} = P_{\text{fwd}}[i,j] + P_{\text{bwd}}[i,j]
$$

This gives a probability of an arc (any direction) between nodes $i$ and $j$.

---

## Loop Structure Objective

Goal: Enforce that predicted arcs form valid loops:
- Loops may combine forward (upper triangle) and backward (lower triangle) arcs
- Valid loop: every arc must be part of a cycle

Key idea: A node pair $(i, j)$ is part of a loop if there exists a directed path from $j$ back to $i$ (closing the cycle).

---

## Soft Reachability Matrix

Starting from our soft adjacency matrix $A$, compute soft reachability $R$ as the sum of matrix powers up to length $L$:

$$
R = A + A^2 + A^3 + \dots + A^L
$$

- $A^k$ represents paths of length $k$
- Summation approximates the existence of any path (soft OR)
- Clamp to $[0,1]$ to preserve probabilistic interpretation

Interpretation:

- $R[i,j] \approx 1$: high probability that $i$ can reach $j$ via directed paths
-  $R[j,i] \approx 1$: high probability that $j$ can reach $i$ (closing a loop)

---

## Loop Participation Penalty

Positive part, penalize arcs predicted as present but not forming loops:

$$
\mathcal{L}_{\text{loop}}^{\text{pos}}
=
\sum_{i,j} P[i,j] \cdot (1 - R[j,i])
$$

- If $P$ is high but $R[j,i]$ is low → penalty is high (false positive)

Negative form, penalize arcs that are not predicted but would close strong loops (false negatives):

$$
\mathcal{L}_{\text{loop}}^{\text{neg}}
=
\sum_{i,j} (1 - P[i,j]) \cdot R[j,i]
$$

Combined Form:

$$
\mathcal{L}_{\text{loop}}
=
\sum_{i,j} \left[
P[i,j] \cdot (1 - R[j,i]) + (1 - P[i,j]) \cdot R[j,i]
\right]
$$

Simplifies to:

$$
\mathcal{L}_{\text{loop}}
=
\sum_{i,j} | P[i,j] - R[j,i] |
$$

This is analogous to binary cross-entropy between predicted arcs and structural support.

---

## Triangle Penalty

Goal: Enforce directional consistency

- Forward arcs must appear in the upper triangle ($i<j$)
- Backward arcs must appear in the lower triangle ($i>j$)

Penalty:

$$
\mathcal{L}_{\text{tri}}
=
\sum_{i<j} P_{\text{bwd}}[i,j] + \sum_{i>j} P_{\text{fwd}}[i,j]
$$

Any backward arc in the upper triangle or forward arc in the lower triangle is penalized.

---
## Single Backward Arc Constraint

Motivation: a valid loop must contain exactly one backward arc (closing the cycle).

Soft Component Membership: two nodes are in the same soft component if they are mutually reachable:

$$
C[i,j] = R[i,j] \cdot R[j,i]
$$

$C[i,j] \approx 1$ if nodes $i$ and $j$ are in the same strongly connected subgraph.

Backward arcs:

$$
B[i,j] = \sum_{c\ge2} P_c[i,j] \cdot 1(i>j)
$$

Total backward probability for component anchored at $k$:

$$
S_{\text{comp}}(k)
=
\sum_{i,j} B[i,j] \cdot C[i,k] \cdot C[j,k]
$$

Penalty:

$$
\mathcal{L}_{\text{back}}
=
\frac{1}{N}
\sum_k | S_{\text{comp}}(k) - 1 |
$$

- If no backward arcs: penalty = 1
- If two backward arcs: penalty = 1
- Minimum penalty when exactly one backward arc is present

---

## Total Energy Loss

Combine all components:

$$
\mathcal{E}
=
\lambda_{\text{tri}} \cdot \mathcal{L}_{\text{tri}}
+
\lambda_{\text{loop}} \cdot \mathcal{L}_{\text{loop}}
+
\lambda_{\text{back}} \cdot \mathcal{L}_{\text{back}}
$$

$\lambda$ terms balance structural constraints vs token-level CE loss.

---

Key Insights

- Reachability matrix encodes structural information
- Symmetric loop penalty aligns predictions with structural support (punishes false positives and negatives)
- Triangle penalty enforces directionality
- Single backward penalty ensures loop correctness (one closing arc)
