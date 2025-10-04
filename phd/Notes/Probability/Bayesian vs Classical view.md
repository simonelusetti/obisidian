There are roughly two types of statistical problems. Consider the same setup where we have a signal $S$ that gets amplified by $a$ and corrupted by noise $N$, getting an observation of $X$. So
$$ X = aS+N$$
- **Model Building:** we know $S$ along with the nature of $N$, and want to know $a$
- **Estimation:** we know $a$ along with the nature of $N$, and want to know $S$

To solve these problems we can take two philosophical approaches:
- **Classical:** $S$ is actually $s$, meaning not a RV but a number that (while unknown) is fixed
- **Bayesian:** $S$ is truly a RV

In Hypothesis Testing we want, starting from some data $x$ with a known $p(x)$, to know the most probable $p(\theta\ |\ x)$, to do so we consider Bayes rule:
$$ p(\theta\ |\ x) = \frac{p(\theta)p(x\ |\ \theta)}{p(x)}$$
We assume a known $p(\theta)$, we know $p(x)$, and we have a **model** that explains the data from the parameters, AKA we know $p(x\ |\ \theta)$

After doing some calculations we find $p(x\ |\ \theta)$, however this is a function, not a value of $\theta$, which one should we choose?
- **Maximum a posteriori probability:** the value of $\theta$ with the highest probability, can only be used in the case where $p(x\ |\ \theta)$ is discrete (so not a $f(x\ |\ \theta)$)
- **Conditional expectation:** if we have a continuous distribution $f(x\ |\ \theta)$, choosing a single value of $\theta$ from it is a bit silly, since all of them have probability 0. We can do an average:$$ E(\Theta\ |\ X) = \int \theta f(\theta\ |\ x) d\theta $$

