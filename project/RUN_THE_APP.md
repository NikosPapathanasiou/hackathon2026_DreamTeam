# How to Run Future Proof App - Complete Guide

**Follow these steps EXACTLY in order. Don't skip any steps.**

---

## Prerequisites (Install These First)

### 1. Node.js
- Go to: https://nodejs.org/
- Download the **LTS version** (20.x or higher)
- Run the installer
- Click "Next" through all steps
- **Verify installation:**
  ```bash
  node --version
  ```
  Should show: `v20.x.x` or higher

### 2. Git (if not installed)
- Go to: https://git-scm.com/
- Download and install
- Use default settings
- **Verify installation:**
  ```bash
  git --version
  ```
  Should show: `git version x.x.x`

---

## Part 1: Get the Code

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Windows Key + R`
- Type `cmd` or `powershell`
- Press Enter

**Or use VS Code terminal:**
- Open VS Code
- Press `Ctrl + `` (backtick)

### Step 2: Navigate to the Project

```bash
cd C:\Users\hackathonuser3\Documents\project
```

### Step 3: Verify You're in the Right Place

```bash
dir
```

You should see:
- `backend` folder
- `frontend` folder
- Various `.md` files

**If you DON'T see these, you're in the wrong folder!**

---

## Part 2: Setup Backend

### Step 1: Go to Backend Folder

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

**This will take 1-2 minutes. Wait until it finishes!**

You'll see a progress bar and lots of text. Wait for it to return to the prompt.

### Step 3: Generate Prisma Client

```bash
npx prisma generate
```

**Wait for:** `✔ Generated Prisma Client`

### Step 4: Run Database Migration

```bash
npx prisma migrate dev
```

**You'll be asked:** `Enter a name for the new migration:`

**Type exactly:** `init`

**Press:** `Enter`

**Wait for:** Migration completed messages

### Step 5: Seed the Database with Demo Data

```bash
npm run seed
```

**You should see:**
```
✅ Cleared existing data
✅ Created demo parent: demo@parent.com
✅ Created demo children: Sophia Nikos
✅ Created demo transactions
✅ Created demo budgets
✅ Created demo educational progress
🎉 Database seeded successfully!
```

**If you see errors, STOP and ask for help!**

### Step 6: Start the Backend Server

```bash
npm run dev
```

**You should see:**
```
🚀 Future Proof API Server
📡 Server running on port 5000
```

**✅ SUCCESS! Backend is running!**

**⚠️ IMPORTANT: Keep this terminal window OPEN! Do NOT close it!**

---

## Part 3: Setup Frontend

### Step 1: Open a NEW Terminal

**DO NOT CLOSE THE BACKEND TERMINAL!**

**Open a second terminal:**
- In VS Code: Click the `+` icon in terminal panel
- Or open another PowerShell/CMD window

### Step 2: Navigate to Frontend Folder

```bash
cd C:\Users\hackathonuser3\Documents\project\frontend
```

**Verify you're in frontend:**
```bash
dir
```

You should see:
- `src` folder
- `package.json`
- `index.html`

### Step 3: Install Dependencies

```bash
npm install
```

**This will take 1-2 minutes. Wait until it finishes!**

### Step 4: Start the Frontend Server

```bash
npm run dev
```

**You should see:**
```
VITE v5.4.21  ready in 1479 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**✅ SUCCESS! Frontend is running!**

**⚠️ IMPORTANT: Keep this terminal window OPEN too!**

---

## Part 4: Open the App

### Step 1: Open Your Web Browser

Use Chrome, Firefox, Edge, or Safari

### Step 2: Go to the App

Type in the address bar:
```
http://localhost:5173
```

Press Enter

**You should see the Future Proof login page!**

---

## Part 5: Login and Test

### Step 1: Login with Demo Account

**Email:** `demo@parent.com`

**Password:** `demo123`

Click **"Login"** button

### Step 2: You Should See:

- Parent Dashboard
- Two children: Sophia and Nikos
- Transactions and budgets

**✅ SUCCESS! The app is working!**

---

## Part 6: Test All Features

### Test 1: View Child Dashboard

1. Click on **"Sophia"** or **"Nikos"**
2. You should see:
   - Balance display
   - Virtual card
   - Transactions
   - Budgets
   - **"Start Learning!"** button
   - **"My Goals"** section

### Test 2: Educational Features

1. Click the big **"Start Learning!"** button
2. Click **"Learn"** tab
3. Click on a lesson card
4. Go through the lesson slides
5. Take the quiz
6. Earn a badge!

### Test 3: Goals Feature (NEW!)

1. Go back to child dashboard
2. Scroll down to **"My Goals"** section
3. Click **"New Goal"** button
4. Create a goal:
   - Choose emoji: 🚲
   - Title: "New Bike"
   - Target Amount: 100
   - Click **"Create Goal"**
5. Click **"Add Money"** on the goal
6. Enter amount: 20
7. Click **"Confirm"**
8. Watch the progress bar update!

**✅ All features working!**

---

## Part 7: Stopping the App

When you're done:

### Step 1: Stop Frontend
- Go to the frontend terminal
- Press `Ctrl + C`
- Type `Y` if asked to confirm
- Press Enter

### Step 2: Stop Backend
- Go to the backend terminal
- Press `Ctrl + C`
- Type `Y` if asked to confirm
- Press Enter

### Step 3: Close Terminals
You can now close all terminal windows

---

## Common Problems & Solutions

### Problem 1: "Port 5000 already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
The backend is already running somewhere else.

**Option A:** Find the other terminal and use that one

**Option B:** Kill the process:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it (replace XXXX with the PID number shown)
taskkill /PID XXXX /F

# Try again
npm run dev
```

