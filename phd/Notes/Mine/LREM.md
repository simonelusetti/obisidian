# LREM: Loop Representation Embedding Module (Hypothetical)

**Goal**: Learn latent representations of entity loops to bias the model toward globally consistent entity predictions.

- **Entity structure** = closed loop of edges in the grid (HTW, NNW, PNW relations forming a cycle).
- Idea: Introduce **loop embeddings** as latent vectors that represent *prototypical entity structures*.

---

## 2. Challenges

- Loops are **not enumerable** like tags (no fixed number, variable size).
- Loop detection is the **goal** of the model; cannot rely on pre-identified loops.
- Must create a **soft, differentiable representation** of loops.

---

## 3. Proposed Solution: Soft Loop Prototypes

### 3.1 Edge Features

From TREM or baseline grid:
$$
G \in \mathbb{R}^{L \times L \times d}
$$
where $G_{ij}$ is the feature for edge (i → j).

---

### 3.2 Loop Prototypes

Define $K$ learnable **loop prototypes** $P \in \mathbb{R}^{K \times d}$.

Each prototype aims to represent a common structural pattern (e.g., continuous loop, discontinuous 3-node loop).

---

### 3.3 Prototype–Edge Attention

For each prototype $p_k$:

$$
\alpha_{k,ij} =
\text{softmax}_{ij}
\left(
\frac{p_k^\top G_{ij}}{\sqrt{d}}
\right)
$$

Aggregate edges into loop embedding $e_k$:

$$
e_k =
\sum_{i,j} \alpha_{k,ij} \, G_{ij}
$$

---

### 3.4 Edge–Prototype Interaction

Edges query loop embeddings to get structural feedback:

$$
\beta_{ij,k} =
\text{softmax}_k
\left(
\frac{G_{ij}^\top e_k}{\sqrt{d}}
\right)
$$

Update edge features:

$$
\tilde{G}_{ij} =
G_{ij} +
\sum_k \beta_{ij,k} e_k
$$

---

### 3.5 Word/Tag Integration (Optional)

- Words and tags can also attend to loop embeddings:
  - **Word–Loop Attention**: Word embeddings query loop prototypes to see if they belong to loops.
  - **Tag–Loop Attention**: Tag embeddings align with loop prototypes to ensure compatible tag combinations.

---

## 4. Prediction and Loss

- Primary task: **edge classification** (NNW, HTW).
- Auxiliary **loop regularization**:
  - Encourage prototype embeddings to match valid loops (derived from gold entities).
  - Contrastive or binary cross-entropy loss:
$$
\mathcal{L}_{loop} =
\text{BCE}(\text{predicted loop activations}, \text{gold loops})
$$

Total loss:
$$
\mathcal{L} =
\mathcal{L}_{grid} +
\lambda \mathcal{L}_{loop}
$$

---

## 5. Advantages

- **Global structural bias**: Loops encode entity-level patterns beyond local edges.
- **Soft, differentiable**: No discrete cycle detection required.
- **Complementary to TREM**: Tags handle edge semantics; loops handle holistic entity structure.

---

## 6. Open Questions

- How many prototypes $K$ are optimal?
- Should prototypes specialize by **loop size** (2-word vs 3+ words)?
- How to design the **auxiliary loop loss**:
  - Direct BCE on gold loops?
  - Contrastive learning (valid vs invalid cycles)?
- Can prototypes handle **nested or overlapping** entities?

---

## 7. Relation to Current Work

- Extends **loop repair** idea: instead of post-hoc fixing edges, learn loop structure **during training**.
- Could unify:
  - Tag embeddings (local semantics)
  - Loop embeddings (global structure)

---
