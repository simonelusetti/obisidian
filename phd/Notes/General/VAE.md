We want to describe observed phenomenons $f$ as results of particular latent variables $z$. The phenomenons could be images or sentences, with latent variables describing subjects. We know that
$$
p(x) = \int p(x,y)dz = \int p(x|z)p(z)dz
$$
Where: 
- $x$ observed data
- $z$ latent variable
- $p(z)$ priori over latent (we choose this depending on our understanding or needs)
- $p(x|z)$ this is a generative model (a decoder) we design

Using latent variables allows us to compress information, allowing classification and generation on particular structure

The only thing we have is $x$, so we want our model have a $p(x)$ very high. We use the $\log p(x)$ for computational efficiency:
$$
\log p(x) = \log \int p(x,z)dz
$$
**Problem:** good luck doing this integral, especially if $z$ is high dimensional and continuous

We can work around this by modeling the true $p(z|x)$ (which we also don't know) with an encoder $q_\psi (z|x)$ (parametrized by $\psi$). Multiply and divide by this on the equation above

$$
\log p(x) = \int q_\psi (z|x) \frac{p(x,y)}{q_\psi (z|x)}
$$
Applying Jensen's inequality
$$
\log p(x) \geq E_{q_\psi (z|x)} \left[ \log \frac{p(x,y)}{q_\psi (z|x)}\right]
$$
Which we can simplify into the Evidence Lower Bound (ELBO)
$$
E_{q_\psi (z|x)}[\log p(x|z)] - KL(q_\psi (z|x)\  ||\  p(z))
$$
The two terms encourage:
- **Reconstruction:** from a given latent variable we should get a good observable event
- **Regularization:** the latent variable (given a particular observation) should behave close to our prior
We can then train to maximize this (or conversely minimizing the negative of this)

> **Unsupervised Classification:** if we consider $z$ to represent a sort of hidden structure that we want to classify (what's in this image, what is this passage talking about) training the model and getting a good $p(z|x)$ is all we need
> 
> **Problem:** $z$ could literally be anything, not necessarily the structure we want to classify

**Multi-Latent Extension:** we could try to solve this by considering multiple aspects of our variable: 
- $s$ represent the subject of the picture
- $p$ the pose (left, right, upward, ...)

Doing all the computation above we would get a multi-variate ELBO:
$$
E_{q_\psi (s,p|x)}[\log p(x|s,p)] - KL(q_\psi (s|x)\ ||\ p(s)) - KL(q_\psi (p|x)\ ||\ p(p))
$$
# Entanglement Problem
By default there's nothing forcing $s$ to actually represent the subject and $p$ the pose

Let's say that $z$ is the combination of these two: $z = [s,p]$, for any **entangled factor** (an invertible linear transform A (a matrix)) we get $z' = Az$, AKA we have "mixed" subject and pose info

However both $z$ and $z'$ can produce the same exact distribution $p(x)$ no problem. So we are never sure $s,p$ represent what we actually want

> **Locatello's Theorem (simple version):** Given a generative model $x=g(z)$ with independent factors $p(z)=\Pi p(z_i)$  there exist infinitely many transformations $A$ that mix the factors into $z' = Az$ such that $x=g'(z')$ reproduces the same distribution $p(x)$

Not all is lost! The impossibility result applies only if:
- We have a single observational distribution
- No additional structure, priors, or auxiliary signals

But first, how do we know if we have disentangled or not? We can measure it with:
- **Mutual Information:** $I(s,p)$ should be low
- **Total Correlation:** $TC(z) = KL(q(z) \ ||\ \Pi q(z_i))$ should also be low, since it would mean that the dimensions are independent




