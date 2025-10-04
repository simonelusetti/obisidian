### ❓ Riddles Scoreboard
```dataviewjs
// CONFIG
const folder = "personal/daily-notes";   // your daily notes folder
const taskName = "Solved it today!";

// Collect daily notes
let pages = dv.pages(`"${folder}"`).sort(p => p.file.name, 'asc');

// Map to date + solved
let data = {};
for (let p of pages) {
    let tasks = dv.page(p.file.path).file.tasks;
    let solved = tasks.where(t => t.text.includes(taskName) && t.completed).length > 0;
    let date = moment(p.file.name, "YYYY-MM-DD"); // assumes daily note name = 2025-09-30
    if (date.isValid()) {
        data[date.format("YYYY-MM-DD")] = solved;
    }
}

// Bail out gracefully if no data
let allDates = Object.keys(data).map(d => moment(d));
if (allDates.length === 0) {
    dv.paragraph("⚠️ No data found.");
} else {
    // Find min/max date
    let minDate = moment.min(allDates);
    let maxDate = moment.max(allDates);

    // Expand range to full weeks
    let start = minDate.clone().startOf('week');
    let end = maxDate.clone().endOf('week');

    // Build grid (weeks × weekdays)
    let weeks = [];
    let curr = start.clone();
    while (curr.isBefore(end)) {
        let week = [];
        for (let i = 0; i < 7; i++) {
            let key = curr.format("YYYY-MM-DD");
            if (data[key]) week.push("🟩"); // done
            else if (data[key] === false) week.push("🟥"); // note exists but not solved
            else week.push("  "); // no note
            curr.add(1, "day");
        }
        weeks.push(week);
    }

    // Render HTML table manually
    const weekdays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    let table = dv.el("table", "", {cls: "riddle-grid"});
    
    // Header row
    let thead = table.createEl("thead").createEl("tr");
    weekdays.forEach(day => {
        thead.createEl("th", { text: day });
    });

    // Body rows
    let tbody = table.createEl("tbody");
    weeks.forEach(week => {
        let tr = tbody.createEl("tr");
        week.forEach(cell => {
            tr.createEl("td", { text: cell });
        });
    });
}
```

### 🛒 Spesa

Coop
- [ ] 
Aldi
- [ ] 
Cinesi
- [ ] 

### ❌ To Do
```dataview
TABLE WITHOUT ID task.text AS Task, file.link AS Date
FROM "personal/daily-notes"
FLATTEN file.tasks AS task
WHERE !task.completed
AND !contains(task.text, "Solved it today!")
AND regexreplace(task.text, "\\s+", "") != ""
SORT file.name DESC, task.line ASC
```

### ✅ Done
```dataview
TABLE WITHOUT ID task.text AS Task, file.link AS Date
FROM "personal/daily-notes"
FLATTEN file.tasks AS task
WHERE task.completed
AND !contains(task.text, "Solved it today!")
SORT file.name DESC, task.line ASC
```
