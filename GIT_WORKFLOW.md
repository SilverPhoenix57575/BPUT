# 🔄 Git Workflow Cheatsheet

## 🎯 Quick Commands

### Initial Setup (Once)
```bash
# Initialize repo
git init
git add .
git commit -m "Initial commit"

# Add remote
git remote add origin <your-github-url>
git push -u origin main
```

### Daily Workflow

#### Morning (Start Work)
```bash
# Pull latest changes
git pull origin main

# Create/switch to your branch
git checkout -b dev1-feature-name  # Dev 1
git checkout -b dev2-feature-name  # Dev 2
```

#### During Work (Every 2-3 hours)
```bash
# Check what changed
git status

# Stage your files ONLY
git add frontend/  # Dev 1
git add backend/   # Dev 2

# Commit with message
git commit -m "feat: add content upload component"

# Push to your branch
git push origin dev1-feature-name
```

#### Evening (End of Day)
```bash
# Commit all work
git add frontend/  # or backend/
git commit -m "feat: completed X feature"
git push origin your-branch-name
```

---

## 📝 Commit Message Format

### Structure
```
<type>(<scope>): <description>

[optional body]
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

### Examples
```bash
git commit -m "feat(frontend): add content upload component"
git commit -m "fix(backend): resolve PDF extraction error"
git commit -m "docs: update API contract"
git commit -m "style(frontend): format with prettier"
```

---

## 🌿 Branch Management

### Create Branch
```bash
git checkout -b branch-name
```

### Switch Branch
```bash
git checkout branch-name
```

### List Branches
```bash
git branch
```

### Delete Branch (after merge)
```bash
git branch -d branch-name
```

---

## 🔄 Syncing with Main

### Update Your Branch
```bash
# Switch to main
git checkout main

# Pull latest
git pull origin main

# Switch back to your branch
git checkout your-branch

# Merge main into your branch
git merge main
```

---

## 🚨 Conflict Resolution

### If You Get Conflicts
```bash
# Pull latest
git pull origin main

# Git shows conflicts
# Open conflicted files
# Look for markers:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> main

# Edit file to keep what you want
# Remove markers (<<<, ===, >>>)

# Stage resolved file
git add conflicted-file

# Commit resolution
git commit -m "fix: resolve merge conflict"

# Push
git push origin your-branch
```

---

## 📤 Creating Pull Request

### On GitHub
1. Go to your repository
2. Click "Pull requests"
3. Click "New pull request"
4. Select your branch
5. Add title and description
6. Click "Create pull request"
7. Request review from other dev
8. Wait for approval
9. Click "Merge pull request"

---

## 🔍 Useful Commands

### Check Status
```bash
git status
```

### View Changes
```bash
git diff
```

### View Commit History
```bash
git log --oneline
```

### Undo Last Commit (keep changes)
```bash
git reset --soft HEAD~1
```

### Discard Changes
```bash
git checkout -- filename
```

### Stash Changes (save for later)
```bash
git stash
git stash pop  # restore later
```

---

## 🎯 Dev 1 Workflow

```bash
# Morning
git pull origin main
git checkout dev1-frontend

# Work on frontend
cd frontend
# Make changes...

# Commit
git add frontend/
git commit -m "feat(frontend): add quiz component"
git push origin dev1-frontend

# Evening
git add frontend/
git commit -m "feat(frontend): completed day 1 tasks"
git push origin dev1-frontend
```

---

## 🎯 Dev 2 Workflow

```bash
# Morning
git pull origin main
git checkout dev2-backend

# Work on backend
cd backend
# Make changes...

# Commit
git add backend/
git commit -m "feat(backend): add PDF extraction"
git push origin dev2-backend

# Evening
git add backend/
git commit -m "feat(backend): completed day 1 tasks"
git push origin dev2-backend
```

---

## ⚠️ Common Mistakes

### ❌ Don't Do This
```bash
# Don't add everything blindly
git add .  # Might include .env or node_modules

# Don't commit to main directly
git checkout main
git commit -m "changes"  # BAD!

# Don't force push
git push -f  # Can lose work!
```

### ✅ Do This Instead
```bash
# Add specific directories
git add frontend/
git add backend/

# Work on branches
git checkout -b your-branch
git commit -m "changes"  # GOOD!

# Normal push
git push origin your-branch
```

---

## 🆘 Emergency Commands

### Undo Everything (nuclear option)
```bash
git reset --hard HEAD
```

### Go Back to Last Commit
```bash
git checkout .
```

### Delete Untracked Files
```bash
git clean -fd
```

---

## 📋 Pre-Commit Checklist

Before every commit:
- [ ] Tested code locally
- [ ] No console.log or debug code
- [ ] No .env or secrets
- [ ] Only your directory files
- [ ] Clear commit message
- [ ] Pulled latest changes

---

## 🎉 Quick Reference

| Command | What It Does |
|---------|--------------|
| `git status` | Show changes |
| `git add frontend/` | Stage frontend files |
| `git commit -m "msg"` | Commit with message |
| `git push origin branch` | Push to GitHub |
| `git pull origin main` | Get latest changes |
| `git checkout -b name` | Create new branch |
| `git merge main` | Merge main into branch |

---

## 💡 Pro Tips

1. **Commit often** - Small commits are better
2. **Pull before push** - Always sync first
3. **Clear messages** - Future you will thank you
4. **Test before commit** - Don't break the build
5. **Stay in your lane** - Frontend or backend only

---

## 🚀 You Got This!

Git is your friend. Follow this workflow and you'll have no problems!
