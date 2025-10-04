
---

## 2.1 Variational Autoencoders

A Variational Autoencoder (VAE) is a **latent variable model** that defines a joint probability distribution:

$$
p(x, z) = p(x \mid z) p(z),
$$

where:

* $x$ is the observed data,
* $z$ is the latent variable (e.g., a hidden cause or abstract representation),
* $p(z)$ is the prior over latent variables (usually $\mathcal{N}(0, I)$),
* $p(x \mid z)$ is the likelihood (decoder), typically modeled by a neural network.

---

### Marginal Log-Likelihood

Given a dataset $\mathcal{X} = \{x_1, \dots, x_N\}$, the objective is to maximize the **marginal likelihood**:

$$
\log p(\mathcal{X}) = \frac{1}{N} \sum_{i=1}^N \log p(x_i) = \frac{1}{N} \sum_{i=1}^N \log \int p(x_i, z) \, dz.
$$

This integral is typically **intractable** when $p(x \mid z)$ is a neural net.

---

### Variational Inference and the ELBO

To tackle the intractability, we introduce an **approximate posterior** $q(z \mid x)$ from a variational family $\mathcal{Q}$. Applying **Jensen's inequality** yields the **Evidence Lower Bound (ELBO)**:

$$
\log p(x) \geq \mathbb{E}_{q(z \mid x)}[\log p(x \mid z)] - \text{KL}(q(z \mid x) \| p(z)).
$$

Thus, the ELBO becomes our training objective:

$$
\mathcal{L}(x) = \mathbb{E}_{q(z \mid x)}[\log p(x \mid z)] - \text{KL}(q(z \mid x) \| p(z)). \tag{1}
$$

> 💡 **Layman Analogy**: You’re trying to guess what a blurry image shows. You generate several possibilities (samples $z$), score them by how closely they resemble the original (likelihood), and prefer guesses that are “normal” (penalize with KL divergence if they're not).

---
### Inference Networks

To make inference **scalable**, we model $q(z \mid x)$ with a neural network called the **encoder**, denoted $q_\phi(z \mid x)$. Similarly, the decoder is parameterized by $\theta$.

The final objective becomes:

$$
\mathcal{L}(x; \theta, \phi) = \mathbb{E}_{q_\phi(z \mid x)}[\log p_\theta(x \mid z)] - \text{KL}(q_\phi(z \mid x) \| p(z)). \tag{2}
$$

---

### The Reparameterization Trick

To enable gradient-based optimization, we use the **reparameterization trick**. If $q_\phi(z \mid x)$ is Gaussian with parameters $\mu(x), \sigma(x)$, then:

$$
z = \mu(x) + \sigma(x) \odot \epsilon, \quad \epsilon \sim \mathcal{N}(0, I),
$$

This allows gradients to flow through $z$ during training.

The ELBO is then estimated via Monte Carlo sampling:

$$
\mathcal{L}(x) \approx \frac{1}{L} \sum_{l=1}^L \log p(x \mid z^{(l)}) - \text{KL}(q(z \mid x) \| p(z)),
\quad z^{(l)} = \mu + \sigma \odot \epsilon^{(l)}.
$$

> 🧠 **Analogy**: Imagine you have a shaky hand when drawing. Instead of dealing with unpredictable wobbles, you always draw with the same tremor and just shift the center point — that’s what the reparameterization trick does.

---

## 2. Lie Groups & Variational Inference

### 2.1 What is a Lie Group?

A **Lie group** is a mathematical object that is simultaneously:

* a **group** (with operations like multiplication and inversion),
* and a **smooth manifold** (locally Euclidean, allowing calculus).

This makes Lie groups ideal for modeling **continuous symmetries**, such as:

* rotations in 3D space (SO(3)),
* translations (ℝⁿ),
* scaling, and more.

#### Group Axioms

A set $G$ is a group under an operation if it has:

1. **Closure**: if $a, b \in G$, then $ab \in G$,
2. **Associativity**: $a(bc) = (ab)c$,
3. **Identity**: there exists $e \in G$ such that $ae = ea = a$,
4. **Inverses**: for all $a \in G$, there exists $a^{-1} \in G$ such that $a^{-1}a = a^{-1}a = 1$.

#### Manifold Structure

Locally, the elements of a Lie group can be described by coordinates — i.e., each point has a neighborhood homeomorphic to $\mathbb{R}^n$. This allows us to use calculus on the group.

> **Analogy**: Think of SO(3) as a sphere of rotations. You can move smoothly from one rotation to another — it behaves like a surface but also supports group operations.

---

### 2.2 Lie Algebras: The Tangent Space

The **Lie algebra** $\mathfrak{g}$ of a Lie group $G$ is the **tangent space at the identity element** $e$. It is a vector space (unlike $G$, which may be curved), so we can sample and use linear operations in it more easily.

* For SO(3), the Lie algebra is the space of 3×3 **skew-symmetric matrices**, denoted $\mathfrak{so}(3)$.
* Every direction in the Lie algebra corresponds to a **vector field** on the group manifold.

#### Exponential Map

There exists a smooth map:

$$
\exp: \mathfrak{g} \rightarrow G
$$

which maps a tangent vector (infinitesimal motion) to a finite group transformation.

* For SO(3), the exponential map is given by **Rodrigues' rotation formula**:

  $$
  \exp(\theta \mathbf{u}^\times) = I + \sin(\theta) \mathbf{u}^\times + (1 - \cos(\theta)) (\mathbf{u}^\times)^2
  $$

  where:

  * $\theta$ is the angle,
  * $\mathbf{u}$ is the axis of rotation (unit vector),
  *  $\mathbf{u}^\times$ is the skew-symmetric matrix representation of $\mathbf{u}$.

> **Analogy**: The Lie algebra is like the local control panel. You specify a direction and amount of motion near the identity, and the exponential map “walks” you along the curved surface (the Lie group) to reach a group element.

---

### 2.3 Latent Variables on a Manifold

In standard VAEs, latent variables $z$ live in $\mathbb{R}^n$. But what if your data lives on a **manifold** (like a sphere or rotation group)?

* Replace $z \in \mathbb{R}^n$ with $z \in G$, where $G$ is a Lie group.
* The generative model becomes:

  $$
  p(x, z) = p(x \mid z) p(z), \quad z \in G
  $$
* Prior $p(z)$: typically the **uniform distribution** on $G$ (e.g., Haar measure).

---

### 2.4 The Reparameterization Trick for Lie Groups

To train VAEs, we need the **reparameterization trick** for group-valued random variables. Classically we would do:
$$
z = \mu + \sigma \odot \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)
$$
#### Group-based Trick:

