https://arxiv.org/pdf/2311.03658

# Concepts
We want to show that each concept is encoded as a direction in the embedding and unembedding space

**LLM preliminary concepts:** starting from context $x$, it gets embedded as $\lambda(x)$ then the output $y$ is sampled from $P(y | \lambda(x))$ which is $\propto \exp(\lambda(x)^T \gamma(y))$, where $\gamma(y)$ is $y$ in the unembedding space

**Concepts:** each semantic concept is given a direction, so we have male$\to$female and female$\to$male instead of simply male vs female. They are considered binary random variables $W$ where $W = 0$ would could be any male word such as king, man, actor while $W = 1$ could be queen, woman, actress and so on

**Representation:** given a concept $W$, if the vector $\gamma_w$ is such that $\gamma(W = 1) - \gamma(W = 0) \in$ Cone($\gamma_w)$ almost surely then $\gamma_w$ is the unembedding representation of $W$. AKA this vector encodes $W$ in the sampling space. 

>Note: when gamma has a number below, such as $\gamma_1$, it represent an unembedding vector living in $\Gamma$, the embedding space. A concept representation vector $\gamma_W$ lives in $\Gamma^-$ which is the space of all vector difference of vectors from $\Gamma$. Unless specified, we use $\gamma_W$ as the **canonical representation** of $W$, meaning that it's the vector in the direction of $W$ with length 1

For the embedding space we need a finer definition since we can't directly measure context, just how likely it is to produce a certain word. $\lambda_w$ is the embedding representation of $W$ if $\lambda_1 - \lambda_0 \in$ Cone($\lambda_w)$ for any $\lambda_1, \lambda_0$ that satisfy
$$ \frac{P(W = 1 | \lambda_1)}{P(W=1 |\lambda_0)} > 1 \quad \text{and} \quad \frac{P(W, Z| \lambda_1)}{P(W,Z |\lambda_0)} = \frac{P(W| \lambda_1)}{P(W |\lambda_0)}$$
For any concept $Z$ that is **casually separable** from $W$, aka is semantically unrelated
# Inner Product
If the LRH holds, then we have an idea of linear geometry in the context and sampling space, however this geometry would require an appropriate inner product, which we don't have. This is because the usual inner product is linearly variant while the softmax is linearly invariant

Let's say we apply this transformation to $\lambda$ and $\gamma$: $A^{-T}\lambda$, $A\gamma+B$. Let's put it in the softmax:
$$
\frac{\exp((A^{-T}\lambda(x))^T A\gamma(y)+B)}{\exp((A^{-T}\lambda(x))^T A\gamma(y)+B)}
$$
Since $(A^{-T}\lambda(x))^T A\gamma(y)+B) = \lambda(x)^T\gamma(y) +\lambda(x)^TB$, and since $\lambda(x)^TB$ averages out, this means that 
$$ \frac{\exp((A^{-T}\lambda(x))^T A\gamma(y)+B)}{\exp((A^{-T}\lambda(x))^T A\gamma(y)+B)} =  \frac{\exp(\lambda(x)^T \gamma(y))}{\exp(\lambda(x)^T\gamma(y))}$$
Meaning that despite applying this transformation, the softmax is the same as before. Because the model only learns by optimizing the softmax, the result is that the embedding and unembedding spaces are, semantically speaking, linearly invariant. This isn't true of the inner product since $\langle \gamma_W, \gamma_Z \rangle \neq \langle A\gamma_W, A\gamma_Z \rangle$

**Casual Inner Product:** we define a casual inner product to be any inner product such that $\langle \gamma_W, \gamma_Z \rangle_C = 0$ for all unrelated concepts $W,Z$

To find it we could create a lot of concepts and built it to make them all orthogonal, however it's way easier to consider that IF a inner product exists, then it must be $\langle \gamma_-, \gamma_- \rangle_C = \gamma_- ^T M \gamma_-^T$, where $M$ is a symmetric positive defined matrix and $\gamma_-$ is a vector of $\Gamma_-$. If there are $d$ mutually unrelated concepts $W_1,...,W_d$ such that their canonical representation $\gamma_{W_1}, ..., \gamma_{W_d}$ form a basis for $\Gamma^-$, then using $\gamma =  \gamma_{W_1} || ... || \gamma_{W_d}$ we have:
$$
M^{-1} = G G^\top \quad \text{and} \quad
G^\top \text{Cov}(\gamma)^{-1} G = D
$$
This works because the inverse covariance matrix whitens the statistical aspects of the space, averaging out colinear coordinates so that, by choosing $D = I_d$  we can arrive at:
$$\langle \gamma_-, \gamma_- \rangle_C = \gamma_- ^T \text{Cov}(\gamma)^{-1} \gamma_-^T $$
**Unification:** by choosing $A = M^{1/2}, B = 0$ in the linear transformation $l_w = A^{-T}\lambda$, $g_w = A\gamma+B$, and by virtue of the unification theorem, we see that $l_w = g_w$. AKA we have unified the embedding and unembedding spaces. In this transformed space, the Euclidian inner product is a casual inner product

# Experiments 

There are three concepts we want to prove:
- **subspaces:** concepts are directions in the embedding and unembedding spaces
- **measurement:** we can measure how likely a context is to produce a concept by measuring it against the concept's representation
- **intervention:** we can influence what a context will produce by adding the embedding representation of a concept

To demonstrate the first we take a lot of counterfactual pairs of different concepts: king and queen, king and roi, and so on. Then make an average of all their difference vectors (expect the i-th pair) and project the i-th pair onto it, then we do the same with differences of random words. The result is that the difference of counterfactual pairs are way more aligned than random pairs, proving the first theory

For the second we take two large corpuses of french and spanish words, compute the average difference to create their representation, then we plot their inner product against french and spanish words, vs doing the same with male and female words (of both languages). The result is that this inner product gives a meaningful information on the language of the words but tells us nothing about the gender. We can measure how "french$\to$spanish" a word is

Lastly, we take some contexts generated by ChatGPT that would induce the model to produce the word king, as opposed to queen, King or Queen (capitalization concept). Then we add the male$\to$female embedding representation vector, then do the same with capitalization and english$\to$french vectors. We plot the probability of producing capitalized King and uncapitalized queen and see that it meaningfully changes when adding their corresponding vectors. Nothing happens to these probabilities when adding the language vector, as we would expect if the LRH holds