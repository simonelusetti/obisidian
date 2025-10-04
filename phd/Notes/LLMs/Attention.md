## 📄 Attention Is All You Need

**Authors**: Vaswani, Ashish; Shazeer, Noam; Parmar, Niki; Uszkoreit, Jakob; Jones, Llion; Gomez, Aidan N.; Kaiser, Łukasz; Polosukhin, Illia
**Year**: 2017
**Link**: [arXiv:1706.03762](https://arxiv.org/abs/1706.03762)

---

### 🔍 Overview

This paper introduces the **Transformer** architecture, a model that relies **entirely on attention mechanisms**, removing recurrence and convolutions entirely. It significantly reduces training time and achieves state-of-the-art results on machine translation.

---

### 🧠 Key Ideas

* Replaces RNNs with **multi-head self-attention**.
* Allows **parallelization** over sequences.
* Positional information is encoded via **positional embeddings**.
* Architecture consists of **encoder-decoder stacks**, each composed of attention and feed-forward sublayers.

---

### 🌟 Self-Attention Mechanism

Each token attends to all others in the sequence, computing a weighted sum of the inputs.

Given input matrix $X \in \mathbb{R}^{n \times d}$, compute:

$$
Q = XW^Q,\quad K = XW^K,\quad V = XW^V

$$

Then:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V

$$

Where:

* $Q, K, V \in \mathbb{R}^{n \times d_k}$
* $d_k$ is the dimensionality of the key/query vectors

This computes the influence of other words when encoding a given token.

---

### 🌐 Multi-Head Attention

Instead of computing a single attention function, the model uses multiple heads to capture different types of relations:

$$
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, ..., \text{head}_h)W^O

$$

Each head is:

$$
\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)

$$

---

### 🔧 Positional Encoding

Since the model has no recurrence, it uses **sinusoidal functions** to encode position:

$$
PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{model}}}\right), \quad
PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{model}}}\right)

$$

This adds position information to the input embeddings:

$$
X' = X + PE

$$

---

### 📊 Architecture Summary

#### Encoder:

Let the input sequence be $X = (x_1, \dots, x_n)$ with embeddings $E = (e_1, \dots, e_n) \in \mathbb{R}^{n \times d_{model}}$.

Each encoder layer applies:

1. **Multi-head self-attention**:

$$
Z^{(l)} = \text{MultiHead}(E^{(l-1)}, E^{(l-1)}, E^{(l-1)})

$$

2. **Residual + LayerNorm**:

$$
E^{(l)} = \text{LayerNorm}(E^{(l-1)} + Z^{(l)})

$$

3. **Feed-forward network**:

$$
F^{(l)} = \text{FFN}(E^{(l)}) = \max(0, E^{(l)}W_1 + b_1)W_2 + b_2

$$

4. **Residual + LayerNorm again**:

$$
E^{(l)} = \text{LayerNorm}(E^{(l)} + F^{(l)})

$$

The encoder outputs $E^{(L)} \in \mathbb{R}^{n \times d_{model}}$, the final contextualized embeddings.

#### Decoder:

Let $Y = (y_1, \dots, y_m)$ be the target sequence.
Each decoder layer performs:

1. **Masked multi-head self-attention**:

$$
Z_1^{(l)} = \text{MaskedMultiHead}(D^{(l-1)}, D^{(l-1)}, D^{(l-1)})

$$

2. **Residual + LayerNorm**:

$$
D_1^{(l)} = \text{LayerNorm}(D^{(l-1)} + Z_1^{(l)})

$$

3. **Encoder-decoder attention**:

$$
Z_2^{(l)} = \text{MultiHead}(D_1^{(l)}, E^{(L)}, E^{(L)})

$$

4. **Residual + LayerNorm**:

$$
D_2^{(l)} = \text{LayerNorm}(D_1^{(l)} + Z_2^{(l)})

$$

5. **Feed-forward network + Residual + LayerNorm**:

$$
F^{(l)} = \text{FFN}(D_2^{(l)}), \quad D^{(l)} = \text{LayerNorm}(D_2^{(l)} + F^{(l)})

$$

The decoder outputs $D^{(L)}$, which is then passed through a linear + softmax layer for token prediction.

---

### ⚖ Training Details

* **Loss**: Cross-entropy
* **Optimizer**: Adam with warm-up steps:

$$
\text{lr} = d_{model}^{-0.5} \cdot \min\left(\text{step}^{-0.5}, \text{step} \cdot \text{warmup}^{-1.5}\right)

$$

* Label smoothing $\epsilon = 0.1$
* Dropout and residual connections for regularization

---

### ✨ Impact

* Formed the basis for BERT, GPT, T5, etc.
* Enabled massive parallelization
* Led to the unification of many NLP architectures under the Transformer umbrella

---

### 🔗 Related Concepts

* BERT: Encoder-only Transformer
* GPT: Decoder-only Transformer (causal masking)
* T5: Text-to-text transfer Transformer (encoder-decoder)

---

### 📃 Citation

Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). *Attention is all you need*. In Advances in neural information processing systems (pp. 5998-6008).