1. Sample from a base distribution $v \sim r(v \mid \sigma)$ in $\mathfrak{g}$.
2. Map it to $G$ via the exponential map:
   $$
   R = \exp(v^\times)
   $$
3. Shift the distribution using group multiplication (left-action):
	$$
   R_z = R_\mu \cdot R
   $$
The reparameterized sample is:

$$
R_z \sim q(R_z \mid R_\mu, \sigma) = \hat{q}(R_\mu^{-1} R_z \mid \sigma)
$$

> **Analogy**: Instead of nudging a point in flat space, you start at the identity of the group, wiggle in the tangent space (Lie algebra), then “walk” onto the manifold with the exponential map.

---

### 2.5 Validity: Haar Measure and Absolute Continuity

To define a valid **density** on $G$, the distribution must be absolutely continuous with respect to the **Haar measure** $\nu$, which plays the role of uniform distribution on a group.

**Theorem**: If $r(v)$ is absolutely continuous w\.r.t. Lebesgue measure on $\mathbb{R}^3$, then the pushforward $\exp(r)$ is absolutely continuous w.r.t. $\nu$.

This ensures we can compute KL divergences and entropies in the ELBO.

---

### 2.6 Explicit Form of the Density

The density $\hat{q}(R \mid \sigma)$ on SO(3) is given by:
$$
\hat{q}(R \mid \sigma) = \sum_{k \in \mathbb{Z}} \frac{r\left( \frac{\log(R)}{\theta(R)} (\theta(R) + 2k\pi) \,\middle|\, \sigma \right)}{(\theta(R) + 2k\pi)^2 (3 - \text{tr}(R))}
$$
where:
* $\theta(R) = \cos^{-1}\left(\frac{\text{tr}(R) - 1}{2}\right)$,
* $\log(R)$ is the matrix logarithm mapping $R$ back to $\mathfrak{so}(3)$,
* $r(\cdot \mid \sigma)$ is the original distribution in the Lie algebra.

This formula accounts for the fact that the exponential map is **not injective**: many different $v \in \mathfrak{so}(3)$ map to the same $R \in SO(3)$ due to periodicity of rotations.

---

### 2.7 Entropy Estimation via Monte Carlo

To compute the KL divergence in the ELBO, we estimate the entropy of $q$ using Monte Carlo:

$$
H(q) = -\mathbb{E}_{R \sim q}[\log q(R)] \approx -\frac{1}{N} \sum_{i=1}^N \log \hat{q}(R_i \mid \sigma), \quad R_i = \exp(v_i), \, v_i \sim r(v_i)
$$

