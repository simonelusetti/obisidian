Trying to solve the problem of [[VAE#Entanglement Problem|entanglement]]  

First we must find a satisfying definition of **disentangled representation**, which [[https://arxiv.org/pdf/1812.02230|this paper]] provides: 

> *A vector representation is called a **disentangled representation** with respect to a **particular decomposition of a symmetry group into subgroups**, if it decomposes into independent subspaces, where each subspace is affected by the action of a single subgroup, and the actions of all other subgroups leave the subspace unaffected*

AKA we can only define disentanglement starting from a symmetry group that is already decomposed into subgroups with specific subactions

> **Example:** let's say we have a 2D object with position (x,y) and a color (a scalar in greyscale). A valid symmetry group is the one that moves the object in its area (pacman effect on the edges) and changes its color. Obviously, this group (with its actions) can be subdivided into subgroups: move along x, move along y, change color. If we find a latent representation that can be divided into subspaces where each one is changed by one and only one action we have a disentangled representation

Similarly, we can make this representation linear:

> *A vector representation is called a **linear disentangled representation** with respect to a particular decomposition of a symmetry group into subgroups, if it is a disentangled representation with respect to the same group decomposition, **and the actions of all the subgroups on their corresponding subspaces are linear***

Note that a certain symmetry group may be decomposed into subgroups that have a non obvious relation to real world actions. In our example *move along x, move along y* subgroups may become different *move along vector v, move along vector w* actions. However we assume that real world structures have a **natural decomposition** that will arise on its own

**Formal definition:** We have:
- A group action $\cdot : G \times X \to X$ 
- Group $G$ decomposes as a direct product $G = G_1 \times G_2$
- We are going to refer to the action of the full group as $\cdot$, and the actions of each subgroup as $\cdot_i$
The action is **disentangled** (with respect to the decomposition of $G$) if there is a decomposition $X = X_1 \times X_2$, and actions $\cdot_i : G_i × X_i → X_i, i \in \{1,2\}$ such that
$$(g_1, g_2) \cdot (v_1, v_2) = (g_1 \cdot_1 v_1, g_2 \cdot_2 v_2)$$
If $X$ is a space with some structure (vector space, topological space) we would like to keep it. Note that, for vector spaces specifically, even if the subactions decompose $X$ into $X_1, X_2$, its not necessary for them to have basis that align neatly with subsets of the basis of $X$. We will still indicate $X = X_1 \bigoplus X_2$ 

> **Example:** if $X = R^2$ then $X_1,X_2$ might be *move along (1,0), move along (0,1)* but can easily be  *move along (1,1), move along (1,-1)*. Both correctly decompose $X$

## Representation
Let's see how the structure of the world reflects on the agent's internal representation

We have:
- **W:** the world state set (importantly, it need only be a set)
- **b:** generative process $W \to O$ that produces observations from the world state (pixels from actual objects, for example)
- **h:** an inference process where the agent maps observations to internal representations, AKA $h: O \to Z$ ($Z$ being a vector space) We consider $f: W \to Z, f = h \circ b$. 
- **G:** a symmetry group acting on the real word with action $\cdot$, AKA $\cdot : G \times W \to W$ 
We would like to find the corresponding action acting on $Z$, AKA we want $\cdot: G \times Z \to Z$ to satisfy:
$$
g \cdot f(w) = f(g \cdot w) \quad \forall g \in G, \forall w \in W
$$
This would define $f$ as a G-morphism or an equivariant map. Meaning that we can start from $G \times W$ and reach $Z$ in two different ways:
- $\cdot_W \to W, f \to Z$
- $id_G \times f \to G \times Z, \cdot_z \to Z$

Given a $f$ there's no guarantee of finding $\cdot_Z$, if $f$ is invertible we can simply define (noting $z = g(w)$) it as:
$$ g\cdot z = f(g \cdot f^{-1} (z))$$
In other cases, there's no obvious way, especially because different real world states may result in identical observations: $f(w_1) = f(w_2)$. For the rest we ignore these problems as other nerds seems to have them figured out

Given the definition of a representation, and of disentanglement, we can define Ian agent’s representation $Z$ has **disentangled** with respect to the decomposition $G = G_1 \times ... \times G_n$ if:
1. There is an action $\cdot : G × Z \to Z$,  
2. The map $f : W \to Z$ is equivariant between the actions on $W$ and $Z$  
3. There is a decomposition $Z = Z_1 \times ... \times Z_n$ (or $Z = Z_1 \bigoplus ... \bigoplus Z_n$ for vector spaces) such that each $Z_i$ is fixed by the action of all $G_j, j \neq i$ and affected only by $G_i$  
When $Z$ has additional structure (such as a vector space or topological space) then we may consider actions that preserve that structure (linear actions or continuous actions)

Note that while its not necessary for $W$ itself to decompose into $W_1, ..., W_n$ it's a natural assumption that we will keep

## Linear Disentanglement
We know consider the case where the action is linear, we have:
- **V:** a vector space
- $\bigotimes$: a tensor product between two vectors spaces representing all possible products of their elements
- $\cdot: G \times V \to V$: group action on $V$
- $\rho: G \to GL(V)$: linear group representation, mapping each element of the group to an invertible matrix in the general linear group of $V$ (basically allows us to describe group actions with linear algebra)
- $\rho_1 \bigoplus \rho_2$: direct sum of representations, allowing us to decompose the representation: $\rho(g)(v_1,v_2) = (\rho_1(g)v_1, \rho_2(g)v_2)$

We say that $\rho$ is **linearly disentangled** w.r.t. the decomposition $G = G_1 \times G_2$ if there are $V = V_1 \bigoplus V_2$ and representations $\rho_i: G_i \to GL(V_i)$ such that:
$$
\rho(g_1,g_2)(v_1,v_2) = (\rho_1(g_1)v_1, \rho_2(g_2)v_2)
$$
(which is basically the former definition with the constraint that the action needs to have a linear equivalent)

Similarly, if we talk about in terms of an agent representation, a **linear disentangled representation** is a $f: W \to Z$ that satisfies all the previous requirements and is linear, AKA is also a group representation $\rho: G \to GL(Z)$








