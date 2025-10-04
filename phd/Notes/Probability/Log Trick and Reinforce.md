## Log Trick

Let's say we have a loss function that's easier to express as an expectation of a cost function ($c(.)$) rather than a direct form:
$$
L(\theta)=\mathbb{E}_{s\sim p(s;\theta)}[c(s)]
$$
Where our examples $s$ have a probability $p(s|\theta)$ dependent on $\theta$. If we want to minimize it we have to find
$$
\nabla_\theta L(\theta)=\nabla_\theta \mathbb{E}_{s\sim p(s;\theta)}[c(s)] = \nabla_\theta \int c(s)p(s;\theta)ds = \int c(s)\nabla_\theta p(s;\theta)ds
$$
(where in the last step we have used dominated convergence to push $\nabla$ under the integral)

Good luck finding an analytic solution to that integral, it's usually fucked, especially for any real world application. As always, gambling could rescue us, if we found a way to turn this into an expectation we could use a Monte Carlo simulation to solve it (law of large numbers). Problem is $\int c(s)\nabla_\theta p(s;\theta)ds$ isn't an expectation, which is always in the form of $\int p(x)f(x)dx$ 

**Log-Trick:** We know that for all we have $\nabla_\theta f(\theta) = f(\theta)\nabla_\theta \log f(\theta)$, putting it inside the above equation we get: 
$$
\nabla_\theta L(\theta) = \int c(s)\nabla_\theta p(s;\theta)ds =  \int c(s) p(s;\theta) \nabla_\theta \log p(s;\theta)ds = \mathbb{E}_{s\sim p(s;\theta)} [c(s)\nabla_\theta \log p(s;\theta)]
$$
Meaning we have put it in expectation form, now we can sample with Monte Carlo. At this point we have **Reinforce**

> Note: Even then we don't *need* to use one, we can simply use the **reparameterization trick** to backpropagate:
> - $s=g(\varepsilon,\theta)$ as a smooth function
> - $\varepsilon \sim p(\varepsilon)$ independent of $\theta$ (usually easy)
> - $c(.)$ is smooth as well
> We get:
$$
L(\theta)=\mathbb{E}_{\varepsilon}[c(g(\varepsilon,\theta))]
\quad
\nabla_\theta L(\theta)=\mathbb{E}_{\varepsilon}\!\big[\nabla_s c(s)\,\nabla_\theta g(\varepsilon,\theta)\big]_{s=g(\varepsilon,\theta)}
$$
>Then derive $c$ w.r.t. $s$ and $s$ w.r.t. $\theta$