The infinite sum in $\hat{q}$ is truncated in practice, and computed efficiently via the **log-sum-exp trick**

---

### 3.6 Summary

| Component            | Euclidean VAE                     | SO(3) VAE (Lie VAE)                |
| -------------------- | --------------------------------- | ---------------------------------- |
| Latent space         | $\mathbb{R}^n$                    | $\text{SO}(3)$                     |
| Base distribution    | Normal $\mathcal{N}(0, I)$        | Isotropic on $\mathfrak{so}(3)$    |
| Sampling             | $z = \mu + \sigma \odot \epsilon$ | $R_z = R_\mu \cdot \exp(v^\times)$ |
| Density w\.r.t. base | Lebesgue measure                  | Haar measure on SO(3)              |


---

## 4. Encoder and Decoder Networks

The previous section introduced how to sample from a distribution over SO(3) using the Lie algebra and exponential map. Now we explore how to **learn** such distributions from data using neural networks — specifically how to design the **encoder** and **decoder** of a Lie-group-aware VAE.

---

### 4.1 Homeomorphic Encoder

The encoder must output:

* $R_\mu \in \text{SO}(3)$: the **mean** of the latent distribution,
* $\sigma \in \mathbb{R}^+$: the **scale** of the distribution in the Lie algebra.

While learning $\sigma$ is straightforward (just like in classic VAEs), predicting $R_\mu \in \text{SO}(3)$ is more subtle.

#### Why is this hard?

* The neural network must learn a function $\text{enc}_\mu : X \to \text{SO}(3)$,
* But $\text{SO}(3)$ is **not a Euclidean space**, so we can't directly regress into it from $\mathbb{R}^n$.

> ⚠️ **Topology warning**: If the encoder network outputs values in $\mathbb{R}^n$, we need to project those values onto SO(3) in a way that preserves **continuity and invertibility**. Otherwise, the learned map won’t be a **homeomorphism** — which breaks the manifold-matching objective.

---
#### General Strategy
We design the encoder as a composition:
$$
\text{enc}_\mu = \pi \circ f
$$
where:
* $f: X \to Y \subset \mathbb{R}^m$ is a neural network,
* $\pi: Y \to \text{SO}(3)$ is a fixed, continuous **projection** onto the manifold.

This way, we ensure that:

* Neural nets do what they're good at (output in Euclidean space),
* The projection $\pi$ maps this to a **valid rotation matrix** in SO(3).

---

#### Requirements for Valid Projection

We need:

* An **embedding** $i: \text{SO}(3) \to Y$ such that $\pi \circ i = \text{id}_{\text{SO}(3)}$,
* This ensures that if $f$ learns the inverse of $i$, then $\pi \circ f$ will be a **homeomorphism** between data manifold and SO(3).

Different choices of projection $\pi$ are discussed in the paper, such as:

* Exponential map from $\mathbb{R}^3$,
* Unit quaternions ($S^3$ double cover),
* $S^2 \times S^2$ or $S^2 \times S^1$ axis-angle projections.

> 🧭 **Analogy**: Imagine your encoder maps inputs to GPS coordinates. The projection $\pi$ is like converting those to points on the surface of a globe — your outputs must land on the valid shape, not somewhere floating in 3D.

---

### 4.2 Group Action Decoder

The decoder must reconstruct data from a latent variable:

$$
p(x \mid R_z)
$$

A naïve way would be to flatten $R_z \in \text{SO}(3)$ into a 9-dimensional vector (its matrix form) and feed it into an MLP. But this ignores the **group structure** — the decoder wouldn’t understand what rotation means.

#### Desired Property: Group Equivariance

We want the decoder to satisfy:

$$
p(x \mid R \cdot R_z) = \text{RotateOutput}(p(x \mid R_z))
$$

That is, rotating the latent should rotate the output appropriately — this encourages the latent to reflect **pose** or **symmetry**.

---

#### Proposed Architecture

Inspired by group representation theory, the decoder does three steps:

1. **Latent codes** are interpreted as **Fourier coefficients** of a signal on the sphere (SO(3) acts on the sphere).
2. **Group action** is applied to these coefficients using **Wigner D-matrices** $D(g)$, which are linear maps preserving group structure:
   $$
   \hat{f}' = D(R_z) \hat{f}
   $$
3. The rotated coefficients $\hat{f}'$ are passed through an image generator to produce the output image.

