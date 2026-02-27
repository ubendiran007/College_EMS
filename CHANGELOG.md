# Changelog - Approval Workflow Implementation

## ✅ Changes Made

### 1. User Model Updates
**File:** `backend/models/User.js`
- Added roles: `student`, `hod`, `principal` (in addition to existing `faculty`, `iqac`, `admin`)
- Updated department requirement for student, faculty, and hod roles

### 2. IQAC Proposal Model Updates
**File:** `backend/models/IQACProposal.js`
- Updated status enum: `Pending`, `Faculty_Approved`, `HOD_Approved`, `Principal_Approved`, `Rejected`, `Completed`
- Added `currentApprover` field to track who needs to approve next
- Added `approverRole` to approval history

### 3. Email Service (NEW)
**File:** `backend/services/emailService.js`
- Created email notification system using nodemailer
- `sendApprovalEmail()` - Notifies next approver
- `sendStatusUpdateEmail()` - Notifies proposal creator of status changes

### 4. IQAC Routes Updates
**File:** `backend/routes/iqacRoutes.js`
- POST `/proposals` - Now sends email to faculty after creation
- PUT `/proposals/:id/status` - Implements approval chain:
  - Faculty approves → Emails HOD
  - HOD approves → Emails Principal
  - Principal approves → Marks as ready for event
  - Any rejection → Notifies creator
- POST `/proposals/:id/complete` - Changed requirement from `Approved` to `Principal_Approved`

### 5. Backend Configuration
**File:** `backend/.env`
- Added email configuration variables:
  - EMAIL_SERVICE
  - EMAIL_USER
  - EMAIL_PASSWORD
  - FRONTEND_URL

**File:** `backend/.env.example` (NEW)
- Template file with placeholder values (safe to commit)

**File:** `backend/package.json`
- Added `nodemailer` dependency

**File:** `backend/server.js`
- Removed deprecated Mongoose options

### 6. Security Updates
**File:** `.gitignore`
- Added `.env` files to prevent credential exposure
- Added `backend/uploads/` directory
- Added sensitive file patterns (*.pem, *.key)

### 7. Frontend Components (NEW)
**File:** `frontend/iqac/components/IQACDashboardApproval.jsx`
- New dashboard with approval workflow tracking
- Shows approval timeline for each proposal
- Role-based approval buttons
- Filters: all, pending, approved, completed
- Stats cards showing proposal counts

**File:** `frontend/iqac/components/ProposalDetailsModal.jsx`
- Modal for viewing proposal details
- Approve/Reject functionality with comments
- Shows complete approval history
- Role-based permission checks

### 8. Documentation (NEW)
**File:** `SETUP_GUIDE.md`
- Complete setup instructions
- Email configuration guide
- Workflow explanation
- API documentation
- Troubleshooting guide

**File:** `CHANGELOG.md` (this file)
- Summary of all changes

---

## 🔄 Workflow Changes

### Before:
Student/Faculty → Create Proposal → IQAC Approves → Event Created

### After:
Student → Create Proposal → Faculty Approves → HOD Approves → Principal Approves → Event Execution → Student Adds Documentation → Appears on Home Dashboard

---

## 📧 Email Notifications

**Hardcoded Approver Emails:**
- Faculty: ubendiran2007@gmail.com
- HOD: ubendiranl2007@gmail.com
- Principal: vigneshasvj@gmail.com

| Action | Email Sent To | Email Address |
|--------|---------------|---------------|
| Proposal Created | Faculty | ubendiran2007@gmail.com |
| Faculty Approved | HOD | ubendiranl2007@gmail.com |
| HOD Approved | Principal | vigneshasvj@gmail.com |
| Principal Decision | Student (creator) | Creator's registered email |
| Any Rejection | Student (creator) | Creator's registered email |

---

## 🚨 CRITICAL: Before Git Push

1. **Remove .env from tracking:**
   ```bash
   git rm --cached backend/.env
   ```

2. **Verify .gitignore includes:**
   - `.env`
   - `backend/.env`
   - `backend/uploads/`

3. **Change exposed credentials:**
   - MongoDB Atlas password
   - JWT secret
   - Email password

4. **Install new dependency:**
   ```bash
   cd backend
   npm install nodemailer
   ```

5. **Configure email in .env:**
   - Set EMAIL_USER to your Gmail
   - Set EMAIL_PASSWORD to Gmail App Password
   - Set FRONTEND_URL to your frontend URL

---

## 🧪 Testing Checklist

- [ ] Register users with roles: student, faculty, hod, principal
- [ ] Student creates proposal
- [ ] Verify faculty receives email
- [ ] Faculty approves proposal
- [ ] Verify HOD receives email
- [ ] HOD approves proposal
- [ ] Verify Principal receives email
- [ ] Principal approves proposal
- [ ] Student adds post-event documentation
- [ ] Event appears on home dashboard
- [ ] Test rejection at each level
- [ ] Verify creator receives rejection email

---

## 📦 Dependencies Added

```json
{
  "nodemailer": "^6.9.7"
}
```

---

## 🔧 Configuration Required

### backend/.env
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
FRONTEND_URL=http://localhost:5173
```

---

## 🎯 Next Steps

1. Install nodemailer: `cd backend && npm install`
2. Configure email credentials in `.env`
3. Test email functionality
4. Remove `.env` from Git tracking
5. Push to development branch
6. Test complete workflow
7. Merge to main when stable
