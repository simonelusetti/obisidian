---

---

## Objective

**Data:**
- We have a corpus of emails, with metadata (sender, receiver, cc, ...), "hard links"

**Problem:**
- Emails' texts refer to people not in the metadata (missing "soft links")

**Solution:**
- Use NER to enrich the Graph with "mentioned" edges


---

## Architecture

1. Read Emails from Graph
2. NER Model: Extract entities
3. Match Model: match text entities with graph node
4. Merge Model: merge similar entities into possible new nodes

All of these model can be upgraded individually

---

## Entity Extraction 

- **spaCy** (`en_core_web_lg`)
- Extract `PERSON` entities

Currently very simple, supervised model

---

## Matching Model

- **Normalization** (case, accents)
- **Fuzzy matching**: score mentions' *closeness*

- **Clustering**:
    - _Close clusters_ → auto-merge
    - _Maybe clusters_ → user confirmation

---

## Fuzzy Matching
- **Score:** matches are often not literal
	- Typos, shortening, different spelling

- Score them based on syntactic closeness
$$\text{score}(a,b)=\frac{2\| a \cap b \|}{\|a\|+\|b\|}$$
---

## User Decisions

Capitalize on user's knowledge:
- **Matching:** *are these two close mentions actually the same?*
- **Nicknames:** *this entity is often referred as ...*


---

## Example

**Email:** "Meeting with _Jon Doe_ and _Giovanni Rossi_." (Not sent to either of them: no hard link)
**Nodes in Graph:** John Doe, Giovanni Rossi

**Matches:**
- `Jon Doe` → John Doe (fuzzy 92%)
- `Giovanni Rossi` → exact

**Neo4j result:**

```
(:Email)−[:MENTIONED]−>(:Person{name:"JohnDoe"})
(:Email)−[:MENTIONED]−>(:Person{name:"GiovanniRossi"})
```

--- 

## Next Steps

- **Contextual Matching:** 
	- matching currently uses the entity itself
	- the rest of the email may be embedded as "context"
- **Unsupervised Model:**
	- Current SpaCy model is trained on different domain dataset
	- Unsupervised models could be trained on our corpora itself