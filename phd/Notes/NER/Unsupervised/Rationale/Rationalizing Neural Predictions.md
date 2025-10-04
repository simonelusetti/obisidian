Rationalizing Neural Predictions: https://arxiv.org/abs/1606.04155 

The paper introduces **rationale selection** as a game between two components:
- **Generator**: selects a subset of the input tokens (the _rationale_).
- **Encoder**: makes predictions based only on the rationale.

The model is trained **without access to gold rationales**. Instead, it is guided by desiderata:
1. Rationales must be **short and coherent**.
2. Rationales must be **sufficient** to achieve nearly the same prediction as the full input.

---
## Problem Setup

Given an input sequence of tokens: $x=(x1,x2,…,xl), \quad x_t \in \mathbb{R}^d$

The encoder maps input to a target vector: $\text{enc}(x) = \tilde{y} \in \mathbb{R}^m$, with supervision signal $\tilde{y}$

A **rationale** is a binary mask: $z=(z_1,z_2,…,z_l),z_t∈\{0,1\}$, AKA a subset of the input tokens

---
## Encoder

We use the encoder as a predictor
$$
L(x,y)=\|enc(x)−y\|^2_2
$$
It could be created in many ways, let's imagine a Recurrent Neural Network setup:
$$
h_t = f_e(x_t, h_{t-1})\ t=1,...,l \quad \tilde{y} = \sigma(W_e h_l + b_e)
$$
---

## Generator

Gives a distribution over rationales defining which tokens to select:
$$
z\sim gen(x)=p(z∣x)
$$
If we consider the selection at token $x_t$ (so $z_t$) to be independent of other $z_h\ h\neq t$ we can model the joint distribution as 
$$
p(z|x) = \prod_{t=1}^l p(z_t | x)
$$
Which can be modeled using a shared bi-directional recurrent neural
network: let $\overrightarrow{f}$ and $\overleftarrow{f}$ bet the forward and backward recurrent unit, respectively, then
$$ 
\overrightarrow{h_t} = \overrightarrow{f}(x_t,\overrightarrow{h_{t-1})}
\quad \overleftarrow{h_t} = \overleftarrow{f}(x_t,\overleftarrow{h_{t-1})}
$$
$$
p(z_t|x) = \sigma_z(W_z [\overrightarrow{h_t}; \overleftarrow{h_t}] + b_z )
$$
However, for a more accurate selection the probability of each token should be influenced by the others: 
$$
p(z|x) = \prod_{t=1}^l p(z_t | x, z_1,...,z_{t-1},z_{t+1},...,z_l)
$$
Which can be modeled by an additional hidden state $s_t$
$$
p(z_t|x, z_{1,t−1}) = \sigma_z (W_z [\overrightarrow{h_t}; \overleftarrow{h_t}; s_t] + b_z ) \quad 
s_t = f_z ([\overrightarrow{h_t}; \overleftarrow{h_t}; z_t], s_{t−1})
$$

---

## Joint Objective

The rationale, to be so, must satisfy a few expression:
- it should be able to explain the classification: $L(z, x, y) = \| \text{enc}(z, x) - y \|_2^2$
- it should be short and represent spans: $\Omega(z) = \lambda_1 \|z\| + \lambda_2 \sum_t |z_t - z_{t-1}|$ 

Train by minimizing the expectation:
$$
\min_{\theta_e, \theta_g} \sum_{(x,y) \in D} \mathbb{E}_{z \sim \text{gen}(x)} [L(z, x, y)+\Omega(z)]
$$
But this term isn't derivable directly due to the hard sampling in the selection. The problem can be circumvented by using a gradient approximation with **REINFORCE**:
$$
\nabla_{\theta_g} \mathbb{E}_{z \sim p(z|x)} [ \text{cost}(z,x,y) ] = \mathbb{E}_{z \sim p(z|x)} \left[ \text{cost}(z,x,y) \nabla_{\theta_g} \log p(z|x) \right]
$$
---
## Takeaway

- Rationale generation is modeled as a **latent variable problem**
- The **generator–encoder game** enforces that rationales are **short, coherent, and sufficient**
- This was one of the first works to explicitly formalize **rationalizing predictions** as a joint optimization problem