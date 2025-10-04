## Problem Definition

We want to find a **binary mask** over tokens in a sentence that indicates **which tokens are named entities**, without using any labeled data

- Given a sentence of length $L$, $X=(x_1,x_2,…,x_L),x_j\in R^d$
- We seek a mask: $z_j\in \{0,1\},\ j=1,…,L$
where $z_j=1$ means token $j$ is important (likely an entity)

If we had a model $F(X)$ that classifies the sequence according to some task (sentiment analysis for example), we could train a model $f(x_i)$ that takes a single token and returns a probability $p_i$ that the token is important. To train the latter we simply pass the entire sequence, sample according the $p_i$ (i.e. mask those that are predicted 0) and see if $F(X)$ is still able to correctly classify the whole sequence

So: 
1. Start from $X=(x_1,x_2,…,x_L)$ with a label $y$
2. Pass each $x_i$ through $f(.)$ to get $p_1,p_2,...,p_L \in [0,1]$
3. Sample each $p_i$ (Bernoulli RV), get a binary mask 
4. Apply binary mask to $X$, get $X'$
5. See if $F(X) = F(X')$ (plus some other regularization)

**Problem:** step 3, where we sample, is non differentiable
We could use something like REINFORCE but it's messy and noisy

The first idea is to simply relax the Bernoulli distribution (which is hard 0 or 1) into a continuously valued one in $[0,1]$, an example is the Beta Distribution:
$$
p(x;a,b) = \text{some-constant}\ \cdot x^{a-1}(1-x)^{b-1} \quad a,b >0
$$
Which has the nice property of (with the right $a,b$) having sort of "U shape" with most of its mass concentrated around 0 and 1. However, this distribution has no closed form cumulative inverse (which we need for the reparameterization trick)

Enters the **Kumaraswamy distribution:**
$$
p(x;a,b) = ab x^{a−1}(1−x^a)^{b−1} \quad a,b>0
$$
Which has a Cumulative Distribution Function of $F(u;a,b)=1−(1−u^a)^b$ with a simple inverse $u = (1−(1−v)^{1/b})^{1/a}$, meaning we can easily apply the reparameterization trick by drawing $v \sim U(0,1)$ and using the inverse formula 

Defining $z_i=\mathbb{1}[u_i>t]$ (where $t$ is a threshold) we then:
- use $z_i$ to select in the forward pass, hard selection which doesn't simply scale tokens like a soft distribution would
- use $u_i$ in the backward pass, soft selection through which gradient can flow

The actual trained model is a function of the tokens which for each $x_i$ returns $a_i,b_i$ which are used to determine its importance (since they give its probability of being selected)

While this is the main idea, HardKuma also applies some regularization terms. The actual full loss of the model has four terms:
- **Task:** $-\log p_\theta (y\ |\  X')$  (essentially $F(X) \simeq F(X')$)
- **Sparsity:** $\lambda_s E(\sum_i z_i)$ (ensuring not a lot of tokens are selected)
- **Continuity:** $\lambda_c \sum_i |z_i - z_{i-1}|$ (making span like selections)
- **Expected selection constraint:** $\lambda_e (E(z)-\pi)$
	- which basically pushes the selected tokens to align with a distribution $\pi$ which we desire a priori

