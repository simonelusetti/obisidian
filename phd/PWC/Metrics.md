We need to measure how good our system at two things: finding **mentions** and **matching** them correctly
## Mentions

Roughly, there are two options:
1. Supervised: evaluate our NER model on an external labelled dataset
	- Pro: perfect knowledge of the gold labels
	- Con: highly domain dependent, cannot use directly on our own data
2. Unsupervised:
	- Pro: can be tailored to our own data
	- Con: unreliable, must use proxy labels

Nothing to say about supervised Just use the the closest dataset to our data (wikiann is a popular one)
#### Unsupervised: Proxy labels 

To evaluate mention detection with no gold labels we use must use proxy positives/negatives. The key question is "how do we find good proxies?"

Current proxies ideas:
- Proxy Positives (P+)
    1 Recipients: names in the To/CC headers. The idea is if they appear in the text, they should be extracted. Doesn't mean that an email **must** contain the name of the sender/recipient/cc, but if does it **should** be marked as an entity
    2 Seen Elsewhere: mentions that appear in multiple emails — if they reappear, they should be extracted again. AKA if an email contains the name "Daniel" and two other emails have that same word marked as an entity, that should also be one
- Proxy Negatives (N−)
    - Mentions extracted that are not in any other email AND are not nodes in the graph. This is the weakest part of our theory: it's perfectly reasonable for a single email to mention someone not in the graph and still be an entity

Metrics reported ($TP$ = True Positives, $FP$ = False Positives, $FN$ = False Negatives):
- Precision = $TP / (TP + FP)$
- Recall = $TP / (TP + FN)$
- F1 = harmonic mean of precision and recall
- Counts of $TP, FP, FN$
## Matching 

Check whether matched entities and clusters are consistent, stable, and plausible. This does not require gold labels since it’s about system self-consistency

Mention Statistics:
- Count of mentions per status (exact, fuzzy, excluded, no_match, ...)
- Total number of mentions processed
- Just a statistic really, not much use to evaluate the system but useful

Fuzzy Score Analysis
- Number of fuzzy matches: useful by comparison to exact and unmatched mentions. Can tell us if we are being to harsh on the matching threshold
- Mean fuzzy score: tells us how close fuzzy-matched entities are (closer is better)

Cluster Quality
- Number of clusters (good indicator on its own)
- Average cohesion (similarity within clusters)
- Average separation (distance to other clusters)  
- Ratio of small clusters (size <= 2) 
- All of the above can give a "gut check" to our system. If we have a LOT of small clusters we might be overfitting them

Instability Check
- Detects when the same surface form (eg "john") maps to multiple person IDs
- Reports unstable mentions and count

Round-Trip Check
- Build up from instability check: compares mention surface with canonical matched name using token overlap
- Reports average similarity and flags suspiciously low-similarity matches (<0.3)

Synthetic Probe
- Sanity test on exact matches:
	- OK → status = exact match which we can also find on the graph
	- Wrong → status =  exact match but missing node, probably a person not in the graph
	- Missed → status = no_match for a name we have. Basically a repeat of the FN, a lot could mean we are being too harsh on the matching threshold
