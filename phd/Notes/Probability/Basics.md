## Axioms
We call $\Omega$ the space of all **Events**, which are just subset of it $A \subseteq \Omega$ 

Axioms:
- $P(\Omega) = 1$ (something must happen)
- $P(A) \geq 0$ (no negative probability)
- If $A \cap B = 0$ then $P(A \cup B) = P(A) + P(B)$ 

Note how there's no axiom that states $P(A) \leq 1$, however we can get it from the other three:
$$
1 = P(\Omega) = P(A \cup A^C) = P(A) + P(A^C) \implies P(A) = 1 - P(A^C) \leq 1
$$
This trick doesn't work on infinite (countable) events, where we need another axiom
$$
P(A_1 \cup A_2 \cup \ ...\  \cup A_k \cup\  ...) = P(A_1) + P(A_2) + \ ...\ + P(A_k) +\ ...
$$
For $\{A_i\}$ disjointed

Note that the events being countable is important: consider $\Omega$ = unit square, AKA $\Omega = U_{x,y} (x,y)$ where $0 \leq x,y \leq 1$, we get:
$$
1 = P(\Omega) = P(U_{x,y} (x,y)) = \sum_{x,y} P(x,y) = \sum_{x,y} 0 = 0
$$
This is why having probability 0 is different than being impossible: any point in the unit square has probability 0, but they could still be chosen at random

## Bayes Rule

**Conditional probability:** $P(X,Y) = P(X|Y)P(Y)$
**Sum Rule:** for a partition of space $\{C_i\}$ we have $P(A) = \sum_i P(A,C_i)$ 
Together we get **Law of Total Probability**: $P(A) = \sum_Y P(X|Y)P(Y)$ 

**Bayes Rule:** $P(A|B) = P(A,B)/P(B)$, since $P(A,B) = P(B,A) = P(B|A)P(A)$ we get
$$
P(A|B) = \frac{P(A)}{P(B)} P(B|A)
$$
Where
- $P(A|B)$ is the **Posterior**
- $P(A)$ is the **Prior**
- $P(B)$ is the **Marginal**
- $P(B|A)$ is the **Likelihood**
## Central Tendency

There are many ways to ask "how tall is a person typically?":
- **Mean (Average):** $\frac{1}{|\{H_i\}|}\sum_i H_i$  
- **Median:** the value that has half the dataset above and below it
- **Mode:** most popular value in the dataset
## Measures of Dispersion

How compact is our dataset?
- **Range:** the diameter of our dataset
- **Variance:** the square of the **Standard Deviation**, $\sigma^2 = \sum_i (H_i - \mu)^2$ 
## Counting

We have $n$ elements:
- how many ways of ordering them (**permutations**)?
	- First we choose one from all $n$, then one from the remaining $n-1$, and so on, we get $n!$ possibilities
- how many different subsets? 
	- For each element we have two choices: either include it in the subset or not: we get $2^n$ possibilities
- how many subsets of $k$ elements?
	- First we consider how many ordered $k$-sized subsets we have: $n(n-1)...(n-k)$, which is $n!/(n-k)$
	- But we don't care about ordering so we divide by the numbers of possible ordering of $k$ elements, so we divide by $k!$
	- We get $\left(\frac{n}{k}\right)$ = $\frac{n!}{k!(n-k)!}$ called **binomial coefficient**
- more generally, if we have $n_1, n_2, ..., n_r$ numbers that add up to $n$, how many ways can we partition the set of $n$ elements so that each partition has those cardinalities?
	- First we get $\left(\frac{n}{n_1}\right)$, then the remaining choices are $\left(\frac{n-n_1}{n_2}\right)$ and so on
	- A lot of divisions happen if we expand the definition of the binomial coefficient, remaining with $\frac{n!}{n_1!n_2!...n_r!}$ 

## Random Variables

It's a bit unwieldy to use events directly, we'd like to have a numerical representation for them, a function $\Omega \to R$. Such a function is called a **random variable**

From this we can ask *what is the likelihood that we get an event that result in the random variable $X$ having a particular value $x$?* If such value is $x$ we define its **probability** as $p(x)$ or $P(X = x)$

From our axioms we get:
- $p(x) \geq 0$
- $\sum_x p(x) = 1$

### Expectation
**Expectation (or expected value):** defined as $\sum_x p(x)\cdot x$ it's the "center of mass" of a particular probability 

>Note: a function of a random variable, such as $g(X)$ is also a random variable
>Example: $X$ is the result of a d6, $g(x) = 2x = Y$, meaning that $Y$ is the 2\*d6

**Law of the unconscious statistician:** The expectation of $Y = g(X)$ then simply: $E(Y) = \sum_x p(g(x))\cdot g(x)$, meaning that we don't need to find $p(y)$

Note that in general $E(g(X)) \neq g(E(x))$

For constants $\alpha, \beta$ we get: $E(\alpha X + \beta) = \alpha E(X) + \beta$, meaning that if $g(.)$ is a linear function than it is true that $E(g(X)) = g(E(x))$

**Second Moment:** (of a random variable $X$) is defined as $E(X^2)$

**Variance:** (of a random variable $X$) is defined as $var(X) = E(\ (X-E(X))^2\ )$, expanding:
$$
E(\ (X-E(X))^2\ ) = \sum_x (x-E(x))^2 p(x) = E(X^2) - E(X)^2
$$
Properties:
- $var(X) \geq 0$
- $var(\alpha X + beta) = \alpha^2 var(X)$

**Law of total expectation:** we know that $E(X) = \sum_x p(x)x$ and $E(X|Y=y) = \sum_x p(x|y)x$ 
Let's consider $E(E(X|Y))$:
$$
E(E(X|Y)) = \sum_y E(E(X|Y)) p(y) y= \sum_y (\sum_x p(x|y)x) p(y) y = \sum_x \sum_y p(x,y)x =  
$$
$$
= \sum_x \sum_y p(x,y)x =  \sum_x(\sum_y p(x,y))x = \sum_x p(x) x = E(X)
$$
So $E(E(X|Y)) = E(X)$

**Multiple RV:** if we have two random variables $X,Y$ we call them independent if $P(X|Y) = P(X)$ 

In general $E(g(X,Y)) \neq g(E(X),E(Y))$, but there are exceptions:
- if $g(.)$ is linear
- if $X,Y$ are independent then $E(XY) = E(X)E(Y)$ and $E(g(X)h(Y)) = E(g(X))E(h(Y))$ 


