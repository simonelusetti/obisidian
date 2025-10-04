#### *<% tp.date.now("dddd") %>*
<<[[<% fileDate = moment(tp.file.title, 'YYYY-MM-DD-dddd').subtract(1, 'd').format('YYYY-MM-DD') %>|Yesterday]] | [[<% fileDate = moment(tp.file.title, 'YYYY-MM-DD-dddd').add(1, 'd').format('YYYY-MM-DD') %>|Tomorrow]]>>
## ❓Daily Riddle
<%*
async function pickRiddle() {
  const raw = await tp.file.include("[[riddles]]");
  const items = raw.split("\n")
    .map(l => l.trim())
    .filter(l => l.startsWith("- "))
    .map(l => l.replace(/^-+\s*/, "").trim());

  if (items.length === 0) return { q: "No riddles found!", a: "" };

  const choice = items[Math.floor(Math.random() * items.length)];
  const [q, a] = choice.split("|").map(s => s.replace(/^Q:|A:/, "").trim());
  return { q, a };
}
%><%*
const { q, a } = await pickRiddle();
tR += `**Riddle:** ${q}\n`;
tR += `> [!tip]- Answer\n> ${a}\n`;
%>
- [ ] Solved it today!
## 📅 Schedule / Tasks
- [ ] 

## 🐓 Morning Log
- 

## 🌿 Afternoon Log
- 

## 🌙 Evening Log
- 

## 🧠 Meta Log
- 