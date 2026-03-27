# Testing Guide - Future Proof App

## Overview
Comprehensive testing strategy for the Future Proof banking application.

---

## Testing Stack

- **Backend API Tests**: Jest / Supertest
- **Frontend Component Tests**: Vitest / React Testing Library
- **E2E Tests**: Playwright (optional)
- **API Testing**: Postman / Thunder Client
- **Browser Testing**: Chrome DevTools, Firefox DevTools

---

## 1. Backend API Testing

### Setup

```bash
cd backend
npm install --save-dev jest supertest @types/jest
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test auth.test.js
```

### Test Structure

```javascript
describe('Feature Name', () => {
  beforeAll(async () => {
    // Setup before all tests
  });

  afterAll(async () => {
    // Cleanup after all tests
  });

  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should do something', async () => {
    // Test implementation
  });
});
```

### Example API Test

```javascript
const request = require('supertest');
const app = require('../src/server');

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'demo@parent.com',
        password: 'demo123'
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email');
  });
});
```

---

## 2. Manual API Testing with Postman

### Import Collection

1. Open Postman
2. Create new collection: "Future Proof API"
3. Set base URL variable: `{{baseUrl}}` = `http://localhost:5000/api`

### Test Endpoints

#### Authentication

**Register**
```
POST {{baseUrl}}/auth/register
Body (JSON):
{
  "email": "test@example.com",
  "password": "Test123!",
  "name": "Test User"
}
```

**Login**
```
POST {{baseUrl}}/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "Test123!"
}
```

**Get Profile**
```
GET {{baseUrl}}/auth/profile
Headers:
  Authorization: Bearer {{token}}
```

#### Children Management

**Create Child**
```
POST {{baseUrl}}/children
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "name": "John",
  "age": 10,
  "pin": "1234"
}
```

**Get All Children**
```
GET {{baseUrl}}/children
Headers:
  Authorization: Bearer {{token}}
```

#### Transactions

**Create Transaction**
```
POST {{baseUrl}}/transactions
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "childId": 1,
  "amount": -10.50,
  "description": "Ice cream",
  "category": "Food"
}
```

**Get Child Transactions**
```
GET {{baseUrl}}/transactions/child/1
Headers:
  Authorization: Bearer {{token}}
```

**Approve Transaction**
```
PATCH {{baseUrl}}/transactions/1/approve
Headers:
  Authorization: Bearer {{token}}
```

#### Budgets

**Create Budget**
```
POST {{baseUrl}}/budgets
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "childId": 1,
  "category": "Weekly Spending",
  "limitAmount": 50.00,
  "period": "weekly"
}
```

**Get Child Budgets**
```
GET {{baseUrl}}/budgets/child/1
Headers:
  Authorization: Bearer {{token}}
```

#### Education

**Record Progress**
```
POST {{baseUrl}}/education/progress
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "childId": 1,
  "lessonId": 1,
  "lessonTitle": "What is Money?",
  "completed": true,
  "score": 95
}
```

**Get Progress**
```
GET {{baseUrl}}/education/progress/child/1
Headers:
  Authorization: Bearer {{token}}
```

---

## 3. User Flow Testing

### Test Scenario 1: New Parent Onboarding

1. **Register Account**
   - Navigate to `/register`
   - Fill in email, password, name
   - Submit form
   - Verify redirect to dashboard
   - Check authentication token stored

2. **Create First Child**
   - Click "Add Child" button
   - Enter child details (name, age, PIN)
   - Submit form
   - Verify child appears in list
   - Check child balance is €0.00

3. **Add Initial Balance**
   - Select child
   - Create deposit transaction
   - Amount: €50.00
   - Description: "Initial balance"
   - Verify balance updates

4. **Set Up Budget**
   - Navigate to child dashboard
   - Click "Create Budget"
   - Set weekly spending limit: €20.00
   - Verify budget appears

5. **Complete First Lesson**
   - Click "Start Learning"
   - Select lesson "What is Money?"
   - Go through all slides
   - Complete quiz (aim for 70%+)
   - Verify badge earned
   - Check points added

### Test Scenario 2: Transaction Approval Flow

1. **Login as Parent**
   - Email: demo@parent.com
   - Password: demo123

2. **Navigate to Dashboard**
   - Verify children list loads
   - Check pending transactions count

3. **Review Pending Transaction**
   - Click on pending transaction
   - View transaction details
   - Check category, amount, description

4. **Approve Transaction**
   - Click "Approve" button
   - Verify status changes to "approved"
   - Check child balance updated
   - Verify budget updated (if applicable)

5. **Reject Transaction**
   - Find another pending transaction
   - Click "Reject" button
   - Verify status changes to "rejected"
   - Check balance NOT updated

### Test Scenario 3: Educational Journey

1. **Start Lesson**
   - Login as parent
   - Navigate to child's education tab
   - Click "Learn" tab
   - Select "Saving vs. Spending"

2. **Complete Lesson**
   - Read through all content slides
   - Click "Next" on each slide
   - Verify progress bar updates

3. **Take Quiz**
   - Answer all 3 questions
   - Submit quiz
   - Check score (must be 70%+ to pass)

4. **Earn Badge**
   - If passed, verify badge awarded
   - Check points added to total
   - View badge in "Badges" tab

5. **Track Progress**
   - Click "Progress" tab
   - Verify stats updated
   - Check lesson history

6. **Level Up**
   - Complete more lessons
   - Click "Level" tab
   - Verify level progress
   - Check points threshold

---

## 4. Cross-Browser Testing

### Desktop Browsers

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Key Features to Test:

1. **Authentication**
   - Login/Register forms work
   - Session persistence
   - Logout functionality

