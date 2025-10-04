# TOE: A Grid-Tagging Discontinuous NER Model

**Focus**: Discontinuous NER using grid tagging + Tag-Oriented Enhancement (TREM)

---

## 1. Background

- Traditional NER → sequence labeling (BIO tags) struggles with **discontinuous entities**.
- **Grid-tagging** reformulates NER:
  - Build **word-word grid**: each cell (i, j) = relation between word i and j.
  - Predict relation tags:
    - **NNW**: next neighboring word (connect adjacent words in an entity).
    - **THW**: tail-head word (mark entity boundaries).
  - TOE extends this with **PNW** (previous neighboring word) and **HTW** (head-tail word).

Goal: Represent **entity structure** in the grid and recover discontinuous spans.

---

## 2. Model Architecture

### 2.1 Word Encoder

- **BERT + BiLSTM** for contextual word representations:
$$
H = \text{BiLSTM}(\text{BERT}(x_1,\ldots,x_L))
\quad\in \mathbb{R}^{L \times d}
$$

---

### 2.2 Tag-Oriented Enhancement (TREM)

**Key Idea**:  
Enhance grid representations by introducing **learnable tag embeddings** and modeling:
- Tag–word interactions
- Tag–tag interactions

This allows structured reasoning about tag semantics (PNW, HTW, NNW, THW) instead of treating tags as independent labels.

---

#### 2.2.1 Tag Embeddings

Define learnable embeddings for each tag type:
$$
E_{tag} =
\begin{bmatrix}
e_{PNW} \\
e_{HTW} \\
e_{NNW} \\
e_{THW}
\end{bmatrix}
\in \mathbb{R}^{T \times d}, \quad T=4
$$

---

#### 2.2.2 Tag–Word Attention

**Projection layers** (learned matrices):

$$
Q^w = HW_Q^w,\quad K^t = E_{tag}W_K^t,\quad V^t = E_{tag}W_V^t
$$
$$
Q^t = E_{tag}W_Q^t,\quad K^w = HW_K^w,\quad V^w = HW_V^w
$$

**Word → Tag attention**:

$$
\alpha_{word\to tag} = \text{softmax}\!\left(
\frac{Q^w (K^t)^\top}{\sqrt{d}}
\right)
$$
$$
C_{word\to tag} = \alpha_{word\to tag} V^t
$$

**Tag → Word attention**:

$$
\alpha_{tag\to word} = \text{softmax}\!\left(
\frac{Q^t (K^w)^\top}{\sqrt{d}}
\right)
$$
$$
C_{tag\to word} = \alpha_{tag\to word} V^w
$$

---

#### 2.2.3 Tag–Tag Attention

Self-attention between tags:

$$
\alpha_{tag\to tag} = \text{softmax}\!\left(
\frac{Q^t (K^t)^\top}{\sqrt{d}}
\right)
$$
$$
C_{tag\to tag} = \alpha_{tag\to tag} V^t
$$

---

#### 2.2.4 Fusion and Iteration

Update representations with residual connections + layer normalization:

$$
\tilde{H} = \text{LayerNorm}(H + C_{word\to tag})
$$
$$
\tilde{E}_{tag} = \text{LayerNorm}(E_{tag} + C_{tag\to word} + C_{tag\to tag})
$$

Repeat for **k iterations** (typically 2–3) to progressively refine features.

---

## 3. Grid Prediction

- After TREM, compute **edge features** $G_{ij}$ combining refined word and tag embeddings.
- Classify each edge into 4 relation types (PNW, HTW, NNW, THW):

$$
\hat{y}_{ij} = \text{softmax}(W_o G_{ij} + b_o)
$$

Loss: standard **cross-entropy** over all grid cells.

---

## 4. Advantages

- **Explicit tag semantics**: tags are not just labels but learnable vectors.
- **Structured interactions**: tag–tag and tag–word attention capture global dependencies.
- **Improved discontinuous NER**: better span reconstruction vs. W2NER baseline.

---

## 5. Results

- Benchmarks: CADEC, ShARe13, ShARe14
- TOE outperforms W2NER and other baselines by ~0.5–0.8 F1.

---

## 6. Key Insight

TREM biases the model toward **structured predictions**:
- Global tag embeddings shared across cells
- Iterative attention propagates constraints (e.g., HTW and NNW must align in loops)
- No hard constraints (soft structure learning)

