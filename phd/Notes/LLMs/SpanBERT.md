## SpanBERT: Improving Pre-training by Representing and Predicting Spans
authors: Mandar Joshi, Danqi Chen, Yinhan Liu, Daniel Weld, Luke Zettlemoyer, Omer Levy
date: 2020-01-18
paper: https://arxiv.org/abs/1907.10529
repo: https://github.com/facebookresearch/SpanBERT

---

## Abstract
SpanBERT is a variant of the BERT pretraining method specifically designed to better capture and predict spans of text. Instead of masking individual tokens as in BERT, SpanBERT masks contiguous random spans and introduces a span-boundary objective (SBO), which forces the model to predict masked content using only the representations of surrounding boundary tokens. These design choices result in substantial performance improvements, particularly on tasks involving span selection such as question answering and coreference resolution.

---

## 1. Introduction
Many key NLP tasks—such as extractive question answering (QA), coreference resolution, and relation extraction—require reasoning over spans of text rather than individual tokens. Traditional BERT, although powerful, masks and predicts single wordpieces independently, limiting its capacity to learn span-level semantics. SpanBERT addresses this limitation by modifying the pretraining process to mask spans of text and to explicitly train the model to reconstruct these spans from their contextual boundaries. Additionally, the model eliminates the next sentence prediction (NSP) objective, opting instead to train on full, contiguous single-sequence inputs.

---

## 2. Background: BERT
BERT (Devlin et al., 2019) uses two main objectives for self-supervised learning:

- **Masked Language Modeling (MLM)**: Randomly masks 15% of tokens from input sequence $X = (x_1, ..., x_n)$, and trains a model to predict each masked token $x_i$ from the rest:
  $$ \mathcal{L}_{MLM}(x_i) = -\log P(x_i | x'_i) $$
  where $x'_i$ is the contextual representation produced by the transformer.

- **Next Sentence Prediction (NSP)**: Given pairs of segments $(X^A, X^B)$, predict whether $X^B$ immediately follows $X^A$. This task aims to capture inter-sentence relationships, but recent studies and the SpanBERT paper suggest it may not provide significant benefit.

---

## 3. Model: SpanBERT

### 3.1 Span Masking
SpanBERT replaces BERT’s token-level masking with a **span-level masking strategy**. Instead of masking individual tokens independently, SpanBERT samples **contiguous spans** of words:

- Span length $\ell \sim \text{Geo}(p = 0.2)$, clipped at $\ell_{max} = 10$.
- Each sequence is masked until 15% of tokens are masked in total.
- For each span:
  - 80% of the time, all tokens are replaced with [MASK].
  - 10% with random tokens.
  - 10% left unchanged.

This sampling encourages the model to learn to reconstruct multi-token segments, promoting learning of span-level context and semantics.

### 3.2 Span Boundary Objective (SBO)
SpanBERT introduces a new auxiliary objective that requires reconstructing the masked span using **only the boundary tokens**. This encourages information about the internal span content to be compressed at the edges of the span.

Let $(x_s, ..., x_e)$ be the masked span, and let $x_{s-1}, x_{e+1}$ be the left and right boundary tokens. For each masked token $x_i$ in the span, we compute a contextual vector $y_i$ using:

$$
h_0 = [x_{s-1}; x_{e+1}; p_{i - s + 1}] \\
h_1 = \text{LayerNorm}(\text{GeLU}(W_1 h_0)) \\
y_i = \text{LayerNorm}(\text{GeLU}(W_2 h_1))
$$

Where $p_{i - s + 1}$ is a positional embedding relative to the left boundary.

The overall loss combines MLM and SBO:
$$
\mathcal{L}(x_i) = -\log P(x_i | x'_i) - \log P(x_i | y_i)
$$

This dual objective ensures that the model can predict span contents from both local context (MLM) and boundaries (SBO).

### 3.3 Single-Sequence Training
SpanBERT also removes BERT’s NSP objective. It uses only **single-sequence inputs**, i.e., contiguous blocks of up to 512 tokens sampled from the corpus. This improves context modeling and removes the noise introduced by pairing unrelated sentence segments.

---

## 4. Experimental Setup

### 4.1 Tasks

#### Extractive Question Answering
This task requires the model to identify the span of text within a given passage that answers a corresponding question. The passage $P$ and the question $Q$ are concatenated into a single sequence:
$$ X = [\text{[CLS]}] \, p_1 \, ... \, p_l \, [\text{SEP}] \, q_1 \, ... \, q_{l'} \, [\text{SEP}] $$

The \[CLS\] token provides a global representation and helps in tasks like answerability (e.g., in SQuAD 2.0 where some questions are unanswerable). For extractive QA, the model computes softmax distributions over all tokens for start and end positions:
$$ P_s = \text{softmax}(W_s H), \quad P_e = \text{softmax}(W_e H) $$
where $H$ is the sequence of hidden states from the transformer. The predicted answer is the span $(s, e)$ maximizing $P_s(s) \cdot P_e(e)$.

#### Coreference Resolution
Coreference resolution involves clustering mentions that refer to the same entity. Given a document, each span candidate $x$ is scored against all potential antecedents $y \in Y$:
$$ P(y) = \frac{\exp s(x, y)}{\sum_{y' \in Y} \exp s(x, y')} $$

The score $s(x, y)$ is computed by combining span-level scores and pairwise compatibility:
$$
s(x, y) = s_m(x) + s_m(y) + s_c(x, y) \\
s_m(x) = \text{FFNN}_m(g_x), \quad s_c(x, y) = \text{FFNN}_c(g_x, g_y, \phi(x, y))
$$

Here, $g_x$ and $g_y$ are span representations built from endpoint token embeddings and attention over internal tokens. $\phi(x, y)$ includes features such as distance and speaker information.

#### Relation Extraction (TACRED)
This task involves identifying the relation between two marked entities in a sentence. During input, the entities are anonymized by replacing them with special markers (e.g., \[SUBJ-PER\], \[OBJ-LOC\]). The \[CLS\] token is prepended and used to derive the final classification:
$$ y = \text{softmax}(W_{CLS} h_{CLS}) $$

The vector $h_{CLS}$ is the output embedding corresponding to the \[CLS\] token and is meant to aggregate sentence-level information, making it suitable for classification over the entire input.

#### GLUE Tasks
The GLUE benchmark includes several sentence- and sentence-pair classification tasks. Each input is encoded as:
$$ X = [\text{[CLS]}] \, s_1 \, [\text{SEP}] \, s_2 \, [\text{SEP}] $$
for sentence-pair tasks (like MNLI, QNLI, etc.), or just a single sentence for tasks like CoLA or SST-2.

The representation $h_{CLS}$ of the \[CLS\] token is again used to classify the input using:
$$ y = \text{softmax}(W_{CLS} h_{CLS}) $$

This approach allows uniform handling of tasks, relying on the \[CLS\] token to encode the necessary global information.

---

## 5. Related Work
- **SpanBERT vs BERT**: Improves span-level semantics with new objectives.
- **ERNIE**: Uses linguistic masking (e.g., entities) rather than random spans.
- **MASS, UNILM**: Encoder-decoder objectives for generation.
- **XLNet**: Autoregressive span masking, different architecture.
- **pair2vec**: Learns word-pair embeddings; SBO is more general and integrated into transformer.

---

## 6. Conclusion
SpanBERT redefines pretraining for span-based understanding by:
- Replacing token masking with **geometric span masking**
- Introducing the **Span Boundary Objective** to improve internal representation
- Using **single-sequence training**, removing NSP

These innovations enable significant gains in QA, coreference, and relation extraction without modifying model size or training data.

