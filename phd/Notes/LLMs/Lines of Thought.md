## Overview

This paper explores how large language models (LLMs) internally process input sequences during autoregressive text generation. Specifically, it focuses on the *trajectories* of token embeddings as they evolve through the model layers, proposing that these trajectories — called **lines of thought** — can be modeled as stochastic processes on a low-dimensional manifold.

---

## Key Concepts and Motivation

### What is a "Line of Thought"?

Each time a token is processed in an LLM (e.g., GPT), it is represented by a high-dimensional vector (embedding). As this token flows through the model’s layers, its representation is transformed multiple times. The sequence of these intermediate representations forms a trajectory in latent space — this is what the authors call a "line of thought."

* **Pilot token**: For analysis, the authors track the embedding of the *last token* in each input pseudo-sentence — the one used to predict the next token — as it is updated layer by layer. This is called the pilot token.
* **Layman’s analogy**: Think of a car's GPS path during a road trip. You only see one vehicle’s location, but by collecting multiple trips, you can study the patterns all vehicles follow.

---

## Section 3: Geometric Structure of the Trajectories

### 3.1 Trajectory Clustering

Each pseudo-sentence is processed by GPT-2 (355M), and the pilot token’s hidden states after each of the 24 transformer layers are collected to form a trajectory $\{x_k(1), x_k(2), \ldots, x_k(24)\} \subset \mathbb{R}^{1024}$.

Using t-SNE visualizations and projections onto principal components (see Fig. 1a), the authors observe that different trajectories *cluster tightly*, forming a narrow "bundle". This suggests a strong alignment of the paths taken by different inputs through latent space.

### 3.2 Low-Dimensional Manifold Hypothesis

At each layer $t$, the authors gather the positions $x_k(t)$ for all sentences $k$ and perform a Singular Value Decomposition (SVD):

$$
M^{(t)} = U^{(t)} \Sigma^{(t)} V^{(t)\top},
$$

where $M^{(t)}$ is the matrix with each $x_k(t) \in \mathbb{R}^{1024}$ as a column.

* The singular vectors $U^{(t)}$ provide a data-driven orthonormal basis for the latent space at layer $t$.
* The decay of the singular values $\sigma_i^{(t)}$ (shown in Fig. 2b) indicates that most of the variation lies along a small number of directions.

### Output Preservation Test

To assess how many dimensions are sufficient to preserve model output, the authors reproject $x(t)$ onto the first $K$ singular vectors:

$$
x(t) \approx \sum_{i=1}^{K} a_i^{(t)} u_i^{(t)}.
$$

They then compute the next-token probability distribution from this reduced embedding and compare it (via KL divergence) to the full one. It is found (Fig. 2c) that retaining just $K_0 = 256$ directions (i.e., 25% of 1024) suffices to reconstruct over 90% of the output distribution information. This suggests that LoTs effectively reside on a 256D manifold.

* **Caveat**: While directions change slightly across layers (Fig. 2a), the manifold remains low-dimensional and smoothly evolving.
## Linear Approximation and Residual Noise

It's improbable that a Transformer could be approximated by a linear extrapolation. They propose a simple extrapolation model from layer $t$ to $t+\tau$:

$$
x(t+\tau) = R(t+\tau)\Lambda(t,\tau)R(t)^\top x(t) + w(t,\tau) \tag{1}
$$

where $\Lambda(t,\tau) = \text{diag}(\sigma_i(t+\tau)/\sigma_i(t))$.

The residual $w(t,\tau)$ is modeled as Gaussian noise:

$$
 w_i(t,\tau) \sim \mathcal{N}(0, \alpha e^{\lambda(t+\tau)}) \tag{2}
$$

This gives rise to the Langevin SDE and its equivalent Fokker-Planck equation for the evolution of the probability density $P(x, t)$.

The residual noise $\delta x(t,\tau) = x(t+\tau) - \tilde{x}(t,\tau)$ is shown (by experiments) to be:

* Gaussian,
* Zero mean ($\mu \ll \sigma$),
* Isotropic: the variance is uniform across dimensions ($\text{cov}(\delta x) = \sigma^2 I$)
* No spatial cross-correlation (off-diagonal terms $\approx 0$).
Confirming hypothesis $(2)$

---

### Langevin-Type Dynamics

If we want to extend $(1)$ to the continuous case we can. The trajectories $x(t)$ are modeled as obeying a Langevin-like stochastic differential equation:

$$
dx(t) = \left[\dot{R}(t)R(t)^\top + R(t)\dot{S}(t)R(t)^\top\right]x(t)dt + \sqrt{\alpha\lambda e^{\lambda t}} dw(t),
$$

where:

* $R(t)$ is the rotation matrix (formed by $U^{(t)}$),
* $\dot{S}(t) = \text{diag}(\sigmȧ_i / \sigma_i)$ captures stretch in singular values,
* $dw(t)$ is the Wiener process (Gaussian noise),
* $\alpha \approx 0.64$, $\lambda \approx 0.18$ (for GPT-2).

These simulated trajectories follow closely the ground-truth of real token embeddings through the layers.

---

## Interpretation and Implications

### Simple Dynamics from Complex Systems

Despite the complexity of LLMs, their internal processing (in terms of token embeddings) follows surprisingly *regular* patterns that can be captured with simple differential equations.

* This bridges neural network behavior with classical physics-like systems (e.g., Brownian motion).

### Utility

* Can be used to analyze and potentially control LLM internal behavior.
* May inspire more efficient or interpretable architectures.

---

## Possible Extensions for Research

* Apply this analysis to specific linguistic structures (e.g., named entities).
* Explore anisotropic behavior for different token types (nouns vs. verbs).
* Use manifold-aware regularization in training.

---

## Conclusion

This paper introduces a powerful perspective: LLMs don’t just "think" in terms of isolated layers but trace structured, low-dimensional, and stochastic paths — *lines of thought* — through their embedding space. Understanding and modeling these paths can lead to more interpretable, controllable, and efficient models.