> 🔄 **Analogy**: It’s like you have a rotating 3D object (latent code), and you rotate it before taking a picture (decoder output). The decoder is forced to respect how real-world objects behave under rotation.

---

#### Benefits

* Encourages **disentanglement** of content and pose.
* Leads to a **smooth, structured latent space**.
* Works well with rotational data (e.g., 3D object views).

---

### Visual Summary

```text
Input x ──> Encoder f ──> Y ──> π ──> Rμ
                            │
             ε ~ N(0, I) → σ
                            ↓
               z = Rμ · exp(σ ⊙ ε)
                            ↓
                  Wigner D-action
                            ↓
                  Image generator
                            ↓
                         Output x̂
```

---
Perfect! Here's **Section 6: Experiments and Results** rewritten in Markdown, with detailed technical insights, clear interpretations of metrics, and intuitive explanations to guide understanding.

---

## 6. Experiments and Results

This section evaluates the impact of using a manifold-aware latent space (specifically SO(3)) in VAEs, through two key experiments:

1. A synthetic dataset generated via known group actions (Toy experiment),
2. A realistic dataset of rendered 3D cubes under random rotations (Sphere-Cube experiment).

---

### 6.1 Toy Experiment

#### 🧪 Experimental Setup

* Data is generated by sampling rotations $R \in \text{SO}(3)$ and applying them to a fixed vector $v \in \mathbb{R}^{64}$, using a faithful group representation $W: \text{SO}(3) \to \mathbb{R}^{64 \times 64}$:

  $$
  x = W(R)v
  $$
* The dataset lies on a 3D submanifold of $\mathbb{R}^{64}$, homeomorphic to SO(3).

#### 🧠 Models Compared

* **SO(3)-VAE** with various mean parameterizations:

  * `s2s2`: valid (two independent unit vectors on S²)
  * `s2s1`, `alg`, `quat`: invalid or ambiguous mappings
* **Euclidean VAE** baselines:

  * Normal VAE (`N-3-dim`)
  * Hyperspherical VAE (`S-3-dim`)

All models use the **group action decoder** from Section 4.2.

---

#### 📊 Metrics

| Metric                | Meaning                                              |
| --------------------- | ---------------------------------------------------- |
| NLL                   | Negative log-likelihood (lower is better)            |
| Recon                 | Reconstruction loss (how well the model recreates x) |
| KL                    | KL divergence between posterior and prior            |
| Disc. (Discontinuity) | A custom metric indicating jumps in latent space     |

---

#### 📈 Results

| Model      | NLL  | KL   | Recon | Disc.    |
| ---------- | ---- | ---- | ----- | -------- |
| SO(3)-s2s2 | 10.7 | 1.81 | 9.21  | **0.00** |
| SO(3)-s2s1 | 11.0 | 2.12 | 9.41  | 1.00     |
| SO(3)-alg  | 13.4 | 6.24 | 9.36  | 1.00     |
| SO(3)-quat | 10.9 | 2.32 | 9.16  | 0.29     |
| N-3-dim    | 18.9 | 9.91 | 10.3  | 1.00     |
| S-3-dim    | 13.6 | 1.79 | 11.8  | 1.00     |

#### 🔍 Interpretation

* Only the **s2s2 parameterization** gives a **fully continuous encoder** (Disc. = 0).
* Euclidean latent spaces (N, S-VAEs) produce **discontinuities** and **worse reconstructions**.
* Other SO(3) encodings (e.g., quaternions) are ambiguous (e.g., double-cover) and lead to topological errors.

> 🧠 **Takeaway**: A homeomorphic encoder is **not optional** — only the right parameterization preserves latent space continuity.

---

### 6.2 Sphere-Cube Experiment

#### 🧪 Dataset

* Rendered images of a colored 3D cube rotated in SO(3).
* Rotations are applied uniformly from SO(3).
* Visual cues (asymmetric face coloring, corner spheres) help determine orientation.
* Dataset: 1 million images.

#### 🧠 Model Setup

* Encoder: 5 convolutional layers → mean parameter → reparameterization.
* Decoder: either MLP or group action decoder (Section 4.2).
* KL annealing: gradual increase in KL target from 7 to 15 during training.
* Two regularization terms:

  1. **Equivariance regularizer**: encourages rotational consistency,
  2. **Continuity regularizer**: penalizes encoding jumps between similar inputs.

---

#### 📊 Results (Decoder Comparison)

