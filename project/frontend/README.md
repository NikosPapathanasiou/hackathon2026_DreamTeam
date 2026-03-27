# Future Proof App - Frontend

**Person 2: Frontend Developer**
**NBG Hackathon 2026**

React + Vite frontend application with Tailwind CSS for the Future Proof financial education app.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will run on **http://localhost:5173**

### 3. Make sure Backend is Running
The frontend connects to backend at `http://localhost:5000`

Start backend first:
```bash
cd ../backend
npm run dev
```

---

## 📦 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Login, Register
│   │   ├── parent/            # Parent Dashboard, Child Cards, Transaction Approval
│   │   ├── child/             # Child Dashboard, Balance, Budget, Virtual Card
│   │   └── shared/            # Navigation, ProtectedRoute
│   ├── services/
│   │   └── api.js             # Backend API calls
│   ├── store/
│   │   └── authStore.js       # Zustand auth state
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind styles
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
└── package.json               # Dependencies
```

---

## 🎨 Components Built

### Authentication (2 components)
- ✅ **Login.jsx** - Login form with demo credentials
- ✅ **Register.jsx** - Registration form

### Parent View (3 components)
- ✅ **ParentDashboard.jsx** - Main dashboard with summary
- ✅ **ChildAccountCard.jsx** - Individual child card
- ✅ **TransactionApproval.jsx** - Approve/reject transactions

### Child View (5 components)
- ✅ **ChildDashboard.jsx** - Child's main view
- ✅ **BalanceDisplay.jsx** - Current balance card
- ✅ **VirtualCard.jsx** - Virtual debit card display
- ✅ **BudgetTracker.jsx** - Budget progress bars
- ✅ **TransactionList.jsx** - Transaction history

### Shared (2 components)
- ✅ **Navigation.jsx** - Top navigation bar
- ✅ **ProtectedRoute.jsx** - Route authentication guard

---

## 🔌 API Integration

All API calls are in `src/services/api.js`

### Available API Functions:

**Auth API**
```javascript
import { authAPI } from './services/api';

authAPI.register({ email, password, name });
authAPI.login({ email, password });
authAPI.getProfile();
```

**Children API**
```javascript
import { childrenAPI } from './services/api';

childrenAPI.getAll();
childrenAPI.getById(id);
childrenAPI.create({ name, age, pin });
childrenAPI.update(id, data);
childrenAPI.delete(id);
childrenAPI.getBalance(id);
```

**Transactions API**
```javascript
import { transactionsAPI } from './services/api';

transactionsAPI.create({ childId, amount, description, category });
transactionsAPI.getByChild(childId);
transactionsAPI.getPending();
transactionsAPI.approve(id);
transactionsAPI.reject(id);
```

**Budgets API**
```javascript
import { budgetsAPI } from './services/api';

budgetsAPI.create({ childId, category, limitAmount, period });
budgetsAPI.getByChild(childId);
budgetsAPI.update(id, data);
budgetsAPI.delete(id);
budgetsAPI.reset(id);
```

---

## 🎯 Features Implemented

### Parent Dashboard
- ✅ View all children accounts
- ✅ See total balance across all children
- ✅ View pending transaction approvals
- ✅ Approve/reject child spending requests
- ✅ Quick stats cards
- ✅ Add new child button (UI ready)

### Child Dashboard
- ✅ View current balance
- ✅ Virtual debit card display
- ✅ Budget tracking with progress bars
- ✅ Transaction history
- ✅ Budget status warnings
- ✅ Educational progress (data display)

### Authentication
- ✅ Login with email/password
- ✅ Register new parent account
- ✅ Auto-redirect after login
- ✅ Protected routes
- ✅ Token management
- ✅ Logout functionality

---

## 🎨 Styling

### Tailwind CSS Classes Used

**Color Palette**:
- Primary: Blue (`blue-500`, `blue-600`)
- Success: Green (`green-500`, `green-600`)
- Warning: Yellow/Orange (`yellow-500`, `orange-600`)
- Danger: Red (`red-500`, `red-600`)
- Purple/Pink: Child theme (`purple-500`, `pink-500`)

**Components**:
- Cards: `rounded-xl shadow-lg p-6`
- Buttons: `rounded-lg px-4 py-2 font-semibold`
- Inputs: `rounded-lg px-4 py-3 border focus:ring-2`
- Gradients: `bg-gradient-to-br from-blue-50 to-indigo-100`

---

## 🔐 Authentication Flow

1. User visits app → redirected to `/login`
2. User logs in → token saved to localStorage
3. Token attached to all API requests via Axios interceptor
4. Protected routes check `isAuthenticated` state
5. Logout → token removed → redirect to login

**Demo Credentials**:
- Email: `demo@parent.com`
- Password: `demo123`

---

## 📱 Responsive Design

All components are responsive:
- **Mobile**: Single column layout
- **Tablet**: 2-column grids
- **Desktop**: 3-column grids

Key responsive utilities:
- `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `hidden md:flex` (mobile menu)
- `px-4 sm:px-6 lg:px-8` (padding)

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🧪 Testing Your Work

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Flow
1. Visit http://localhost:5173
2. Login with `demo@parent.com` / `demo123`
3. View parent dashboard with 2 demo children
4. Click "View Details" on a child
5. See child dashboard with balance, card, budgets
6. Go back and approve/reject pending transactions

