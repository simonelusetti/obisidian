## 📄 W²NER: A Unified Framework for Flat, Nested, and Discontinuous Named Entity Recognition

**Authors**: Xiaoya Li, Jingrong Feng, Yuxian Meng, Qinghong Han, Fei Wu, Jiwei Li
**Year**: 2022 (AAAI)
**Link**: [Paper](https://arxiv.org/abs/2106.01223)

---

### 🔍 Overview

W²NER reframes Named Entity Recognition (NER) as a **word–word relation classification** task. It enables a **unified approach** for:

* Flat NER
* Nested NER
* Discontinuous NER

Instead of sequence labeling, W²NER uses a **2D relation matrix** to model the connections between all token pairs in a sentence.

---

### 🧠 Key Ideas

* Replace BIO-style tagging with a **grid** of relational labels.
* Capture **next-word**, **head–tail**, and **co-type** relations.
* Use **multi-granularity convolution** layers to capture both local and global structure.
* Use a **co-predictor** module to enforce relational consistency.

---

### 🏗 Input and Representation

Given an input sentence $X = \{x_1, x_2, \dots, x_N\}$, each word $x_i$ is first tokenized into word pieces and passed through a pretrained BERT model. The resulting word-piece embeddings are aggregated with **max pooling** to form word-level representations. Then, a **bidirectional LSTM** refines these representations:

$$
H = [h_1, h_2, \dots, h_N] \in \mathbb{R}^{N \times d_h}
$$

where $d_h$ is the hidden dimension.

---

### 🛠 Architecture (Detailed)

#### ✈️ Convolutional Layer

To model word-pair relations on a grid:

1. **Conditional Layer Normalization (CLN)** is used to build a directional representation tensor $V \in \mathbb{R}^{N \times N \times d_h}$. For each word pair $(x_i, x_j)$:

$$
\mu = \frac{1}{d_h} \sum_{k=1}^{d_h} h_{j,k}, \quad \sigma = \sqrt{\frac{1}{d_h} \sum_{k=1}^{d_h} (h_{j,k} - \mu)^2}
$$

$$
\gamma_{ij} = W_\alpha h_i + b_\alpha, \quad \lambda_{ij} = W_\beta h_i + b_\beta
$$

$$
V_{ij} = \gamma_{ij} \circ \frac{(h_j - \mu)}{\sigma} + \lambda_{ij}
$$

2. **BERT-style Grid Representation Build-up**:
   Concatenate token-level relation tensor $V$, relative position embeddings $E^d \in \mathbb{R}^{N \times N \times d_d}$, and region embeddings $E^t \in \mathbb{R}^{N \times N \times d_t}$. Process via MLP:

$$
C = \text{MLP}_1([V; E^d; E^t]) \in \mathbb{R}^{N \times N \times d_c}
$$

3. **Multi-Granularity Dilated Convolutions**:
   Apply dilated convolutions with dilation rates $l \in \{1, 2, 3\}$:

$$
Q^{(l)} = \sigma(\text{DConv}^{(l)}(C)), \quad Q = [Q^{(1)}; Q^{(2)}; Q^{(3)}] \in \mathbb{R}^{N \times N \times 3d_c}
$$

where $\sigma$ is the GELU activation.

#### ⚖️ Co-Predictor Layer

This layer uses two parallel heads:

* **MLP Predictor**:

$$
y_{ij}'' = \text{MLP}(Q_{ij}) \in \mathbb{R}^{|R|}
$$

* **Biaffine Predictor**: Uses original word embeddings from encoder

$$
s_i = \text{MLP}_2(h_i), \quad o_j = \text{MLP}_3(h_j)
$$

$$
y_{ij}' = s_i^T U o_j + W[s_i; o_j] + b \in \mathbb{R}^{|R|}
$$

Final prediction combines both:

$$
y_{ij} = \text{Softmax}(y_{ij}' + y_{ij}'')
$$

#### 🤖 Entity Decoder

* Identify head–tail pairs using `THW` relation from $y_{ij}$.
* Extend using `NNW` and `SHW` relations.
* Reconstruct entities (flat, nested, discontinuous) through relation chaining.

---

### 🗨️ Loss Function

Train with cross-entropy over all word-pair predictions:

$$
\mathcal{L} = - \sum_{i,j} \sum_{r=1}^{|R|} y_{ij}^{(r)} \log p_{ij}^{(r)}
$$

---

### 🔬 Discontinuous NER Handling

* `NNW` and `SHW` relations link disjoint spans.
* The relation matrix allows entity segments to be chained over distance.
* Decoder extracts multi-span entities based on relation patterns.

---

### 📊 Results

#### 🌟 Performance on Benchmarks

| Dataset | Task Type         | Metric | Score (%) |
| ------- | ----------------- | ------ | --------- |
| CONLL03 | Continous NER     | F1     | 93.07     |
| GENIA   | Nested NER        | F1     | 81.39     |
| ACE2005 | Nested + Flat     | F1     | 86.79     |
| CADEC   | Discontinuous NER | F1     | 73.21     |

* SOTA on **DisNER**, **GENIA**, **ACE2005**, and **CADEC** datasets.
* Handles **long-distance dependencies** and **entity overlap** effectively.

---

### 🔗 Related Models

* **TPLinker++**: Head–tail linking
* **MARNER**: Matrix tagging with global constraints
* **MAC**: Clique-based entity merging for discontiguous mentions

---

### 📜 Citation

Li, X., Feng, J., Meng, Y., Han, Q., Wu, F., & Li, J. (2022). *Unified Named Entity Recognition as Word-Word Relation Classification*. AAAI. [arXiv:2106.01223](https://arxiv.org/abs/2106.01223)
