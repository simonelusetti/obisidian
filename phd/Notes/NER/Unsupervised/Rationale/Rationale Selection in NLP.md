
Rationale selection is about identifying **subsets of input text** (tokens or spans) that are **sufficient and necessary** for a model’s prediction.  
Two main goals:
- **Faithfulness**: the rationale truly drives the model’s decision.  
- **Plausibility**: the rationale looks reasonable to humans.  

---

## Main Approaches

### 1. Post-hoc Attribution
- **What**: Explanations after training (gradients, Integrated Gradients, SHAP, attention).
- **Pros**: Easy to apply, widely used.  
- **Cons**: Often not faithful, unstable.  
- **Status**: Most common in practice, weaker rigor.

### 2. Select-then-Predict
- **What**: Train a selector to mask tokens → predictor sees only selected tokens.  
- **Techniques**:  
  - Hard binary selection (REINFORCE, Lei et al. 2016).  
  - Differentiable relaxations (Gumbel-Softmax, **HardKuma**).  
- **Pros**: Enforces causal faithfulness.  
- **Cons**: Harder training, more complex.  
- **Status**: Most effective for faithful rationales.

### 3. Span-based Structured Rationales
- **What**: Select contiguous spans instead of isolated tokens (CRFs, continuity constraints).  
- **Pros**: Cleaner, human-friendly rationales.  
- **Cons**: Less flexible than token-level.  
- **Status**: Growing in popularity, useful for entity-like tasks.

### 4. Weakly-supervised Rationales
- **What**: Use human highlights or lexicons to guide rationales.  
- **Pros**: Improves plausibility, human alignment.  
- **Cons**: Needs annotations; may bias model.  
- **Status**: Effective in niche domains (healthcare, legal).

### 5. Contrastive / Causal Rationales
- **What**: Evaluate rationales by testing causal effect (mask rationale only vs. mask everything else).  
- **Pros**: Strongest evaluation of faithfulness.  
- **Cons**: Rarely used for training.  
- **Status**: Gold standard for evaluation.

---

## Usage vs Effectiveness

| Method                  | Usage (commonness) | Effectiveness (faithfulness) |
|--------------------------|---------------------|------------------------------|
| Post-hoc attribution     | ⭐⭐⭐⭐              | ⭐⭐                          |
| Select-then-predict      | ⭐⭐                | ⭐⭐⭐⭐                        |
| Span-based structured    | ⭐⭐                | ⭐⭐⭐                         |
| Weakly-supervised        | ⭐                  | ⭐⭐⭐ (when annotations exist) |
| Contrastive evaluation   | ⭐⭐⭐ (for eval)    | ⭐⭐⭐⭐ (as test criterion)     |

---

# Comparison of Select–Then–Predict Rationale Models

| Method & Year                  | Selector Mechanism                        | Predictor Type         | Benchmarks/Datasets                   | Performance Highlights                                                                 | Current Status |
|--------------------------------|-------------------------------------------|------------------------|---------------------------------------|-----------------------------------------------------------------------------------------|----------------|
| **Lei et al. (2016)**          | Bernoulli mask, trained with REINFORCE     | Classifier (sentiment, aspects) | SST, BeerAdvocate (multi-aspect reviews) | Comparable accuracy to full-text using ~10–20% tokens; rationales interpretable but training unstable (high variance). | Historical baseline; unstable, rarely used now. |
| **Gumbel-Softmax Rationalizer**| Gumbel-Softmax relaxation (soft mask)      | Classifier             | SST, BeerAdvocate                     | Stable training, accuracy close to full-text; rationales can be fuzzy without temperature tuning. | Transitional; less used today. |
| **HardKuma (2019)**            | Kumaraswamy relaxation + thresholding      | Classifier, NLI models | SST-5, BeerAdvocate, SNLI             | Near full-text accuracy with ~30–40% tokens; <1% drop on SNLI with ~90% sparsity; rationales are contiguous spans. | Strong baseline; still highly competitive for faithful rationales. |
| **A2R (2021)**                 | Relaxed selector + auxiliary soft predictor| Dual predictors (soft + rationale-only) | SST, ERASER benchmark (multiple datasets) | Maintains task accuracy; rationales more human-aligned; solves interlocking problem. | SOTA for balancing faithfulness + plausibility. |
| **FR, MGR, etc. (2022–2024)**  | Structured/multi-generator rationales      | Classifier (multi-task)| ERASER benchmark (Movies, MultiRC, FEVER, etc.) | Higher comprehensiveness/sufficiency scores; better overlap with human annotations; more robust to spurious correlations. | Recent SOTA; strong rationale quality, competitive accuracy. |

---

## Key Takeaways
- **Task Accuracy with Sparse Input**: HardKuma remains among the strongest, e.g., SST-5, BeerAdvocate, SNLI.  
- **Faithfulness + Plausibility**: A2R and newer rationalizers (FR, MGR) perform best on **ERASER** rationale benchmarks.  
- **Stability**: Relaxation-based approaches dominate; REINFORCE-based selectors are mostly historical.  
- **Evaluation Landscape**:  
  - **SST/BeerAdvocate** → sentiment/aspect classification with gold rationale spans.  
  - **SNLI** → natural language inference with sparse attention rationales.  
  - **ERASER** → multi-dataset benchmark explicitly for evaluating rationale sufficiency/comprehensiveness and human overlap.  
