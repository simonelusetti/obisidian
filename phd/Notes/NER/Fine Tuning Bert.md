## 📄 How to Fine-Tune BERT for Text Classification?

**Authors**: Chi Sun, Xipeng Qiu, Yige Xu, Xuanjing Huang
**Year**: 2019
**Link**: [arXiv:1905.05583](https://arxiv.org/abs/1905.05583)

---

### 🔍 Overview

This paper investigates the effect of various **fine-tuning strategies for BERT** on sentence-level classification tasks. It provides empirical insights into hyperparameters, layer-wise learning rates, and training stability.

---

### 🧠 Key Ideas

* Fine-tuning BERT can be highly sensitive to hyperparameters.
* Gradual unfreezing and discriminative learning rates across layers improve stability and performance.
* BERT's **\[CLS]** token is sufficient for classification.

---

### 🏗 Input Representation

* A single sentence or sentence pair is tokenized using WordPiece and packed as:

$$
\text{[CLS]}\ \text{Sentence A}\ \text{[SEP]}\ \text{Sentence B}\ \text{[SEP]}
$$

* Input to BERT includes:

  * Token embeddings
  * Segment embeddings (A/B sentence distinction)
  * Positional embeddings

---

### 📊 Classification Head

* The output embedding corresponding to the **\[CLS]** token is denoted as:

$$
\mathbf{h}_{\text{[CLS]}} \in \mathbb{R}^{d_{model}}
$$

* This vector is passed through a classification layer:

$$
\hat{y} = \text{softmax}(\mathbf{W} \mathbf{h}_{\text{[CLS]}} + \mathbf{b})
$$

* The objective is cross-entropy loss:

$$
\mathcal{L} = -\sum_{i=1}^{C} y_i \log \hat{y}_i
$$

Where:

* $C$ is the number of classes
* $y_i$ is the true label distribution (usually one-hot)

---

### ⚙️ Fine-Tuning Strategies Explored

#### 1. **Learning Rate**

* BERT is sensitive to the learning rate.
* Optimal values are typically in the range:

$$
2 \times 10^{-5} \leq \eta \leq 5 \times 10^{-5}
$$

#### 2. **Number of Epochs**

* Fine-tuning for **2–4 epochs** usually works well.

#### 3. **Batch Size**

* Empirically: 16 or 32.
* Large batches improve generalization but require tuning the learning rate.

#### 4. **Warmup and Scheduler**

* Warmup proportion: \~10% of total steps.
* Linear decay after warmup improves convergence:

$$
\eta_t = \eta_0 \cdot \left(1 - \frac{t}{T}\right)
$$

#### 5. **Layer-Wise Learning Rates**

* Lower layers get smaller updates:

$$
\eta_l = \eta_0 \cdot \alpha^l
$$

Where:

* $l$ is the layer index (0 = bottom)
* $\alpha \in (0, 1)$ is the decay factor

#### 6. **Gradual Unfreezing**

* Start training with only the top layers, then progressively unfreeze deeper layers.

---

### ✨ Impact

* Provides clear best practices for practitioners fine-tuning BERT.
* Layer-wise strategies are now commonly used in transfer learning.
* Helps reduce overfitting on small datasets.

---

### 🔗 Related Concepts

* ULMFiT: Introduced gradual unfreezing and discriminative learning rates.
* RoBERTa: Variant of BERT with improved training but no NSP.

---

### 📃 Citation

Sun, C., Qiu, X., Xu, Y., & Huang, X. (2019). *How to Fine-Tune BERT for Text Classification?* arXiv preprint arXiv:1905.05583.