---

## 🤝 Integration with Backend (Person 1)

**Backend must be running on:** `http://localhost:5000`

**CORS is configured** to allow requests from `http://localhost:5173`

**API calls use**:
- JWT token in `Authorization: Bearer <token>` header
- JSON content type
- Automatic error handling (401 → logout)

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### Environment Variables for Production
```
VITE_API_URL=https://your-backend-url.com/api
```

Update `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 📝 Notes for Person 2 (Frontend Developer)

✅ **Completed:**
- Full React application with Vite
- 12 components built
- Tailwind CSS styling
- Responsive design
- API integration with Axios
- Zustand state management
- React Router navigation
- Protected routes
- Login/Register flows
- Parent & Child dashboards

🔄 **Next Steps:**
- Test all components
- Fix any UI bugs
- Add loading states where needed
- Improve mobile experience
- Add error boundaries
- Coordinate with Person 1 on API issues

---

## 🐛 Common Issues & Fixes

### Issue: "Cannot connect to backend"
**Fix**: Make sure backend is running on port 5000

### Issue: "CORS error"
**Fix**: Backend `.env` should have `ALLOWED_ORIGINS=http://localhost:5173`

### Issue: "Module not found"
**Fix**: Run `npm install`

### Issue: "Vite not found"
**Fix**: Run `npm install -g vite` or use `npx vite`

### Issue: "Token expired"
**Fix**: Logout and login again

---

## 💡 Future Enhancements

Ideas for improvement:
- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Add toast notifications
- [ ] Add "Add Child" modal
- [ ] Add "Add Transaction" form
- [ ] Add "Create Budget" form
- [ ] Add animations with Framer Motion
- [ ] Add dark mode
- [ ] Add Greek language support
- [ ] Add PWA support

---

## 🎯 Component Props Reference

### ChildAccountCard
```javascript
<ChildAccountCard
  child={{
    id: number,
    name: string,
    age: number,
    balance: number,
    transactions: array,
    _count: { transactions: number, educationalProgress: number }
  }}
  onUpdate={function}
/>
```

### TransactionApproval
```javascript
<TransactionApproval
  transactions={[
    {
      id: number,
      amount: number,
      description: string,
      category: string,
      status: string,
      child: { name: string, balance: number }
    }
  ]}
  onUpdate={function}
/>
```

### BudgetTracker
```javascript
<BudgetTracker
  budgets={[
    {
      id: number,
      category: string,
      limitAmount: number,
      currentSpent: number,
      period: string
    }
  ]}
/>
```

---

## 📞 Support

For issues or questions:
- Check backend logs if API calls fail
- Use browser DevTools Network tab to debug requests
- Check browser console for errors
- Contact Person 1 for API issues
- Contact Person 4 for deployment help

---

**Built with ❤️ for NBG Hackathon 2026**
