**⚙ Basics:**
- `.gitignore` tells Git which files and directories to **ignore** (not track in commits).
- Patterns are matched relative to the location of the `.gitignore` file.
- Git only ignores **untracked files** — if a file is already tracked, adding it to `.gitignore` won’t remove it (you need `git rm --cached` for that).

**🖥 Useful Patterns:**
1. **Ignore by file extension**
```
*.log       # ignore all .log files
*.tmp       # ignore all .tmp files
```
2. **Ignore specific file**
```
secret.txt
```
2. **Ignore a whole folder**
```
build/
node_modules/
```
2. **Ignore everything inside a folder but not the folder itself**
```
logs/*
!logs/.gitkeep
```
2. **Negate (whitelist) a pattern**
```
*.env       # ignore all .env files
!.env.example   # but keep this one
```
2. **Ignore files only in root folder**
```
/.env       # ignore only root .env, not nested ones
```

---

**🧠 Best Practices**

- **Keep it project-specific**: Don’t over-ignore. For example, `*.json` might be too broad if your project actually uses JSON configs.
- **Use `.gitkeep` or similar**: If you want empty directories in the repo, add a placeholder file (Git doesn’t track empty dirs).
- **Use global gitignore**: Configure OS/editor-specific ignores globally so you don’t clutter every project’s `.gitignore`. Example:
```bash
git config --global core.excludesfile ~/.gitignore_global
```
In `~/.gitignore_global`, you can put things like:
```
.DS_Store
Thumbs.db
*.swp
```
- **Check existing templates**: Services like [gitignore.io](https://www.toptal.com/developers/gitignore) generate `.gitignore` templates for languages/frameworks.
---

**Basic `~/.gitignore_global`**
```
# OS-generated files
.DS_Store
Thumbs.db
ehthumbs.db
Icon?
Desktop.ini

# Backup / temporary files
*.bak
*.tmp
*.swp
*.swo
*~

# IDEs and editors
.vscode/
.idea/
*.iml

# Python virtualenvs
.env/
.venv/

# Logs
*.log
```

---

⚡Quick tip: If you accidentally committed something that should be ignored, run:
```bash
git rm --cached <file>
```
so it’s removed from tracking but stays on disk.

---
