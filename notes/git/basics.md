## 🔑 Core Concepts

- **Commit**: snapshot of the project at a point in time.
- **Branch**: just a pointer (label) to a commit.
- **HEAD**: pointer to your current branch/commit.
- **Remote**: another repo (usually GitHub), e.g. `origin`.

---
## 🌱 Branching

Create a new branch:
```bash
git checkout -b branch_name
# or
git switch -c branch_name
```

List branches:
```bash
git branch -vv
```

Delete a branch:
```bash
git branch -d branch_name          # safe delete
git branch -D branch_name          # force delete
git push origin --delete branch_name  # delete remote branch
```

---

## 🔄 Merging Strategies

**Fast Forward**
- Moves the branch pointer forward.
- History is linear (no branch trace).
```
A → B → C (main)
              \
               D → E (feature)
After merge:
A → B → C → D → E (main, feature)
```

```bash
git checkout main
git merge --ff-only feature
```

**Merge Commit**
- Happens if both branches advanced.
- Creates a special commit `M` with two parents.
- Preserves branch history.

```
A → B → C → F (main)
         \     
	       D → E (feature)

After merge:
A → B → C → F ─────────╮
         \             │
          ───> D → E → M (main)
```

```bash
git checkout main
git merge feature
```

**Squash Merge**
- Compresses all feature commits into **one commit** on `main`.
- Branch history disappears.
- GitHub's favorite

```
A → B → C (main)
              \
               D → E → F (feature)

After squash:
A → B → C → S (main)
```

Command:
```bash
git checkout main
git merge --squash feature
git commit -m "Feature summary"
```

(Or select **Squash and Merge** on GitHub PRs.)

Squash merge when `main` has advanced. Let’s say history looks like this:
```
main:  A → B → C → F
               \
feature:        D → E
```
- `main` moved forward (`F`).
- `feature` has its own commits (`D`, `E`).
If you try **squash merge**:
```bash
git checkout main
git merge --squash feature
git commit -m "squash feature"
```
Git will:
1. Take all the **changes** introduced by `D` and `E`.
2. Reapply them **on top of `main`’s tip** (commit `F`).
3. Make a new commit `S` that contains the combined diff.
Result:
```
A → B → C → F → S (main)
               \
                D → E (feature, can be deleted)
```
- `S` contains all changes from `D` and `E`.
- `D` and `E` are **not preserved** in `main`.
- Even if `main` advanced, squash still works — it just replays the changes.
- The original branch commits (`D`, `E`) are no longer visible in `main`.

---

## 📊 Usual Workflow

1. Update `main`
```bash
git checkout main
git pull origin main
```
1. Create feature branch
```bash
git checkout -b feature/my-task
```
2. Work & commit
```bash
git add .
git commit -m "implement my task"
```
3. Push branch
```bash
git push -u origin feature/my-task
```
4. Open a PR → merge (fast-forward, squash, or merge commit).
5. Update `main` and delete branch
```bash
git checkout main
git pull origin main
git branch -d feature/my-task
git push origin --delete feature/my-task
```
