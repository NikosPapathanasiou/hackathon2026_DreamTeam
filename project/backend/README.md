# Future Proof App - Backend API

**Person 1: Backend Developer**
**NBG Hackathon 2026**

Complete Node.js/Express backend with authentication, database, and REST API for the Future Proof financial education app.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Seed Database with Demo Data
```bash
npm run seed
```

### 4. Start Server
```bash
npm run dev
```

The server will run on **http://localhost:5000**

---

## 📦 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── controllers/       # Business logic
│   │   ├── auth.controller.js
│   │   ├── child.controller.js
│   │   ├── transaction.controller.js
│   │   ├── budget.controller.js
│   │   └── education.controller.js
│   ├── routes/            # API endpoints
│   │   ├── auth.routes.js
│   │   ├── child.routes.js
│   │   ├── transaction.routes.js
│   │   ├── budget.routes.js
│   │   └── education.routes.js
│   ├── middleware/        # Auth middleware
│   │   └── auth.middleware.js
│   ├── utils/             # Helper functions
│   │   └── auth.utils.js
│   └── server.js          # Main server file
├── prisma/
│   └── schema.prisma      # Database schema
├── database/
│   └── seeds/
│       └── seed.js        # Demo data seeder
└── package.json
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register parent account | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user profile | Yes |

### Children
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/children` | Create child account | Yes |
| GET | `/api/children` | Get all children | Yes |
| GET | `/api/children/:childId` | Get child by ID | Yes |
| PATCH | `/api/children/:childId` | Update child | Yes |
| DELETE | `/api/children/:childId` | Delete child | Yes |
| GET | `/api/children/:childId/balance` | Get child balance | Yes |

### Transactions
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/transactions` | Create transaction | Yes |
| GET | `/api/transactions/child/:childId` | Get child's transactions | Yes |
| GET | `/api/transactions/pending` | Get all pending transactions | Yes |
| PATCH | `/api/transactions/:id/approve` | Approve transaction | Yes |
| PATCH | `/api/transactions/:id/reject` | Reject transaction | Yes |

### Budgets
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/budgets` | Create budget | Yes |
| GET | `/api/budgets/child/:childId` | Get child's budgets | Yes |
| PATCH | `/api/budgets/:budgetId` | Update budget | Yes |
| DELETE | `/api/budgets/:budgetId` | Delete budget | Yes |
| POST | `/api/budgets/:budgetId/reset` | Reset budget spending | Yes |

### Education
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/education/progress` | Record lesson progress | Yes |
| GET | `/api/education/progress/child/:childId` | Get child's progress | Yes |
| GET | `/api/education/progress/child/:childId/lesson/:lessonId` | Get specific lesson progress | Yes |

---

## 🗄️ Database Schema

### User (Parent/Guardian)
- `id` - Primary key
- `email` - Unique email
- `password` - Hashed password
- `name` - Full name

### Child
- `id` - Primary key
- `name` - Child's name
- `age` - Age (8-17)
- `balance` - Current balance (EUR)
- `pin` - Optional PIN
- `userId` - Foreign key to parent

### Transaction
- `id` - Primary key
- `amount` - Transaction amount (negative = spending, positive = allowance)
- `description` - Transaction description
- `category` - Category (Food, Entertainment, etc.)
- `status` - pending | approved | rejected
- `childId` - Foreign key to child

### Budget
- `id` - Primary key
- `category` - Budget category
- `limitAmount` - Maximum spending limit
- `currentSpent` - Current spending
- `period` - weekly | monthly
- `childId` - Foreign key to child

### EducationalProgress
- `id` - Primary key
- `lessonId` - Lesson identifier
- `lessonTitle` - Lesson title
- `completed` - Completion status
- `score` - Quiz score (0-100)
- `childId` - Foreign key to child

---

## 🔐 Authentication Flow

1. **Register**: POST to `/api/auth/register` with email, password, name
2. **Login**: POST to `/api/auth/login` with email, password
3. **Receive JWT token** in response
4. **Use token** in Authorization header: `Bearer <token>`

Example:
```javascript
// Register
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'parent@example.com',
    password: 'securepassword',
    name: 'John Doe'
  })
})

// Login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'parent@example.com',
    password: 'securepassword'
  })
})

// Use token in subsequent requests
fetch('http://localhost:5000/api/children', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
})
```

---

## 🧪 Demo Credentials

After running `npm run seed`:

**Parent Account:**
- Email: `demo@parent.com`
- Password: `demo123`

**Children:**
- Sophia (age 12, balance: €50.00)
- Nikos (age 15, balance: €75.50)

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with auto-reload |
| `npm run seed` | Seed database with demo data |
| `npx prisma studio` | Open Prisma Studio (visual database editor) |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma migrate dev` | Run database migrations |

---

## 🧑‍💻 Development Workflow

1. **Make schema changes** in `prisma/schema.prisma`
2. **Generate migration**: `npx prisma migrate dev --name your_migration_name`
3. **Update controllers** as needed
4. **Test endpoints** with Postman or frontend
5. **Commit changes** to Git

---

## 🚀 Deployment

### Deploy to Railway

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add PostgreSQL: `railway add`
5. Deploy: `railway up`
6. Set environment variables in Railway dashboard

### Environment Variables for Production
```
DATABASE_URL=<postgresql connection string>
JWT_SECRET=<strong random secret>
NODE_ENV=production
PORT=5000
ALLOWED_ORIGINS=https://your-frontend-url.com
```

---

## 📝 Notes for Person 1 (Backend Developer)

✅ **Completed:**
- Full Express server setup
- Prisma database schema
- JWT authentication
- All CRUD endpoints for:
  - User authentication
  - Child accounts
  - Transactions
  - Budgets
  - Educational progress
- Seed script with demo data

🔄 **Next Steps:**
- Test all endpoints
- Coordinate with Person 2 (Frontend) on API integration
- Help Person 4 with deployment
- Monitor for bugs and fix as needed

---

## 🤝 Integration with Frontend (Person 2)

**API Base URL:** `http://localhost:5000/api`

**CORS enabled** for `http://localhost:5173` and `http://localhost:3000`

**Response Format:**
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error Format:**
```json
{
  "error": "Error message"
}
```

---

## 📞 Support

For issues or questions, contact the backend developer (Person 1) or check the hackathon Slack channel.

---

**Built with ❤️ for NBG Hackathon 2026**