---

### Problem 2: "Cannot find module"

**Error:**
```
Error: Cannot find module 'xxx'
```

**Solution:**
Dependencies not installed properly.

```bash
# In the folder with the error (backend or frontend)
rm -rf node_modules
rm package-lock.json
npm install
```

---

### Problem 3: "Prisma Client not generated"

**Error:**
```
Error: Cannot find module '.prisma/client'
```

**Solution:**
```bash
cd backend
npx prisma generate
npm run dev
```

---

### Problem 4: "Database locked"

**Error:**
```
Error: database is locked
```

**Solution:**
Another process is using the database.

```bash
cd backend
# Delete the database file
rm database/dev.db

# Recreate it
npx prisma migrate dev
npm run seed
npm run dev
```

---

### Problem 5: Frontend Shows Blank Page

**Solution:**
1. Open browser console (F12)
2. Check for errors
3. Verify backend is running on port 5000
4. Check `http://localhost:5000/api/health` in browser
5. Should show: `{"status":"ok",...}`

---

### Problem 6: Can't Login

**Solution:**
Database not seeded properly.

```bash
cd backend
npm run seed
```

Use credentials:
- Email: `demo@parent.com`
- Password: `demo123`

---

## Quick Reference

### Start the App (After First Setup)

**Terminal 1:**
```bash
cd C:\Users\hackathonuser3\Documents\project\backend
npm run dev
```

**Terminal 2:**
```bash
cd C:\Users\hackathonuser3\Documents\project\frontend
npm run dev
```

**Browser:**
```
http://localhost:5173
```

**Login:**
- Email: `demo@parent.com`
- Password: `demo123`

---

## File Structure Overview

```
project/
├── backend/                    # API Server
│   ├── src/
│   │   ├── controllers/       # API logic
│   │   ├── routes/            # API endpoints
│   │   └── server.js          # Main server file
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── database/
│   │   ├── seeds/             # Demo data
│   │   └── dev.db             # SQLite database
│   └── package.json           # Backend dependencies
│
├── frontend/                   # React App
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── services/          # API calls
│   │   └── App.jsx            # Main app file
│   └── package.json           # Frontend dependencies
│
└── README.md                   # This file!
```

---

## What Each Terminal Does

### Terminal 1 (Backend):
- Runs Express.js server
- Handles API requests
- Manages database
- Listens on port 5000

### Terminal 2 (Frontend):
- Runs Vite dev server
- Serves React app
- Hot reloads on changes
- Listens on port 5173

**Both must be running for the app to work!**

---

## Demo Account Details

**Parent Account:**
- Email: `demo@parent.com`
- Password: `demo123`
- Name: Maria Papadopoulos

**Children:**
1. **Sophia**
   - Age: 12
   - Balance: €50.00
   - Has transactions, budgets, and lessons completed

2. **Nikos**
   - Age: 15
   - Balance: €75.50
   - Has transactions and budgets

---

## Features Available

### ✅ Authentication
- Parent login/register
- Session management
- Protected routes

### ✅ Child Management
- Create children
- View child accounts
- Manage balances

### ✅ Transactions
- Create transactions
- Approve/reject
- Transaction history
- Categories

### ✅ Budgets
- Set spending limits
- Track budget usage
- Weekly/monthly periods

### ✅ Education (Person 3)
- 3 interactive lessons
- Quizzes with instant feedback
- Badge collection
- 6-level progression system
- Progress tracking

### ✅ Goals (NEW!)
- Create savings goals
- Track progress
- Add/withdraw money
- Visual progress bars
- Deadline tracking
- Completion celebrations

---

## Need Help?

### Check These:

1. **Both terminals running?**
   - Backend on port 5000
   - Frontend on port 5173

2. **No error messages?**
   - Check both terminal windows
   - Look for red error text

3. **Browser console clean?**
   - Press F12 in browser
   - Check Console tab
   - Should be no red errors

4. **Correct URL?**
   - Must be `http://localhost:5173`
   - NOT `http://localhost:5000`

5. **Demo credentials correct?**
   - Email: `demo@parent.com`
   - Password: `demo123`

---

## Testing Checklist

After setup, verify these work:

- [ ] Can login with demo account
- [ ] See parent dashboard
- [ ] See 2 children (Sophia, Nikos)
- [ ] Click on child shows their dashboard
- [ ] Can see transactions
- [ ] Can see budgets
- [ ] "Start Learning" button works
- [ ] Can complete a lesson
- [ ] Can earn a badge
- [ ] Can create a goal
- [ ] Can add money to goal
- [ ] Progress bar updates

**If ALL checkboxes work: ✅ Perfect!**

**If ANY fail: ❌ Something's wrong - check errors!**

---

## Summary

### First Time Setup (30 minutes):

1. Install Node.js
2. Navigate to project folder
3. Backend:
   - `npm install`
   - `npx prisma generate`
   - `npx prisma migrate dev`
   - `npm run seed`
   - `npm run dev`
4. Frontend (new terminal):
   - `npm install`
   - `npm run dev`
5. Open `http://localhost:5173`
6. Login with `demo@parent.com` / `demo123`
7. Test all features!

### Every Time After (2 minutes):

1. Terminal 1: `cd backend && npm run dev`
2. Terminal 2: `cd frontend && npm run dev`
3. Browser: `http://localhost:5173`
4. Login and use!

---

**🎉 You're ready to use Future Proof! 🎉**

If you followed all steps exactly, everything should be working perfectly!

---

**Last Updated:** March 27, 2026
**App Version:** 1.0.0
**Created for:** NBG Hackathon 2026
