# CycleNER: An Unsupervised Training Approach for Named Entity Recognition

**Authors**: Andrea Iovine, Anjie Fang, Besnik Fetahu, Oleg Rokhlenko, Shervin Malmasi  
**Conference**: The Web Conference (WWW), 2022  
**DOI**: https://doi.org/10.1145/3485447.3512012

---

## 🎯 Motivation

Named Entity Recognition (NER) is a core NLP task that supports applications like:

- Question answering
- Web search
- Dialogue systems
- Relation extraction

NER systems typically rely on supervised learning with token-level annotations, which are:

- Expensive to produce
- Time-consuming
- Domain-dependent and hard to scale

This paper introduces **CycleNER**, a method to train NER models **without any labeled data**. It only requires:

- A set of raw sentences (unannotated)
- A small, independent set of example entity mentions

---

## 🔁 Core Idea: Cycle-Consistency Learning

CycleNER defines two sequence-to-sequence functions:

- `S2E`: Sentence to Entity Sequence
- `E2S`: Entity Sequence to Sentence

These models are trained in a loop:

1. From a sentence `s`, generate an entity sequence `q'` using `S2E`
2. From `q'`, regenerate a sentence `s'` using `E2S`
3. Compare `s'` to the original `s` and compute a reconstruction loss
4. Do the reverse: from an entity sequence `q`, generate `s'` with `E2S`, and then extract `q'` from `s'` using `S2E`

This process is called **Iterative Back-Translation (IBT)** and enables learning without parallel data.

---

## 📦 Input Data Format

### Sentence Set (S)
- A collection of raw, unlabeled sentences
- May or may not contain entities

### Entity Sequence Set (Q)
- A collection of example entity sequences like:
  ```
  Amazon <sep> organization <sep> Jeff Bezos <sep> person
  ```
- Entities are labeled and separated by a special `<sep>` token
- Two types of sequences are used:
  - **GQ**: Ground-truth entities from annotated corpora
  - **SQ**: Synthetic sequences generated from embeddings

These sets do not need to be aligned or parallel.

---

## 🔄 Training Cycles

### S-Cycle: Sentence → Entities → Sentence

1. `q' = S2E(s)` (generate entities)
2. `s' = E2S(q')` (reconstruct sentence)
3. Minimize the sentence reconstruction loss:

$$
\mathcal{L}_\phi(S, S') = - \frac{1}{|S|} \sum_{s \in S} \frac{1}{|s|} \sum_{i=1}^{|s|} \log p(s_i = s'_i)

$$

- Only `E2S` model parameters ($ϕ$) are updated
- `S2E` output is non-differentiable in this cycle

---

### E-Cycle: Entities → Sentence → Entities

1. `s' = E2S(q)` (generate sentence)
2. `q' = S2E(s')` (reconstruct entities)
3. Minimize the entity reconstruction loss:

$$
\mathcal{L}_\theta(Q, Q') = - \frac{1}{|Q|} \sum_{q \in Q} \frac{1}{|q|} \sum_{i=1}^{|q|} \log p(q_i = q'_i)

$$

- Only `S2E` model parameters ($θ$) are updated
- `E2S` is fixed in this cycle

---

## 🧠 Implementation

- Both S2E and E2S are implemented using the **T5 Transformer** (text-to-text model)
- T5 is suitable because it can handle both sentence generation and sequence extraction tasks
- Training alternates between S-cycle and E-cycle

---

## 🧪 Experimental Setup

### Datasets:
- **CoNLL-2003** (news)
- **WNUT-17** (social media)
- **OntoNotes 5.0** (mixed domains)
- **BioCreative II** (biomedical, gene entities)

### Baselines:
- BERT (fully supervised)
- BERT-Matcher (weak supervision using gazetteers)
- NeuralHMM (unsupervised HMM)
- Lexical Matcher (surface matching)
- KALM (knowledge-augmented)

---

## 📊 Results (F1 Scores)

| Dataset     | CycleNER (GQ) | CycleNER (SQ) | BERT | SOTA |
|-------------|----------------|----------------|------|------|
| CoNLL       | 0.825          | 0.686          | 0.860| 0.943|
| WNUT        | 0.338          | 0.349          | 0.418| 0.585|
| OntoNotes   | 0.653          | 0.613          | 0.788| 0.927|
| BC2GM       | 0.415          | 0.380          | 0.681| 0.872|

- GQ: Ground-truth entity sequences
- SQ: Synthetic entity sequences
- SOTA uses supervised

---

## 🔍 Key Observations

- CycleNER performs competitively with supervised models using **no annotations**
- Adding more entity examples improves performance more than adding more sentences
- The **E-cycle loss** is a good indicator of NER performance and is used for early stopping
- CycleNER can sometimes identify **new, unannotated entities** based on context
- Limitations include:
  - Overgeneration in sentences without entities
  - Subword tokenization issues for rare terms (e.g., gene names)

---

## ✅ Contributions

- Reformulates NER as a **text-to-text task** using seq2seq learning
- Introduces a novel **cycle-consistent unsupervised training loop**
- Works without token-level annotations or parallel data
- Outperforms unsupervised baselines and approaches 70–80% of fully supervised models

---

## 📌 Future Directions

- Improve handling of entity-less sentences
- Use more advanced methods to generate synthetic entity sequences
- Incorporate soft attention or latent-variable modeling for better alignment

