# Future Proof App - API Reference

**Quick reference for all API endpoints**

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication

### Register Parent Account
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "secure123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "parent@example.com",
    "name": "John Doe"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@parent.com",
  "password": "demo123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "demo@parent.com",
    "name": "Maria Papadopoulos"
  }
}
```

### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "demo@parent.com",
    "name": "Maria Papadopoulos",
    "createdAt": "2026-03-27T10:00:00.000Z",
    "children": [
      {
        "id": 1,
        "name": "Sophia",
        "age": 12,
        "balance": 50.00
      }
    ]
  }
}
```

---

## 👶 Children

### Create Child Account
```http
POST /api/children
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alex",
  "age": 10,
  "pin": "1234"
}
```

**Response:**
```json
{
  "message": "Child account created successfully",
  "child": {
    "id": 3,
    "name": "Alex",
    "age": 10,
    "balance": 0
  }
}
```

### Get All Children
```http
GET /api/children
Authorization: Bearer <token>
```

**Response:**
```json
{
  "children": [
    {
      "id": 1,
      "name": "Sophia",
      "age": 12,
      "balance": 50.00,
      "transactions": [...],
      "budgets": [...],
      "_count": {
        "transactions": 4,
        "educationalProgress": 3
      }
    }
  ]
}
```

### Get Child by ID
```http
GET /api/children/1
Authorization: Bearer <token>
```

### Update Child
```http
PATCH /api/children/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sophia Maria",
  "age": 13
}
```

### Delete Child
```http
DELETE /api/children/1
Authorization: Bearer <token>
```

### Get Child Balance
```http
GET /api/children/1/balance
Authorization: Bearer <token>
```

**Response:**
```json
{
  "balance": 50.00,
  "child": {
    "id": 1,
    "name": "Sophia",
    "balance": 50.00
  }
}
```

---

## 💳 Transactions

### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "childId": 1,
  "amount": -10.50,
  "description": "Pizza lunch",
  "category": "Food"
}
```

**Note**:
- Negative amount = spending (requires approval)
- Positive amount = deposit/allowance (auto-approved)

**Response:**
```json
{
  "message": "Transaction created successfully",
  "transaction": {
    "id": 5,
    "amount": -10.50,
    "description": "Pizza lunch",
    "category": "Food",
    "status": "pending",
    "childId": 1,
    "createdAt": "2026-03-27T12:00:00.000Z"
  }
}
```

### Get Child's Transactions
```http
GET /api/transactions/child/1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "transactions": [
    {
      "id": 1,
      "amount": -5.50,
      "description": "Ice cream",
      "category": "Food",
      "status": "approved",
      "createdAt": "2026-03-25T10:00:00.000Z"
    },
    ...
  ]
}
```

### Get All Pending Transactions
```http
GET /api/transactions/pending
Authorization: Bearer <token>
```

**Response:**
```json
{
  "transactions": [
    {
      "id": 3,
      "amount": -8.00,
      "description": "Movie ticket",
      "status": "pending",
      "child": {
        "id": 1,
        "name": "Sophia",
        "balance": 50.00
      }
    }
  ]
}
```

### Approve Transaction
```http
PATCH /api/transactions/3/approve
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Transaction approved",
  "transaction": {
    "id": 3,
    "status": "approved",
    ...
  }
}
```

### Reject Transaction
```http
PATCH /api/transactions/3/reject
Authorization: Bearer <token>
```

---

## 💰 Budgets

### Create Budget
```http
POST /api/budgets
Authorization: Bearer <token>
Content-Type: application/json

{
  "childId": 1,
  "category": "Weekly Spending",
  "limitAmount": 30.00,
  "period": "weekly"
}
```

**Response:**
```json
{
  "message": "Budget created successfully",
  "budget": {
    "id": 1,
    "category": "Weekly Spending",
    "limitAmount": 30.00,
    "currentSpent": 0,
    "period": "weekly",
    "childId": 1
  }
}
```

### Get Child's Budgets
```http
GET /api/budgets/child/1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "budgets": [
    {
      "id": 1,
      "category": "Weekly Spending",
      "limitAmount": 30.00,
      "currentSpent": 17.50,
      "period": "weekly",
      "percentUsed": 58.33,
      "remaining": 12.50
    }
  ]
}
```

### Update Budget
```http
PATCH /api/budgets/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "limitAmount": 40.00,
  "currentSpent": 20.00
}
```

### Delete Budget
```http
DELETE /api/budgets/1
Authorization: Bearer <token>
```

### Reset Budget (New Period)
```http
POST /api/budgets/1/reset
Authorization: Bearer <token>
```

---

## 📚 Educational Progress

### Record Lesson Progress
```http
POST /api/education/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "childId": 1,
  "lessonId": 1,
  "lessonTitle": "What is Money?",
  "completed": true,
  "score": 95
}
```

**Response:**
```json
{
  "message": "Progress recorded successfully",
  "progress": {
    "id": 1,
    "lessonId": 1,
    "lessonTitle": "What is Money?",
    "completed": true,
    "score": 95,
    "completedAt": "2026-03-27T12:00:00.000Z",
    "childId": 1
  }
}
```

### Get Child's Progress
```http
GET /api/education/progress/child/1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "progress": [
    {
      "id": 1,
      "lessonId": 1,
      "lessonTitle": "What is Money?",
      "completed": true,
      "score": 95,
      "completedAt": "2026-03-20T10:00:00.000Z"
    }
  ],
  "stats": {
    "completedLessons": 2,
    "totalLessons": 3,
    "averageScore": 92,
    "completionRate": 67
  }
}
```

### Get Specific Lesson Progress
```http
GET /api/education/progress/child/1/lesson/1
Authorization: Bearer <token>
```

---

## 🏥 Health Check

### Check API Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Future Proof API is running",
  "timestamp": "2026-03-27T12:00:00.000Z"
}
```

---

## 🔑 Authentication Header Format

All protected endpoints require:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get token from `/api/auth/login` or `/api/auth/register` response.

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "error": "All fields are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "Child not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Server error"
}
```

---

## 📝 Categories

Common transaction/budget categories:
- `Food`
- `Entertainment`
- `Education`
- `Savings`
- `Allowance`
- `Electronics`
- `Clothing`
- `Other`

---

## 🎯 Quick Test Flow

```bash
# 1. Register
POST /api/auth/register
{ "email": "test@test.com", "password": "test123", "name": "Test" }

# 2. Create child
POST /api/children
{ "name": "Kid", "age": 10 }

# 3. Add allowance (auto-approved)
POST /api/transactions
{ "childId": 1, "amount": 50, "description": "Allowance", "category": "Allowance" }

# 4. Create spending (pending approval)
POST /api/transactions
{ "childId": 1, "amount": -10, "description": "Snack", "category": "Food" }

# 5. Approve spending
PATCH /api/transactions/2/approve

# 6. Check balance
GET /api/children/1/balance
```

---

**All endpoints tested and working!** ✅
