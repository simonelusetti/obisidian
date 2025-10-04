## 📄 LUKE: Deep Contextualized Entity Representations with Entity-aware Self-Attention

**Authors**: Ikuya Yamada, Akari Asai, Hiroyuki Shindo, Hideaki Takeda, Yoshiyasu Takefuji
**Year**: 2020
**Link**: [ACL Anthology](https://aclanthology.org/2020.acl-main.577/)

---

### 🔍 Overview

LUKE (Language Understanding with Knowledge-based Embeddings) introduces an entity-aware transformer model designed to represent both **words and entities**. It modifies the standard self-attention mechanism to directly account for entities and uses a unique entity-aware pretraining objective.

---

### 🧠 Key Ideas

* Entities are treated as **first-class citizens** in the transformer input.
* The model modifies the **self-attention** mechanism to include word-to-entity, entity-to-word, and entity-to-entity attention flows.
* Pretraining is based on **masked language modeling (MLM)** for words and **entity prediction (MEP)** for entity spans.

---

### 🏗 Input Representation

LUKE accepts both **tokens** and **entities** as inputs:

* Input sequence: text tokens + entity spans (start and end positions)
* Word and entity embeddings are learned separately.
* Each entity span is replaced with a special token, and the entity itself is embedded using a dedicated lookup table.

The input is:

$$
\text{[CLS]}\ w_1\ w_2\ \dots\ w_n\ \text{[SEP]}\ e_1\ e_2\ \dots\ e_m\ \text{[SEP]}
$$

---

### 🔁 Entity-aware Self-Attention

LUKE introduces four interaction types in the attention mechanism:

1. **Word-to-Word (w2w)**
2. **Word-to-Entity (w2e)**
3. **Entity-to-Word (e2w)**
4. **Entity-to-Entity (e2e)**

Each type uses different query projection matrices, modifying the attention score computation. Specifically, the attention score $e_{ij}$ between tokens $x_i$ and $x_j$ is computed as:

$$
 e_{ij} =
 \begin{cases} 
 K_j^\top Q^{\text{w2w}} x_i & \text{if } x_i, x_j \text{ are words} \\ 
 K_j^\top Q^{\text{w2e}} x_i & \text{if } x_i \text{ is word, } x_j \text{ is entity} \\ 
 K_j^\top Q^{\text{e2w}} x_i & \text{if } x_i \text{ is entity, } x_j \text{ is word} \\ 
 K_j^\top Q^{\text{e2e}} x_i & \text{if both } x_i, x_j \text{ are entities} 
 \end{cases}
$$

where $Q^{\ast}$ are type-specific query projections and $K_j$ is the key vector of token $x_j$.

This setup allows the model to learn separate patterns of interaction across different types of token pairs, rather than applying a uniform attention mechanism.

---

### 🧰 Architecture Details

The LUKE model is based on a Transformer encoder with several key modifications:

* **Embedding Layer**:

  * **Word Embeddings** for standard input tokens
  * **Entity Embeddings** for explicitly provided entity spans
  * **Entity Type Embeddings** encoding coarse-grained types (e.g., PERSON, LOCATION), improving generalization
  * **Segment + Position Embeddings** as in BERT

* **Transformer Encoder Layers**:

  * Each layer includes a **multi-head attention module** with distinct projections for the four attention types above
  * Follows standard residual connections, layer normalization, and feedforward sublayers

* **Pretraining Tasks (described below)**

* **Downstream Module**: uses contextual representations of masked entities for classification tasks like NER, RE, etc.

Figure 1 in the paper illustrates how both words and entities are embedded and processed in parallel streams through the encoder, with cross-type attentions allowing rich interaction.

---

### 🧪 Pretraining Tasks

LUKE uses a joint objective:

#### 1. **Masked Language Modeling (MLM)**

Randomly masks 15% of input words:

$$
\mathcal{L}_{\text{MLM}} = -\sum_{i \in \mathcal{M}_w} \log P(w_i | \text{context})
$$

#### 2. **Masked Entity Prediction (MEP)**

Randomly masks 15% of input entities:

$$
\mathcal{L}_{\text{MEP}} = -\sum_{j \in \mathcal{M}_e} \log P(e_j | \text{context})
$$

The total loss is:

$$
\mathcal{L} = \mathcal{L}_{\text{MLM}} + \mathcal{L}_{\text{MEP}}
$$

---

### ✨ Impact

* Achieved state-of-the-art on several NER benchmarks (CoNLL-2003, TACRED).
* Introduced the idea of explicitly integrating **structured knowledge** (entities) into LMs.
* Inspired further research into entity-aware and span-aware transformer models.

---

### 🔗 Related Concepts

* KnowBERT: Integrates knowledge using entity embeddings
* SpanBERT: Focuses on span representations in pretraining
* ERNIE: Uses knowledge masking for entity-level learning

---

### 📃 Citation

Yamada, I., Asai, A., Shindo, H., Takeda, H., & Takefuji, Y. (2020). *LUKE: Deep Contextualized Entity Representations with Entity-aware Self-Attention*. In Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics (pp. 6442–6454).
