## 📄 BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding

**Authors**: Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova
**Year**: 2019
**Link**: [arXiv:1810.04805](https://arxiv.org/abs/1810.04805)

---

### 🔍 Overview

BERT introduces a **deep, bidirectional transformer** model pretrained on large corpora using two objectives:

* **Masked Language Modeling (MLM)**
* **Next Sentence Prediction (NSP)**

It enables **fine-tuning** for downstream tasks with minimal task-specific architecture changes.

---

### 🧠 Key Ideas

#### ✅ Deep Bidirectionality

Unlike unidirectional LMs (e.g. GPT), BERT allows each token to **attend to both its left and right context** at every layer.

Problem: In standard language modeling, bidirectional attention would allow the model to “see” the word it’s trying to predict.

➞ **Solution**: Masked Language Modeling.

---

### 📚 Pretraining Tasks

#### 1. **Masked Language Modeling (MLM)**

Randomly mask 15% of the tokens in the input. The model must predict the original token.

```
Input: x = [x_1, ..., x_{i-1}, [MASK], x_{i+1}, ..., x_n]
```

Model predicts:

$$
\hat{x}_i = \arg\max_{v \in V} P(v \mid x_{\setminus i})
$$

Where:

* $V$ is the vocabulary.
* $x_{\setminus i}$ is the input with position $i$ masked.

To avoid training-test mismatch:

* 80% of the time: replace with \[MASK]
* 10%: replace with random token
* 10%: keep unchanged

#### 2. **Next Sentence Prediction (NSP)**

Task: Given two segments A and B, predict whether B follows A in the corpus.

$$
P(\text{IsNext} \mid A, B)
$$

Trained with a 50/50 mix of:

* Positive examples (B is next sentence of A)
* Negative examples (B is randomly sampled)

---

### 🔧 Input Representation

Each input is a single sequence packed as:

```
[CLS] A [SEP] B [SEP]
```

* Token embeddings: learned for each token
* Segment embeddings: distinguish A vs. B
* Position embeddings: learned positional information

Final input embedding for each token:

$$
E_i = TokenEmb_i + SegmentEmb_i + PositionEmb_i
$$

---

### 🔹 Fine-tuning

BERT is designed to be **fine-tuned** on specific tasks with minimal architecture change:

* Classification → use \[CLS] token output
* Token classification (e.g. NER) → use output at each token position
* QA → use start/end span predictions

---

### 📊 Model Architecture

* Based on **Transformer encoder** only
* Typically BERT-base has:

  * 12 layers
  * 768 hidden size
  * 12 self-attention heads
  * 110M parameters

---

### ✨ Impact

* Set SOTA on 11 NLP tasks when released
* Changed how models are trained: from scratch ➔ pretrain + finetune
* Widely adapted for many downstream tasks: QA, NER, sentence similarity, etc.

---

### 🔗 Related Concepts

* GPT: Left-to-right only (causal LM)
* ELMo: Concatenates left/right unidirectional LSTMs
* RoBERTa: BERT without NSP, trained longer

---

### 📃 Citation

Devlin, J., Chang, M. W., Lee, K., & Toutanova, K. (2019). *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*. arXiv preprint arXiv:1810.04805.
