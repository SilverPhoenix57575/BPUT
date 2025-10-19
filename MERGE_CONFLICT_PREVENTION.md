# 🚫 Merge Conflict Prevention Guide

## 🎯 Golden Rules

1. **Dev 1 ONLY touches `frontend/` directory**
2. **Dev 2 ONLY touches `backend/` directory**
3. **Coordinate before editing shared files**
4. **Pull before you push**
5. **Use separate branches**

## 📂 File Ownership

### Dev 1 (Frontend) - Your Territory
```
✅ frontend/
✅ DEV1_FRONTEND_TASKS.md
✅ docs/FRONTEND_GUIDE.md (if created)
```

### Dev 2 (Backend) - Your Territory
```
✅ backend/
✅ DEV2_BACKEND_TASKS.md
✅ docs/BACKEND_GUIDE.md (if created)
```

### Shared Files (Ask Before Editing!)
```
⚠️ README.md
⚠️ COMPLETE_HACKATHON_ROADMAP.md
⚠️ .gitignore
⚠️ docs/API_DOCS.md
⚠️ docs/ARCHITECTURE.md
```

## 🔄 Safe Git Workflow

### Step 1: Start Your Work
```bash
# Always pull first
git pull origin main

# Create your feature branch
git checkout -b dev1-feature-name  # Dev 1
git checkout -b dev2-feature-name  # Dev 2
```

### Step 2: Work on Your Files
```bash
# Dev 1: Only work in frontend/
cd frontend
# Make your changes...

# Dev 2: Only work in backend/
cd backend
# Make your changes...
```

### Step 3: Commit Your Changes
```bash
# Stage ONLY your directory
git add frontend/  # Dev 1
git add backend/   # Dev 2

# Commit with clear message
git commit -m "feat(frontend): add content upload component"  # Dev 1
git commit -m "feat(backend): add PDF extraction endpoint"   # Dev 2
```

### Step 4: Push Your Branch
```bash
# Push to your branch
git push origin dev1-feature-name  # Dev 1
git push origin dev2-feature-name  # Dev 2
```

### Step 5: Create Pull Request
1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Add description
5. Request review from other dev
6. Merge after approval

## 🚨 If You Need to Edit Shared Files

### Option 1: Communicate First
```bash
# In your team chat
"Hey, I need to update README.md. Are you working on it?"
# Wait for response
# If clear, proceed
```

### Option 2: Quick Coordination
```bash
# Dev 1 updates README
git add README.md
git commit -m "docs: update frontend setup in README"
git push

# Notify Dev 2
"Just pushed README update, please pull before your next commit"

# Dev 2 pulls
git pull origin main
```

## 🔧 Handling Conflicts (If They Happen)

### If You Get a Merge Conflict:

```bash
# Pull the latest changes
git pull origin main

# Git will show conflicts like:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# Open the file and choose what to keep
# Remove the conflict markers (<<<, ===, >>>)
# Keep both changes if needed

# Stage the resolved file
git add conflicted-file.md

# Commit the resolution
git commit -m "fix: resolve merge conflict in README"

# Push
git push origin your-branch
```

## 📋 Daily Sync Routine

### Morning (Start of Work)
```bash
git pull origin main
git checkout -b dev1-new-feature  # or dev2-new-feature
```

### During Work (Every 2-3 hours)
```bash
git add frontend/  # or backend/
git commit -m "feat: description"
git push origin your-branch
```

### Evening (End of Work)
```bash
# Commit all work
git add frontend/  # or backend/
git commit -m "feat: completed X feature"
git push origin your-branch

# Create PR if feature is done
# Or continue tomorrow
```

## 🎯 Branch Naming Convention

### Dev 1 (Frontend)
```
dev1-offline-storage
dev1-bkt-implementation
dev1-student-ui
dev1-gamification
```

### Dev 2 (Backend)
```
dev2-content-processing
dev2-ai-services
dev2-educator-dashboard
dev2-career-mapping
```

## 🚀 Integration Points

When you need to integrate frontend + backend:

### Step 1: Dev 2 Deploys Backend First
```bash
# Dev 2 deploys to Render
# Gets API URL: https://your-app.onrender.com
# Shares URL with Dev 1
```

### Step 2: Dev 1 Updates Frontend Config
```bash
# frontend/.env
VITE_API_URL=https://your-app.onrender.com

# Test integration
npm run dev
```

### Step 3: Both Test Together
- Dev 1 tests frontend with real API
- Dev 2 monitors backend logs
- Fix issues together

## 📞 Communication Checklist

Before editing shared files, ask:
- [ ] "Are you working on [filename]?"
- [ ] "Can I update [filename]?"
- [ ] "I'm about to push changes to [filename]"

After pushing shared files:
- [ ] "Just pushed [filename], please pull"
- [ ] "Updated [filename] with [changes]"

## 🎉 Success Metrics

✅ No merge conflicts  
✅ Clean commit history  
✅ Fast integration  
✅ Happy team  

## 🆘 Emergency: Major Conflict

If you get a major conflict you can't resolve:

```bash
# Save your work
git stash

# Get clean version
git pull origin main

# Apply your changes
git stash pop

# Manually fix conflicts
# Ask for help if needed

# Commit
git add .
git commit -m "fix: resolve conflicts"
git push
```

## 💡 Pro Tips

1. **Commit often** - Small commits are easier to manage
2. **Pull before push** - Always sync before pushing
3. **Clear messages** - Write descriptive commit messages
4. **Test locally** - Test before pushing
5. **Communicate** - Over-communicate rather than under-communicate

## 🎯 Remember

> "The best merge conflict is the one that never happens!"

Stay in your lane, communicate often, and you'll have a smooth hackathon! 🚀
