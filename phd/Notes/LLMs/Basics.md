
## Vectorizing Words

We obviously cannot use words and sentences as they are, since they aren't vectors upon which we can do linear algebra. We could just send words to random vectors, but we would like for similar words to correspond to similar vectors to get a better representation

**Tokenization:** each word is actually composed of smaller, linguistically distinct pieces. For example *unbelievable* has:
- *un*: not, negation
- *believ*: main part of the word
- *able*: possible, capable  
So, starting from
$$  
\text{"It's unbelievable"}  
$$
Tokenization $using BPE for example$ might produce:
$$  
x = x_1, x_2, x_3 = \texttt{It}, \texttt{'}, \texttt{s}, \texttt{un}, \texttt{believ}, \texttt{able}  
$$
Each $x_t$ is an **integer index** into the vocabulary $V$.  If $|V| = 50,000$, then $x_t \in {1, \dots, 50,000}$.

**Embedding:** to get our meaningful vectors we define an **embedding matrix**:
$$  
E \in \mathbb{R}^{|V| \times d}  
$$
- $|V|$: vocabulary size e.g. 50k
- $d$: embedding dimension e.g. 4096 in GPT-3
Each row $E[i]$ is a learned vector representing token $i$ (we know them all)

For token $x_t$, its embedding is: $e_t = E[x_t] \in \mathbb{R}^d$
So our sentence becomes: $e_1, e_2, e_3, ...$ with each  $e_t \in \mathbb{R}^d$  

**Positional Encoding:** an important, later, part of an LLM is its transformer. They are positionally agnostic (they don't care about the positions of the tokens). We do, so we inject position information by **adding** a positional vector $p_t \in \mathbb{R}^d$.

Final input representation:
$$  
h_t = e_t + p_t  
$$
## Attention

The hearth of modern LLMs. Attentions allows the model to update every token based on each other token, giving context to words

We begin with the hidden representations of the input sequence at layer $l=0$:
$$
H^{(0)} =  \begin{bmatrix}  (h^{(0)}_1)^\top \  (h^{(0)}_2)^\top \  \vdots \  (h^{(0)}_T)^\top  \end{bmatrix}  \in \mathbb{R}^{T \times d}  
$$
where each row $h_t^{(0)} \in \mathbb{R}^d$ is the embedding (token + positional) of token $t$

Each layer $l$ has its own learned projection matrices:
$$
W^{Q,(l)},  W^{K,(l)},  W^{V,(l)} \in \mathbb{R}^{d \times d_k}  
$$
We compute the **query, key, and value** matrices for the entire sequence in one operation:
$$
Q^{(l)} = H^{(l)} W^{Q,(l)}, \quad  
K^{(l)} = H^{(l)} W^{K,(l)}, \quad  
V^{(l)} = H^{(l)} W^{V,(l)}  
$$
with $Q^{(l)}, K^{(l)}, V^{(l)} \in \mathbb{R}^{T \times d_k}$

**Attention Scores:** we compute scaled dot-product similarities between queries and keys:
$$
A^{(l)} = \frac{Q^{(l)} (K^{(l)})^\top}{\sqrt{d_k}} \in \mathbb{R}^{T \times T} 
$$
- Each entry $A^{(l)}_{ij}$ is the similarity between token $i$ (query) and token $j$ (key)
- For causal LMs, apply a **mask** (M) so that $A^{(l)}_{ij} = -\infty$ if $j > i$, meaning that each token can only "see" itself and earlier tokens, makes sense considering we do not want the model to see into the future

**Attention Weights:** normalize rows of $A^{(l)}$ with softmax:
$$
\tilde{A}^{(l)} = \text{softmax}(A^{(l)}) \in \mathbb{R}^{T \times T}  
$$
Now, each row $\tilde{A}^{(l)}_{i}$ sums to 1 and represents how token $i$ attends to all tokens

The new, contextualized, representation is a weighted sum of the value vectors:
$$
Z^{(l)} = \tilde{A}^{(l)} V^{(l)} \in \mathbb{R}^{T \times d_k}  
$$

**Multi-Head Attention:** with $m$ heads, we use independent projections $(W^{Q,(l)}_i, W^{K,(l)}_i, W^{V,(l)}_i)$ for each head, meaning that each head can model an independent type of contextual relationship

Each head produces:
$$
Z^{(l)}_i = \text{Attention}(H^{(l)} W^{Q,(l)}_i, H^{(l)} W^{K,(l)}_i, H^{(l)} W^{V,(l)}_i)  
$$

Then we concatenate the results and project back:
$$
\text{MHSA}(H^{(l)}) = [Z^{(l)}_1, \dots, Z^{(l)}_h] W^{O,(l)}  
$$
With $W^{O,(l)} \in \mathbb{R}^{m\cdot d_k \times d}$, bringing us back in to the proper dimension

**Residual Connection + Layer Normalization:** we add the MHSA output back to the input and normalize, with all the upsides of residual connections
$$
\tilde{H}(l)=\text{LayerNorm}(H(l)+MHSA(H(l))
$$
**Feed-Forward Network (FFN):** after giving context to each token, we pass it through a "normal NN" to update it's meaning, and also just to give the model more parameters to learn information with:

$$
\text{FFN}(x) = W^{2,(l)} \, \sigma(W^{1,(l)} x + b^{1,(l)}) + b^{2,(l)}$$
Note that this is applied to each token, for the whole sequence we have
$$
\text{FFN}(\tilde{H}^{(l)}) \in \mathbb{R}^{T \times d}
$$

**Second Residual + Normalization:** lastly we apply a second residual with the accompanying normalization:
$$
{H}^{(l+1)} + \text{LayerNorm}(\tilde{H}^{(l)}+\text{FNN}(\tilde{H}^{(l)}))
$$
After $L$ Transformer layers, we obtain the final hidden representations:
$$
H^{(L)} \in \mathbb{R}^{T \times d}  
$$

where row $h_t^{(L)}$ is the contextual representation of token $t$

**Projection to Vocab:** we map each hidden state to logits over the vocabulary:
$$
Z = H^{(L)} W^O + b,  
\quad W^O \in \mathbb{R}^{d \times |V|}, ;; b \in \mathbb{R}^{|V|}  
$$
- $Z \in \mathbb{R}^{T \times |V|}$
- Row $Z_t$ is the unnormalized logit vector for token $t$

**Softmax Distribution:** we convert logits into probabilities over the vocabulary:
$$  
P(x_{t+1} \mid x_{\leq t}) = \text{softmax}(Z_t)  
= \frac{\exp(Z_{t,v})}{\sum_{v'=1}^{|V|} \exp(Z_{t,v'})}, \quad v \in {1,\dots, |V|}  
$$
This gives a distribution over the next token. Then we can either select the most probable one, or (more commonly) sample this distribution to give a bit of variety to the output

**Loss Function:** the model is trained by minimizing **cross-entropy loss** between predicted distribution and the true next token:
$$
\mathcal{L} = - \sum_{t=1}^T \log P(x_t \mid x_{<t})  
$$
Equivalently, in matrix form:
$$
\mathcal{L} = - \frac{1}{T} \sum_{t=1}^T \sum_{v=1}^{|V|} y_{t,v} \log \big( \text{softmax}(Z_t)_v \big)  
$$
where $y_{t,v}$ is a one-hot vector indicating the true token at position $t$

Note that we train *everything* together:
- The Encoding's matrix
- The Transformer's matrices
- The FFNs between layers
Are all updated according to this last cross entropy: the gradient flows through the whole path from generation back to encoding