2. **Dashboard**
   - All components render correctly
   - Charts/graphs display properly
   - Animations are smooth

3. **Forms**
   - Input validation works
   - Error messages display
   - Submit buttons enabled/disabled correctly

4. **Navigation**
   - Links work correctly
   - Back button works
   - Routing is correct

5. **Responsive Design**
   - Resize browser window
   - Check breakpoints:
     - Mobile: 320px - 767px
     - Tablet: 768px - 1023px
     - Desktop: 1024px+

---

## 5. Mobile Responsiveness Testing

### Testing Methods

1. **Browser DevTools**
   - Open Chrome DevTools (F12)
   - Click device toolbar icon
   - Test various device sizes

2. **Real Devices**
   - Test on actual phones/tablets if available
   - iOS and Android

### Devices to Test:

- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPad (768x1024)
- Samsung Galaxy S21 (360x800)
- Generic Android tablet (800x1280)

### Features to Verify:

1. **Touch Interactions**
   - Buttons are tappable (min 44x44px)
   - Swipe gestures work (if any)
   - No hover-only interactions

2. **Layout**
   - Text is readable without zooming
   - Images scale correctly
   - No horizontal scrolling
   - Forms fit on screen

3. **Performance**
   - Pages load quickly
   - Animations are smooth
   - No layout shifts

4. **Specific Components**
   - Virtual card displays correctly
   - Charts are readable
   - Tables scroll horizontally if needed
   - Modals/popups work on mobile

---

## 6. Performance Testing

### Metrics to Check

1. **Load Time**
   - Initial page load: < 3 seconds
   - Time to interactive: < 5 seconds

2. **Bundle Size**
   ```bash
   cd frontend
   npm run build
   # Check dist folder size
   ```
   - JavaScript bundle: < 500KB
   - Total bundle: < 1MB

3. **API Response Times**
   - Authentication: < 500ms
   - Data fetch: < 1000ms
   - Mutations: < 500ms

### Tools

- Chrome Lighthouse
- WebPageTest
- Network tab in DevTools

### Optimization Checklist

- ✅ Images optimized
- ✅ Code splitting implemented
- ✅ Lazy loading for routes
- ✅ API calls optimized
- ✅ No unnecessary re-renders
- ✅ Database queries optimized

---

## 7. Security Testing

### Backend Security

1. **Authentication**
   - [ ] JWT tokens properly signed
   - [ ] Passwords hashed with bcrypt
   - [ ] Token expiration working
   - [ ] Refresh tokens implemented (if applicable)

2. **Authorization**
   - [ ] Users can only access their own data
   - [ ] Parent can only see their children
   - [ ] Child accounts properly isolated

3. **Input Validation**
   - [ ] SQL injection prevented (Prisma handles this)
   - [ ] XSS prevention
   - [ ] CSRF protection
   - [ ] Rate limiting (optional)

4. **CORS**
   - [ ] Only allowed origins can access API
   - [ ] Credentials properly handled

### Frontend Security

1. **Data Storage**
   - [ ] No sensitive data in localStorage
   - [ ] Tokens stored securely
   - [ ] No passwords in client code

2. **API Calls**
   - [ ] Always use HTTPS in production
   - [ ] Tokens sent in headers
   - [ ] Error messages don't leak info

---

## 8. Error Handling Testing

### Test Error Scenarios

1. **Network Errors**
   - Disconnect internet
   - Verify error messages appear
   - Check app doesn't crash

2. **Invalid Input**
   - Submit empty forms
   - Enter invalid email formats
   - Enter negative numbers where not allowed
   - Verify validation messages

3. **Server Errors**
   - Stop backend server
   - Try to make API calls
   - Verify appropriate error messages

4. **Not Found**
   - Navigate to invalid child ID
   - Check 404 handling
   - Verify redirect or error page

5. **Unauthorized Access**
   - Try to access protected routes without login
   - Verify redirect to login page
   - Check token expiration handling

---

## 9. Accessibility Testing

### Tools

- axe DevTools browser extension
- Lighthouse accessibility score
- Keyboard navigation test

### Checklist

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text
- [ ] Color contrast meets WCAG AA
- [ ] Can navigate with keyboard only
- [ ] Screen reader friendly
- [ ] Focus indicators visible
- [ ] Semantic HTML used

---

## 10. Test Checklist

### Before Deployment

- [ ] All API endpoints tested
- [ ] User flows tested end-to-end
- [ ] Forms validation working
- [ ] Error handling implemented
- [ ] Loading states present
- [ ] Empty states designed
- [ ] Success messages display
- [ ] Mobile responsive on all pages
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Demo data seeded
- [ ] Environment variables configured
- [ ] CORS properly set

### Post-Deployment

- [ ] Production URL accessible
- [ ] HTTPS working
- [ ] API calls working from frontend
- [ ] Database migrations ran
- [ ] Demo credentials work
- [ ] All features functional
- [ ] No console errors
- [ ] Analytics setup (if applicable)
- [ ] Monitoring in place

---

## Common Issues & Solutions

### Issue: API calls return 401
**Solution:** Check authentication token, verify it's being sent in headers

### Issue: CORS errors
**Solution:** Update ALLOWED_ORIGINS in backend, redeploy

### Issue: Database errors
**Solution:** Run migrations, check DATABASE_URL

### Issue: Blank page in production
**Solution:** Check API_URL environment variable, verify routing config

### Issue: Slow load times
**Solution:** Optimize images, implement code splitting, check API response times

---

## Automated Testing Scripts

### Backend Test Script

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Frontend Test Script

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

**Testing Guide created by:** Person 4 - Integration Engineer
**Last updated:** March 27, 2026