| Model             | NLL      | ELBO      | Recon     |
| ----------------- | -------- | --------- | --------- |
| SO(3)-action-s2s2 | **46.9** | **63.35** | **48.35** |
| SO(3)-MLP-s2s2    | 123.6    | 144.6     | 129.6     |
| N-MLP-3d          | 140.7    | 157.7     | 142.7     |
| N-MLP-10d         | 64.02    | 80.80     | 65.80     |
| N-MLP-30d         | 55.7     | 74.37     | 59.37     |

#### 📊 Results (Mean Parameterization)

| Model             | NLL      | ELBO      | Recon     |
| ----------------- | -------- | --------- | --------- |
| SO(3)-action-s2s2 | **46.9** | **63.35** | **48.35** |
| SO(3)-action-s2s1 | 128.5    | 173.0     | 158.0     |
| SO(3)-action-alg  | 241.2    | 333.2     | 318.2     |
| SO(3)-action-q    | 378.6    | 471.2     | 456.2     |

#### 🔍 Interpretation

* Again, only **s2s2** gives clean, continuous encodings and excellent reconstructions.
* **Group action decoder** significantly outperforms MLPs — capturing rotational symmetries directly.
* Higher-dimensional Euclidean VAEs can match NLL, but produce **disconnected, unstructured** latent spaces.

---

### 🧪 Regularization Ablation

| Regularization Used | NLL       | ELBO      | Recon     | Discontinuity |
| ------------------- | --------- | --------- | --------- | ------------- |
| Neither             | 235.2     | 246.2     | 231.2     | Very High     |
| Equivariance only   | 75.62     | 93.76     | 78.76     | Reduced       |
| Continuity only     | 87.36     | 125.6     | 110.6     | Medium        |
| Both                | **45.18** | **60.62** | **45.62** | **Lowest**    |

---

### 🎯 Final Takeaways

* Using a **latent space with matching topology** (SO(3)) is critical for learning smooth representations.
* **s2s2 parameterization** is the only one that guarantees topological validity and continuity.
* The **group action decoder** significantly improves reconstruction quality and interpretability.
* Proper **regularization** helps prevent discontinuities and aligns latent transformations with data symmetries.

---
# Appendix
## 📐 Discontinuity Metric

Throughout the paper we use a discontinuity metric. This custom metric is designed to **quantify how continuous the encoder is** — i.e., whether small changes in the input lead to small changes in the latent representation.

### 📌 Goal

Detect **jumps** or **tears** in the learned latent space — a hallmark of topological mismatch or broken homeomorphisms.

---

### 🧠 Intuition

If you walk along a smooth path in the data space (like rotating an object), your encoder’s output should also trace a smooth path in latent space. If not — e.g., the latent suddenly jumps — then the encoder is discontinuous.

> 🧭 **Analogy**: You're hiking along a mountain trail (data manifold). If your GPS (encoder) suddenly teleports you across the map, something's wrong — that's what this metric detects.

---

### 🧮 Metric Definition

Let $f : X \rightarrow Y$ be the encoder, where:

* $X$: data space (e.g., images),
* $Y$: latent space (e.g., SO(3), $\mathbb{R}^n$, etc.)

Take a path in data space: $\{x_1, x_2, \dots, x_N\}$, such that $x_i \approx x_{i+1}$ (they’re close in input space).

Define the **local Lipschitz ratio** at step $i$:

$$
L_i = \frac{d_Y(f(x_{i+1}), f(x_i))}{d_X(x_{i+1}, x_i)}
$$

Then compute:

* The **maximum jump**: $M = \max_i L_i$
* A high-percentile threshold (e.g. 90th): $P_\alpha = \text{Percentile}_{\alpha}(L_1, \dots, L_{N-1})$

---

### 🚨 Discontinuity Condition

A path is considered **discontinuous** if:

$$
M > \gamma \cdot P_\alpha
$$

Where $\gamma$ is a threshold constant (typically $\gamma = 10$).

Repeat this over many paths (e.g., 1000) and define the **discontinuity score** as the **fraction of paths that are discontinuous**.

---

### 🧪 Practical Use

* Paths are generated by rotating a 3D object smoothly (e.g., sampling from a 1D subgroup of SO(3), like rotations around Z).
* Distance in $Y$ is computed with a suitable metric:

  * Frobenius norm for SO(3),
  * Euclidean norm for $\mathbb{R}^n$.

---

### 📊 Interpretation

| Discontinuity Score | Interpretation                         |
| ------------------- | -------------------------------------- |
| 0                   | Fully continuous encoding (ideal)      |
| \~0.2–0.5           | Minor discontinuities (some jumps)     |
| ≥ 0.9               | Highly discontinuous / broken topology |

In the paper, only the **s2s2 encoder** on SO(3) achieves a discontinuity score of **0**.

---

