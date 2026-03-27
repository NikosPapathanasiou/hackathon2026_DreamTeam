# Future Proof - Kid-Friendly Banking App

<div align="center">

**Empowering the next generation with financial literacy**

Built for NBG Hackathon 2026

[Demo](https://your-app.vercel.app) • [Documentation](#documentation) • [API Reference](backend/API_REFERENCE.md)

</div>

---

## 🌟 Overview

Future Proof is a comprehensive banking application designed to teach children financial responsibility through gamification and parental guidance. Parents can manage their children's accounts, set budgets, approve transactions, while children learn about money management through interactive lessons and earn rewards.

### Key Features

- 👨‍👩‍👧‍👦 **Parent Dashboard** - Manage multiple child accounts
- 💳 **Virtual Cards** - Kid-friendly virtual debit cards
- 📊 **Budget Tracking** - Set and monitor spending limits
- ✅ **Transaction Approval** - Parent approval workflow
- 🎓 **Educational Content** - Interactive financial literacy lessons
- 🏆 **Gamification** - Badges, points, and level system
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔒 **Secure** - JWT authentication and encrypted data

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

4. **Access the App**
   - Open `http://localhost:5173`
   - Use demo credentials:
     - Email: `demo@parent.com`
     - Password: `demo123`

---

## 📁 Project Structure

```
project/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   └── utils/          # Helper functions
│   ├── prisma/             # Database schema
│   ├── database/           # Seed scripts
│   └── tests/              # API tests
│
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Login/Register
│   │   │   ├── parent/     # Parent dashboard
│   │   │   ├── child/      # Child dashboard
│   │   │   ├── education/  # Learning modules
│   │   │   └── shared/     # Shared components
│   │   ├── services/       # API client
│   │   ├── store/          # State management
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Helper functions
│   │   └── data/           # Static data (lessons)
│   └── public/             # Static assets
│
└── docs/                   # Documentation
    ├── DEPLOYMENT_GUIDE.md
    ├── TESTING_GUIDE.md
    └── API_REFERENCE.md
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts

### DevOps
- **Version Control**: Git
- **Testing**: Jest, Supertest
- **Deployment**: Vercel (frontend), Railway (backend)
- **CI/CD**: Automatic deployments

---

## 👥 Team Roles

- **Person 1**: Backend Developer - API, Database, Authentication
- **Person 2**: Frontend Developer - UI Components, Parent/Child Dashboards
- **Person 3**: Mobile/UI Developer - Educational Features, Gamification
- **Person 4**: Integration Engineer - Testing, Deployment, Error Handling

---

## 🎯 Core Features

### For Parents

#### Dashboard
- View all children's accounts at a glance
- Monitor total balances and spending
- Quick access to pending transactions

#### Child Management
- Create and manage multiple child accounts
- Set individual PINs for security
- Update balances (allowance, gifts)
- View transaction history per child

#### Transaction Control
- Approve or reject pending transactions
- Real-time notifications (coming soon)
- Transaction categorization
- Monthly/weekly spending reports

#### Budget Management
- Create spending limits by category
- Weekly/monthly budget periods
- Visual progress tracking
- Alerts when approaching limits

### For Children

#### Personal Dashboard
- View current balance
- Virtual card display
- Recent transactions
- Budget progress

#### Educational Journey
- **3 Interactive Lessons**:
  1. What is Money?
  2. Saving vs. Spending
  3. Setting Financial Goals

- **Quiz System**: Test knowledge with instant feedback
- **Badge Collection**: Earn badges for completing lessons
- **Level Progression**: 6 levels from Beginner to Legend
- **Points System**: Accumulate points for achievements

#### Gamification
- Earn badges for milestones
- Level up through learning
- Track learning statistics
- View achievements timeline

---

## 🎓 Educational Content

### Lesson 1: What is Money?
- Duration: 5 minutes
- Age: 8-12 years
- Points: 100
- Topics: Basic currency, history of money, why we use money
- Badge: Money Master 💰

### Lesson 2: Saving vs. Spending
- Duration: 7 minutes
- Age: 8-12 years
- Points: 150
- Topics: Difference between saving and spending, budgeting basics
- Badge: Smart Saver 🏦

### Lesson 3: Setting Goals
- Duration: 6 minutes
- Age: 8-12 years
- Points: 200
- Topics: Short/long-term goals, saving strategies, goal tracking
- Badge: Goal Getter 🎯

---

## 🔐 Security

- **Authentication**: JWT tokens with httpOnly cookies
- **Password Hashing**: bcrypt with salt rounds
- **Authorization**: Middleware-based access control
- **CORS**: Configured for specific origins only
- **Input Validation**: All inputs validated server-side
- **SQL Injection**: Prevented via Prisma ORM
- **XSS Protection**: React's built-in escaping

---

## 📊 Database Schema

### Users (Parents)
- id, email, password, name
- One-to-many relationship with Children

### Children
- id, userId, name, age, balance, pin
- One-to-many relationships with Transactions, Budgets, EducationalProgress

### Transactions
- id, childId, amount, description, category, status
- Status: pending, approved, rejected

### Budgets
- id, childId, category, limitAmount, currentSpent, period
- Period: weekly, monthly

### EducationalProgress
- id, childId, lessonId, lessonTitle, completed, score, completedAt

---

## 🧪 Testing

### API Testing

```bash
cd backend
npm test
```

### Manual Testing with Postman
- Import `POSTMAN_COLLECTION.json`
- Set base URL to `http://localhost:5000/api`
- Run through test scenarios

### User Flow Testing
See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive test scenarios

---

## 🚢 Deployment

### Quick Deploy

1. **Backend** (Railway)
   - Connect GitHub repo
   - Add PostgreSQL database
   - Set environment variables
   - Deploy automatically

2. **Frontend** (Vercel)
   - Import from GitHub
   - Set `VITE_API_URL`
   - Deploy with one click

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Environment Variables

**Backend:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Frontend:**
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 📖 Documentation

- [API Reference](backend/API_REFERENCE.md) - Complete API documentation
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [Testing Guide](TESTING_GUIDE.md) - Testing strategies and scenarios
- [Person 3 Implementation](PERSON3_IMPLEMENTATION.md) - Educational features
- [Person 4 Implementation](PERSON4_IMPLEMENTATION.md) - Integration & testing

---

## 🎨 Design System

### Colors
- Primary: Blue (#3b82f6)
- Secondary: Purple (#8b5cf6)
- Accent: Pink (#ec4899)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)

### Typography
- Font: System font stack
- Headings: Bold, large sizes
- Body: Regular, readable sizes

### Components
- Consistent rounded corners (rounded-xl)
- Shadow depths for elevation
- Gradient backgrounds for emphasis
- Icon-first design for clarity

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

---

## 📝 License

This project is created for the NBG Hackathon 2026.

---

## 🙏 Acknowledgments

- National Bank of Greece for hosting the hackathon
- React and Express.js communities
- All open-source libraries used in this project

---

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact the team

---

## 🎯 Future Roadmap

- [ ] Real-time notifications
- [ ] Mobile native apps (iOS/Android)
- [ ] Parent-child messaging
- [ ] Goal setting with automatic savings
- [ ] Chores and rewards system
- [ ] Multi-currency support
- [ ] Family sharing features
- [ ] Advanced analytics dashboard
- [ ] Integration with real banking APIs
- [ ] AI-powered financial advice

---

<div align="center">

**Built with ❤️ for NBG Hackathon 2026**

</div>
