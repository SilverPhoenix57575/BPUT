# 🤝 Team Coordination Guide

## 👥 Team Structure

### Dev 1 (Frontend Developer)
- **Workspace**: `frontend/` directory
- **Tech Stack**: React, Vite, TailwindCSS, PouchDB
- **Responsibilities**: UI/UX, offline features, state management
- **Branch Prefix**: `dev1-*`

### Dev 2 (Backend Developer) ✅ SETUP COMPLETE
- **Workspace**: `backend/` directory
- **Tech Stack**: FastAPI, SQLAlchemy, Gemini API
- **Responsibilities**: API endpoints, AI services, database
- **Branch Prefix**: `dev2-*`

## 📂 File Ownership

### Dev 1 Only
```
frontend/
├── src/
├── public/
├── package.json
└── ...
```

### Dev 2 Only ✅
```
backend/
├── app/
├── requirements.txt
├── .env
└── ...
```

### Shared (Coordinate Before Editing)
```
README.md
API_CONTRACT.md
COMPLETE_HACKATHON_ROADMAP.md
```

## 🔄 Integration Points

### Backend → Frontend
- **Base URL**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs`
- **CORS**: Configured to allow all origins
- **Response Format**: JSON

### Frontend → Backend
- **Expected Headers**: `Content-Type: application/json`
- **File Uploads**: `multipart/form-data`
- **Authentication**: Token in request (when implemented)

## 🚀 Development Workflow

### Daily Standup (5 minutes)
1. What did you complete yesterday?
2. What will you work on today?
3. Any blockers or integration needs?

### Integration Testing (Every 4 hours)
1. Dev 2: Ensure backend is running
2. Dev 1: Test frontend with backend
3. Both: Fix any integration issues
4. Both: Update API_CONTRACT.md if needed

### Git Workflow

#### Dev 1
```bash
git checkout -b dev1-feature-name
# Work on frontend/ only
git add frontend/
git commit -m "feat(frontend): description"
git push origin dev1-feature-name
```

#### Dev 2
```bash
git checkout -b dev2-feature-name
# Work on backend/ only
git add backend/
git commit -m "feat(backend): description"
git push origin dev2-feature-name
```

## 📋 API Contract Checklist

### Before Making Changes
- [ ] Discuss with other developer
- [ ] Update API_CONTRACT.md
- [ ] Test the change
- [ ] Notify other developer

### After Making Changes
- [ ] Update documentation
- [ ] Test integration
- [ ] Commit and push
- [ ] Inform other developer

## 🐛 Troubleshooting Integration Issues

### Issue: Frontend can't connect to backend
**Dev 2 Check**:
- Is backend running? `uvicorn app.main:app --reload`
- Is it on port 8000?
- Check CORS configuration

**Dev 1 Check**:
- Is API URL correct? `http://localhost:8000`
- Check browser console for errors
- Verify request format

### Issue: API returns unexpected data
**Dev 2 Check**:
- Check endpoint implementation
- Verify response format matches API_CONTRACT.md
- Test in `/docs`

**Dev 1 Check**:
- Verify request payload
- Check expected response format
- Log the response

### Issue: File upload fails
**Dev 2 Check**:
- Check file size limits
- Verify file processing logic
- Check error logs

**Dev 1 Check**:
- Use `multipart/form-data`
- Verify file field name
- Check file format

## 📞 Communication Channels

### Quick Questions
- Use chat/messaging for quick clarifications
- Response time: < 30 minutes during work hours

### API Changes
- Update API_CONTRACT.md first
- Notify other developer
- Wait for confirmation before implementing

### Blockers
- Immediately notify other developer
- Discuss solution together
- Document the resolution

## ✅ Integration Milestones

### Milestone 1: Basic Setup (Hour 3)
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Health check endpoint working
- [ ] CORS configured

### Milestone 2: Authentication (Hour 6)
- [ ] Signup endpoint working
- [ ] Login endpoint working
- [ ] Frontend can store token
- [ ] Protected routes working

### Milestone 3: Content Upload (Hour 9)
- [ ] File upload endpoint working
- [ ] Frontend can upload files
- [ ] Content list displays
- [ ] File processing works

### Milestone 4: AI Features (Hour 12)
- [ ] Question answering works
- [ ] Content enhancement works
- [ ] Quiz generation works
- [ ] Frontend displays AI responses

### Milestone 5: Progress Tracking (Hour 15)
- [ ] Progress save endpoint works
- [ ] Frontend tracks interactions
- [ ] BKT algorithm working
- [ ] Progress dashboard displays

### Milestone 6: Full Integration (Hour 18)
- [ ] All endpoints tested
- [ ] Error handling works
- [ ] Loading states implemented
- [ ] User flow complete

## 🎯 Success Criteria

### Technical
- ✅ No merge conflicts
- ✅ All API endpoints working
- ✅ Frontend-backend integration smooth
- ✅ Error handling comprehensive
- ✅ Performance acceptable

### Process
- ✅ Clear communication
- ✅ Regular integration testing
- ✅ Documentation updated
- ✅ Git workflow followed
- ✅ No blocking issues

## 📊 Progress Tracking

### Dev 1 Progress
- [ ] Setup complete
- [ ] Basic UI components
- [ ] API integration
- [ ] Offline features
- [ ] Polish and testing

### Dev 2 Progress ✅
- [x] Setup complete
- [x] All endpoints implemented
- [x] AI services integrated
- [ ] Testing with real data
- [ ] Deployment

## 🚨 Emergency Protocols

### Backend Down
1. Dev 2 investigates immediately
2. Dev 1 works on UI/offline features
3. Communicate ETA for fix
4. Test thoroughly before resuming

### Frontend Blocked
1. Dev 1 communicates blocker
2. Dev 2 prioritizes fix
3. Dev 1 works on other features
4. Retest integration after fix

### Merge Conflict
1. Stop and communicate
2. Identify conflicting files
3. Resolve together if needed
4. Test after resolution

## 🎉 Final Integration Checklist

### Before Demo
- [ ] Both services running
- [ ] All features working
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Demo data prepared

### Before Deployment
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set
- [ ] CORS updated for production
- [ ] Integration tested on production

### Before Submission
- [ ] All features demonstrated
- [ ] Documentation complete
- [ ] Code cleaned up
- [ ] README updated
- [ ] Demo video recorded

## 💡 Best Practices

### Communication
- ✅ Over-communicate rather than under-communicate
- ✅ Use clear, specific language
- ✅ Document decisions
- ✅ Respond promptly

### Code
- ✅ Follow consistent style
- ✅ Write clear commit messages
- ✅ Test before pushing
- ✅ Document complex logic

### Integration
- ✅ Test frequently
- ✅ Fix issues immediately
- ✅ Keep API contract updated
- ✅ Handle errors gracefully

---

## 🎊 Current Status

### Backend (Dev 2) ✅
- **Status**: SETUP COMPLETE
- **Progress**: 100% structure ready
- **Next**: Testing and customization
- **Blockers**: None

### Frontend (Dev 1)
- **Status**: Pending setup
- **Progress**: Waiting to start
- **Next**: Initial setup
- **Blockers**: None

---

**Let's build something amazing together! 🚀**
