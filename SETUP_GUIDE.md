# Event Management System - Complete Setup Guide

## System Overview

**Roles & Workflow:**
1. **Student** → Creates event proposals
2. **Faculty** → Reviews and approves/rejects proposals
3. **HOD** → Reviews faculty-approved proposals
4. **Principal** → Final approval authority
5. **IQAC/Admin** → System administrators

**Approval Flow:**
Student creates proposal → Faculty approval → HOD approval → Principal approval → Event execution → Student adds documentation → Appears in Home dashboard

---

## 🚀 Quick Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Configure Environment

Create `backend/.env` (DO NOT commit this file):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```

**Gmail App Password Setup:**
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Generate App Password for "Mail"
4. Use that password in EMAIL_PASSWORD

### 3. Start Backend

```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd ..
npm install
npm run dev
```

---

## 📧 Email Notifications

The system automatically sends emails at each approval stage:

**Hardcoded Approver Emails:**
- Faculty: `ubendiran2007@gmail.com`
- HOD: `ubendiranl2007@gmail.com`
- Principal: `vigneshasvj@gmail.com`

**Email Flow:**
1. **Student creates proposal** → Email to Faculty (ubendiran2007@gmail.com)
2. **Faculty approves** → Email to HOD (ubendiranl2007@gmail.com)
3. **HOD approves** → Email to Principal (vigneshasvj@gmail.com)
4. **Principal approves/rejects** → Email to Student (creator's email)

---

## 👥 User Roles & Permissions

### Student
- Create event proposals
- View own proposals
- Add post-event documentation after principal approval
- Track approval status

### Faculty
- View proposals from their department
- Approve/reject proposals (first level)
- Add comments

### HOD
- View faculty-approved proposals from their department
- Approve/reject proposals (second level)
- Add comments

### Principal
- View all HOD-approved proposals
- Final approval/rejection authority
- Add comments

### IQAC/Admin
- View all proposals and events
- System administration
- Generate reports

---

## 🔄 Complete Workflow Example

### Phase 1: Proposal Creation
1. Student logs in
2. Goes to IQAC page
3. Clicks "Create Proposal"
4. Fills event details:
   - Event title, type, date, venue
   - Resource persons
   - Budget
   - Requirements (food, travel, IT support, etc.)
5. Submits proposal
6. **System sends email to Faculty**

### Phase 2: Faculty Approval
1. Faculty receives email notification
2. Logs in and views proposal
3. Reviews details
4. Approves/rejects with comments
5. **If approved, system sends email to HOD**

### Phase 3: HOD Approval
1. HOD receives email notification
2. Logs in and views proposal
3. Reviews details and faculty comments
4. Approves/rejects with comments
5. **If approved, system sends email to Principal**

### Phase 4: Principal Approval
1. Principal receives email notification
2. Logs in and views proposal
3. Reviews complete approval chain
4. Makes final decision
5. **System notifies student of final decision**

### Phase 5: Event Execution
- Event happens in real world
- Student organizes the event

### Phase 6: Post-Event Documentation
1. Student logs back into IQAC page
2. Finds principal-approved proposal
3. Clicks "Add Documentation"
4. Uploads:
   - Event photos with geo-tags
   - Brochure/materials
   - Attendance records
   - Schedule/timeline
   - Participant feedback
   - Guest feedback
5. Submits documentation
6. **Event now appears on Home dashboard**

### Phase 7: Public Viewing
- All users can view completed events on Home page
- Click "View Details" to see full event report
- View photos, feedback, statistics, etc.

---

## 🗄️ Database Models

### User
- name, email, password
- role: student, faculty, hod, principal, iqac, admin
- department (for student, faculty, hod)

### IQACProposal
- proposalId, eventTitle, department, eventType
- eventDate, venue, description, budget
- resourcePersons[]
- requirements (food, travel, accommodation, IT, AV)
- status: Pending → Faculty_Approved → HOD_Approved → Principal_Approved → Completed
- currentApprover: faculty, hod, principal, completed
- approvalHistory[] (tracks each approval with comments)

### Event
- eventId, event details
- brochure, schedule[], gallery[]
- resourcePersons[], attendance, registration
- participantFeedback, guestFeedback
- eventReport, certificates
- iqacProposalId (links to original proposal)

---

## 🔐 Security Checklist

Before pushing to Git:

- [ ] Remove `backend/.env` from Git tracking
- [ ] Verify `.gitignore` includes `.env` files
- [ ] Create `backend/.env.example` with placeholders
- [ ] Change MongoDB Atlas password if exposed
- [ ] Generate new JWT secret
- [ ] Never commit real credentials

```bash
# Remove .env from Git
git rm --cached backend/.env

# Commit the fix
git add .gitignore backend/.env.example
git commit -m "fix: remove sensitive files from tracking"
```

---

## 📊 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### IQAC Proposals
- GET `/api/iqac/proposals` - Get all proposals
- POST `/api/iqac/proposals` - Create proposal (sends email to faculty)
- PUT `/api/iqac/proposals/:id/status` - Approve/reject (sends email to next approver)
- POST `/api/iqac/proposals/:id/complete` - Add post-event documentation

### Events
- GET `/api/events` - Get all completed events
- GET `/api/events/:id` - Get event details
- POST `/api/events/:id/photos` - Upload photos
- POST `/api/events/:id/brochure` - Upload brochure

---

## 🎨 Frontend Pages

### `/login` - Login page (all roles)
### `/register` - Registration page
### `/` or `/events` - Home dashboard (completed events list)
### `/event/:id` - Event details page
### `/iqac` - IQAC dashboard (proposal management)

---

## 🐛 Troubleshooting

### Emails not sending
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Verify Gmail App Password is correct
- Check "Less secure app access" is enabled (if not using App Password)

### MongoDB connection failed
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check MONGODB_URI in .env
- Verify database name is correct

### Cannot create proposal
- Check user role is 'student'
- Verify backend is running
- Check browser console for errors

---

## 📝 Next Steps

1. Install dependencies: `npm install` in both root and backend
2. Configure `.env` file with your credentials
3. Start MongoDB
4. Run backend: `cd backend && npm run dev`
5. Run frontend: `npm run dev`
6. Register users with different roles
7. Test the complete workflow

---

## 🔄 Git Workflow

```bash
# Development branch
git checkout development
git add .
git commit -m "feat: add approval workflow with email notifications"
git push origin development

# Merge to main when ready
git checkout main
git merge development
git push origin main
```
