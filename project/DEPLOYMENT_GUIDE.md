# Deployment Guide - Future Proof App

## Overview
This guide will help you deploy the Future Proof banking app to production.

---

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally
- Accounts on deployment platforms:
  - **Frontend**: Vercel or Netlify (free tier)
  - **Backend**: Railway, Render, or Fly.io (free tier)
- Database: PostgreSQL (provided by hosting platform)

---

## Part 1: Backend Deployment

### Option A: Deploy to Railway (Recommended)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

3. **Deploy on Railway**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend` folder as root directory

4. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically create `DATABASE_URL`

5. **Set Environment Variables**
   Go to Variables tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```

6. **Configure Build & Start**
   Railway should auto-detect, but verify:
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`

7. **Deploy**
   - Railway will automatically deploy
   - Wait for build to complete
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

8. **Run Database Migrations**
   - Go to Railway dashboard
   - Open your service
   - Go to "Settings" → "Deploy"
   - Migrations run automatically during build

9. **Seed Database (Optional)**
   ```bash
   # In Railway service terminal
   npm run seed
   ```

### Option B: Deploy to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `future-proof-db`
   - Region: Choose closest to your users
   - Plan: Free
   - Click "Create Database"
   - Copy the "Internal Database URL"

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `future-proof-backend`
     - Region: Same as database
     - Branch: `main`
     - Root Directory: `backend`
     - Runtime: `Node`
     - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
     - Start Command: `npm start`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=[paste your internal database URL]
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   ALLOWED_ORIGINS=https://your-frontend-url.netlify.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL

---

## Part 2: Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Framework Preset: Vite
   - Root Directory: `frontend`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

6. **Update Backend CORS**
   - Go back to your backend deployment (Railway/Render)
   - Update `ALLOWED_ORIGINS` environment variable
   - Add your Vercel URL: `https://your-app.vercel.app`
   - Redeploy backend

### Option B: Deploy to Netlify

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository

3. **Configure Build Settings**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Update backend CORS with your Netlify URL

---

## Part 3: Post-Deployment Setup

### 1. Seed Demo Data

```bash
# SSH into your backend (Railway/Render dashboard)
npm run seed
```

Or use the demo credentials after first user registration.

### 2. Test the Application

1. **Visit your frontend URL**
2. **Register a new account** or use demo credentials:
   - Email: `demo@parent.com`
   - Password: `demo123`
3. **Test key features**:
   - Create child account
   - Add transaction
   - Create budget
   - Complete a lesson

### 3. Configure Custom Domain (Optional)

**Vercel:**
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

**Netlify:**
- Go to Domain settings → Add custom domain
- Follow DNS configuration steps

**Backend Custom Domain:**
- Railway/Render both support custom domains in their dashboards

---

## Part 4: Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT tokens (min 32 chars) | `your-super-secret-key-here` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `https://app.vercel.app,https://app.com` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.railway.app/api` |

---

## Part 5: Continuous Deployment

Both Vercel/Netlify and Railway/Render support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

2. **Automatic Deployment**
   - Frontend: Vercel/Netlify auto-deploys on push
   - Backend: Railway/Render auto-deploys on push

3. **Monitor Deployments**
   - Check deployment logs in respective dashboards
   - Verify app is working after deployment

---

## Part 6: Troubleshooting

### Backend Issues

**Issue: Database connection error**
- Verify `DATABASE_URL` is correctly set
- Check database is running
- Ensure migrations have run

**Issue: CORS errors**
- Update `ALLOWED_ORIGINS` to include frontend URL
- Redeploy backend after changing environment variables

**Issue: 500 errors**
- Check backend logs in Railway/Render dashboard
- Verify all environment variables are set
- Check Prisma schema matches database

### Frontend Issues

**Issue: API calls failing**
- Verify `VITE_API_URL` is correct
- Check backend is deployed and running
- Open browser console for detailed errors

**Issue: Build failures**
- Check build logs
- Verify all dependencies in package.json
- Ensure Node version compatibility

**Issue: Blank page after deployment**
- Check browser console for errors
- Verify routing configuration (vercel.json/netlify.toml)
- Check if API URL is accessible

---

## Part 7: Monitoring & Maintenance

### Logs

**Backend Logs:**
- Railway: Dashboard → Deployments → View Logs
- Render: Dashboard → Logs tab

**Frontend Logs:**
- Vercel: Dashboard → Deployments → Function Logs
- Netlify: Dashboard → Deploys → Deploy log

### Database Backups

**Railway:**
- Automatic daily backups on paid plans
- Manual backups: Database → Backups

**Render:**
- Automatic daily backups
- Access via PostgreSQL dashboard

### Performance Monitoring

Consider adding:
- Sentry for error tracking
- Google Analytics for usage stats
- LogRocket for session replay

---

## Demo Credentials

After seeding, use these credentials to demo the app:

**Parent Account:**
- Email: `demo@parent.com`
- Password: `demo123`

**Children:**
- Sophia (Age 12, Balance: €50.00)
- Nikos (Age 15, Balance: €75.50)

---

## Security Checklist

- ✅ HTTPS enabled (automatic on Vercel/Netlify)
- ✅ Environment variables secured (not in code)
- ✅ JWT secret is strong and random
- ✅ CORS properly configured
- ✅ Database credentials secured
- ✅ No sensitive data in logs
- ✅ Dependencies up to date

---

## Cost Estimate

**Free Tier (Suitable for Demo/MVP):**
- Frontend (Vercel/Netlify): Free
- Backend (Railway/Render): Free
- Database (PostgreSQL): Free
- Total: **€0/month**

**Limitations:**
- Railway: 500 hours/month, sleeps after inactivity
- Render: Sleeps after 15 min inactivity on free tier
- Vercel: 100GB bandwidth/month
- Netlify: 100GB bandwidth/month

**Paid Tier (Production Ready):**
- Frontend: ~€20/month
- Backend: ~€7-20/month
- Database: ~€7-15/month
- Total: **~€34-55/month**

---

## Next Steps

1. Set up monitoring and error tracking
2. Configure custom domain
3. Add SSL certificates (automatic on most platforms)
4. Set up CI/CD testing pipeline
5. Create backup strategy
6. Document API endpoints
7. Add rate limiting
8. Implement caching

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Prisma Docs**: https://www.prisma.io/docs

---

**Deployment completed by:** Person 4 - Integration Engineer
**Last updated:** March 27, 2026
