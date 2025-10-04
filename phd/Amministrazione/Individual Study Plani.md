
| Teaching Title                                                                                                                                  | Lecturer                                          | Credits | Done |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------- | ---- |
| Corsi di Formazione Complementare per Dottorandi e Assegnisti                                                                                   | Ufficio Ricerca Internazionale                    | 6       |      |
| Bibliographic Research, Scientific Writing and Dissemination Tools: Techniques and Strategies                                                   | Ufficio Bibliometrico                             | 3       | X    |
| Explainable AI in the Neural Network Domain                                                                                                     | Piotr Andrzej Kowalski                            | 4       | X    |
| Semantic Approaches for Entity Resolution                                                                                                       | Donatella Firmani                                 | 1       |      |
| Using LLMs for Scientific English: Writing and Presenting                                                                                       | Adrian Wallwork                                   | 6       | X    |
| Labour market, intelligence and digital organization                                                                                            | Matteo RINALDINI (DCE)                            | 3       | X    |
| Sociosemiotic analysis and Sociology of Data. Examples from Data visualization to environmental and social phenomena                            | Federico MONTANARI (DCE)                          | 3       |      |
| Scalable data processing for data science                                                                                                       | Paolo MISSIER, University of Birmingham, UK       | 4       | X    |
| Multi-objective Optimization and Symbolic Regression                                                                                            | Veronica GUIDETTI, UNIMORE – FIM                  | 3       | X    |
| Computer Graphics in the Era of AI                                                                                                              | Fabio PELLACINI, UNIMORE – FIM                    | 3       |      |
| Complexity Theory, On-Line and Approximation Algorithms                                                                                         | Manuela MONTANGERO, Mauro LEONCINI, UNIMORE – FIM | 3       |      |
| **EDUCATIONAL ACTIVITIES WITHOUT EVALUATION:** List of other teachings, summer schools, tutorials, seminars that the student plans to attend... |                                                   |         |      |
| Summer School dedicated to LLMs                                                                                                                 | (Organizer not specified)                         | 8       | X    |
```dataviewjs
// script here
```
```dataviewjs
let file = dv.current().file.path;
let content = await app.vault.read(app.vault.getAbstractFileByPath(file));

let rows = content.split("\n").filter(l => l.trim().startsWith("|"));

let headers = rows[0].split("|").map(h => h.trim());
let creditsIdx = headers.indexOf("Credits");
let doneIdx = headers.indexOf("Done");
let nameIdx = headers.indexOf("Teaching Title");
let total = 0;

for (let i = 2; i < rows.length; i++) {
    let cells = rows[i].split("|").map(c => c.trim());
    let credits = parseFloat(cells[creditsIdx]);
    let done = cells[doneIdx] != "";
    if (done && !isNaN(credits)) {
        total += credits;
    }

    if (cells[nameIdx] == "Sociosemiotic analysis and Sociology of Data. Examples from Data visualization to environmental and social phenomena" && !done) {
    dv.paragraph("**DCE Course:** Sociosemiotic analysis and Sociology of Data");
    }
    
    if (cells[nameIdx] == "Corsi di Formazione Complementare per Dottorandi e Assegnisti" && !done) {
    dv.paragraph("**Mandatory Course:** Corsi di Formazione Complementare per Dottorandi e Assegnisti");
    }
}



dv.paragraph(`**Total completed credits:** ${total}/50`);

```
