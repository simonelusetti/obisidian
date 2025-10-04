# Basics

**Check what remotes you have**
```bash
git remote -v
```
Example output:
```
origin  https://github.com/simonelusetti/RatCon.git (fetch)
origin  https://github.com/simonelusetti/RatCon.git (push)
```
- `origin` is the default name for the remote (usually GitHub).
- You can have multiple remotes (e.g. `upstream`, `fork`).

---

**Cloning a repo**
Download a repo + set `origin` automatically:
```bash
git clone https://github.com/simonelusetti/RatCon.git
cd RatCon
```
Now `origin` points to that GitHub repo.

---

**Fetch vs Pull**
- **Fetch** = download commits/branches but don’t change your working branch.
```bash
git fetch origin
```
Now you can see what changed:
```bash
git log main..origin/main
```
- **Pull** = fetch + merge into your current branch.
```bash
git pull origin main
```

---

**Push your changes**
If you’re on `main`:
```bash
git push origin main
```
If you’re on a feature branch:
```bash
git push -u origin feature/login
```
(`-u` sets upstream: after this, you can just do `git push` or `git pull`.)

---

**Tracking branches**
When you push with `-u`, you create a **tracking branch**:
- Local `feature/login` knows it’s connected to `origin/feature/login`.
- Check with:
```bash
git branch -vv
```
Example:
```
* feature/login  7e34d21 [origin/feature/login] add login feature
```

---

**Deleting branches on remote**
Delete a remote branch (e.g. after merging a PR):
```bash
git push origin --delete feature/login
```
---

**Add another remote**
Sometimes you fork a repo. You’ll have:
- `origin` = your fork.    
- `upstream` = the original repo.
Add upstream:
```bash
git remote add upstream https://github.com/original/repo.git
```
Now you can fetch updates from upstream:
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

**Example Workflow with Remote**
Initial setup:
```bash
git clone https://github.com/simonelusetti/RatCon.git
cd RatCon
```
Create feature branch:
```bash
git checkout -b feature/dual-model
```
Commit work:
```bash
git add .
git commit -m "implement dual model"
```
Push branch:
```bash
git push -u origin feature/dual-model
```
Get latest changes from main:
```bash
git checkout feature/dual-model
git fetch origin
git rebase origin/main   # or: git pull origin main
```
Merge feature into main & push:
```bash
git checkout main
git pull origin main
git merge --ff-only feature/dual-model
git push origin main
```
Cleanup:
```bash
git branch -d feature/dual-model
git push origin --delete feature/dual-model
```

---
## Remote Merge vs Rebase
Suppose we start like this:
```
A → B → C (origin/main, main)
       \
        D → E (feature)
```
- `main` has commits A–B–C.
- `feature` branched off after B, and you added commits D, E.
- Now, someone else added commit `C` to `main`.
You want to bring that `C` into your branch before continuing.
 
 **Option 1:** Merge main into your branch
```bash
git checkout feature
git pull origin main
```
Result:
```
A → B → C (main)
       \       \
        D → E → M (feature)
```
- A new **merge commit** `M` is created.
- `M` ties together your branch (`D → E`) and the new main commit (`C`).
- History shows the true branching.

| Pros ✅                                                                  | Cons 🚫                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| - Preserves full history.<br>- Safe and non-destructive (no rewriting). | - History gets more complex (lots of merge commits if done often). |
**Option 2:** Rebase your branch onto main
```bash
git checkout feature
git fetch origin
git rebase origin/main
```
Result:
```
A → B → C (main)
           \
            D' → E' (feature)
```
- Your commits (`D`, `E`) are **rebased** on top of `C`.
- Git actually **rewrites history**: `D` and `E` become new commits (`D'`, `E'`).
- History is linear, as if you branched from `C` all along.


| Pros ✅                                       | Cons 🚫                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| - Cleaner history.<br>- Easier to read logs. | - Rewrites commit hashes (so avoid rebasing shared branches).<br>- Can be tricky if there are many conflicts. |
>📊 Rule of Thumb:
>- **Merge main into your branch** → safe, preserves true history, but messier logs.
>- **Rebase onto main** → cleaner history, preferred before opening a PR, but avoid if others already work on the branch.
