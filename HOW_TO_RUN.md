# Quick Start - How to Run

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd ..
npm install
```

## Step 2: Start MongoDB

### Windows
```bash
net start MongoDB
```

### Mac/Linux
```bash
sudo systemctl start mongod
```

## Step 3: Configure Email (IMPORTANT!)

Edit `backend/.env` and replace:
```
EMAIL_PASSWORD=your-app-password
```

With your Gmail App Password (get it from: https://myaccount.google.com/apppasswords)

## Step 4: Run Backend

Open Terminal 1:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

## Step 5: Run Frontend

Open Terminal 2:
```bash
npm run dev
```

You should see:
```
VITE ready at http://localhost:5173
```

## Step 6: Open Browser

Go to: http://localhost:5173

## Step 7: Register Users

Create accounts with different roles:
1. Student account
2. Faculty account  
3. HOD account
4. Principal account

## Step 8: Test Workflow

1. Login as **Student**
2. Go to IQAC page
3. Create a proposal
4. Check email: ubendiran2007@gmail.com (Faculty should receive email)
5. Login as **Faculty** → Approve proposal
6. Check email: ubendiranl2007@gmail.com (HOD should receive email)
7. Login as **HOD** → Approve proposal
8. Check email: vigneshasvj@gmail.com (Principal should receive email)
9. Login as **Principal** → Approve proposal
10. Login as **Student** → Add documentation
11. View completed event on Home page

---

## Troubleshooting

### MongoDB not running
```bash
# Windows
net start MongoDB

# Check if running
mongo --version
```

### Port already in use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Email not sending
- Check EMAIL_PASSWORD in backend/.env
- Use Gmail App Password, not regular password
- Enable 2-Step Verification in Google Account

### Cannot connect to backend
- Check backend is running on port 5000
- Check VITE_API_URL in frontend (should be http://localhost:5000/api)
