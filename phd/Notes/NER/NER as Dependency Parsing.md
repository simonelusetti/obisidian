## 📄 Named Entity Recognition as Dependency Parsing

**Authors**: Bailin Wang, Wei Lu
**Year**: 2020
**Link**: [ACL Anthology](https://aclanthology.org/2020.acl-main.722/)

---

### 🔍 Overview

This paper reframes Named Entity Recognition (NER) as a **dependency parsing task**, introducing a novel span-based formulation that encodes entities as dependency arcs between tokens. The approach allows the model to predict **discontinuous** and **overlapping** entities more naturally than traditional BIO tagging.

---

### 🧠 Key Ideas

* Represent each entity as a **dependency arc** between its head and boundary tokens.
* Each arc includes a label for the entity type.
* Allows parsing models (like biaffine parsers) to predict NER structures.
* Handles both **flat** and **nested** NER structures in a unified framework.

---

### 🏗 Task Formulation

Given a sentence with $n$ tokens, an entity is represented by an arc:

$$
(i \rightarrow j, \text{label})
$$

Where:

* $i$ is the head token (typically the semantic center)
* $j$ is a boundary token (could be the start or end of the entity span)
* $\text{label}$ is the entity type (e.g., PER, LOC, ORG)

---

### 🧠 Model Architecture

1. **Embedding Layer**:

   * Input tokens are embedded using pretrained models (e.g., BERT) or learned embeddings.

2. **BiLSTM Encoder**:

   * Contextualizes the input sequence:

   $$
   \mathbf{h}_i = \text{BiLSTM}(x_1, \dots, x_n)
   $$

3. **Head and Dependent Representations**:

   * For each token, create two projections:

   $$
   \mathbf{h}_i^{head} = W_{head} \cdot \mathbf{h}_i, \quad
   \mathbf{h}_j^{dep} = W_{dep} \cdot \mathbf{h}_j
   $$

4. **Biaffine Classifier**:

   * Computes score for a dependency arc:

   $$
   s(i, j) = \mathbf{h}_i^{head^T} U \mathbf{h}_j^{dep} + W [\mathbf{h}_i^{head}; \mathbf{h}_j^{dep}] + b
   $$

   * Predicts label or NULL (if no arc).

---

### 🧪 Training Objective

* Supervised objective using cross-entropy loss over possible arcs.
* For each true entity, supervise the correct arc and its label.

---

### 📊 Results & Analysis

* Evaluated on datasets with nested and flat entities:

  * CoNLL-2003
  * ACE-2004
  * GENIA
* Achieves competitive or better performance, especially in complex cases with nested entities.

---

### ✨ Impact

* Provides a flexible framework for NER beyond BIO tagging.
* Natural extension to nested and overlapping entity recognition.
* Bridges parsing and NER communities.

---

### 🔗 Related Concepts

* Dependency parsing (biaffine parsers)
* Span-based NER (e.g., Luan et al. 2019)
* Discontinuous and nested NER

---

### 📃 Citation

Wang, B., & Lu, W. (2020). *Named Entity Recognition as Dependency Parsing*. In Proceedings of the 58th Annual Meeting of the Association for Computational Linguistics (pp. 6470–6476).
