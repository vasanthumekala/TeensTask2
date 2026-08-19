# Authentication & Authorization Implementation Guide

## Overview

This project implements a complete authentication and authorization system with JWT tokens, role-based access control (RBAC), and protected routes.

## Architecture

### Backend (Node.js/Express)

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Using bcrypt for secure password storage
- **Role-Based Access Control**: Admin and User roles
- **Protected Endpoints**: `/getemployees` and `/getclients` require authentication

### Frontend (React)

- **Auth Context**: Global state management for authentication
- **Protected Routes**: Routes that require authentication
- **Login/Register**: User authentication pages
- **API Interceptors**: Automatic token handling for API requests

## Database Setup

### Create Users Table

Run this SQL in your PostgreSQL database:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add an admin user
INSERT INTO users (email, password, role) VALUES
('admin@example.com', '$2b$10$...', 'admin');
```

> **Note**: To hash the password, use bcrypt. In production, create admin users through a secure admin panel or scripts.

## Backend Configuration

### Environment Variables (.env)

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=TeensSoftware
DB_PASSWORD=12345
DB_PORT=5432
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### Backend Files Created

1. **`src/middleware/authMiddleware.js`**
   - `authMiddleware`: Verifies JWT tokens
   - `roleMiddleware`: Checks user roles

2. **`src/routes/authRoutes.js`**
   - `/api/auth/login`: User login endpoint
   - `/api/auth/register`: User registration endpoint

3. **`server.js` (Updated)**
   - Integrated auth routes and middleware
   - Protected endpoints with authentication

## Frontend Configuration

### Environment Variables (Vite)

The frontend connects to `http://localhost:3000` by default.

### Frontend Files Created

1. **`src/context/AuthContext.jsx`**
   - Global authentication state
   - Login/Register functions
   - Token management

2. **`src/components/Login.jsx`**
   - Login form with email and password
   - Error handling and loading states

3. **`src/components/Register.jsx`**
   - Registration form with role selection
   - Password validation
   - Email and password confirmation

4. **`src/components/ProtectedRoute.jsx`**
   - Route wrapper for protected pages
   - Redirects to login if not authenticated
   - Role-based access control

5. **`src/utils/apiClient.js`**
   - Axios instance with authentication headers
   - Automatic token injection in requests
   - Token expiration handling

6. **`src/pages/Dashboard.jsx`**
   - Displays employees and clients data
   - Shows user info and logout button
   - Tab-based data display

## API Endpoints

### Authentication Endpoints

#### Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### Register

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "email": "newuser@example.com",
    "role": "user"
  }
}
```

### Protected Endpoints

#### Get Employees

```
GET /getemployees
Authorization: Bearer {token}

Response: [
  {
    "employee_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    ...
  }
]
```

#### Get Clients

```
GET /getclients
Authorization: Bearer {token}

Response: [
  {
    "client_id": 1,
    "client_name": "ABC Company",
    "email": "contact@abc.com",
    ...
  }
]
```

## Usage Guide

### Running the Application

1. **Start the Backend**

   ```bash
   cd backend
   npm install
   npm run server  # or npm start for production
   ```

2. **Start the Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Application**
   - Open browser to `http://localhost:5173`
   - You'll be redirected to login page

### Testing the Authentication

1. **Register a New User**
   - Go to `/register`
   - Enter email and password
   - Click Register

2. **Login**
   - Go to `/login`
   - Use registered email and password
   - Click Login

3. **Access Dashboard**
   - After login, you'll see employees and clients data
   - Your role and email are displayed at the top
   - Click Logout to exit

## Security Features

✅ **Password Security**

- Passwords hashed with bcrypt
- Salted storage prevents rainbow table attacks

✅ **JWT Tokens**

- 24-hour expiration by default
- Secure secret key storage in environment variables

✅ **Role-Based Access Control**

- Admin and User roles
- Middleware enforces role permissions

✅ **Protected Routes**

- Frontend: Automatically redirects to login if not authenticated
- Backend: Validates token on every protected request

✅ **Token Expiration**

- Automatic token validation
- Users redirected to login on token expiry

## Customization

### Add More Roles

1. Update `register.jsx` role options
2. Modify `roleMiddleware` in backend routes
3. Add role-specific checks in components

### Add More Protected Routes

```javascript
// Backend
app.get("/newroute", authMiddleware, roleMiddleware("admin"), handler);

// Frontend
<Route
  path="/newpage"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>;
```

### Change JWT Expiration

```javascript
// In authRoutes.js
const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "7d" });
```

## Troubleshooting

### Issue: "401 No token provided"

- Ensure token is stored in localStorage
- Check browser DevTools > Application > Local Storage

### Issue: "403 Invalid or expired token"

- Clear localStorage and re-login
- Check JWT_SECRET in backend .env

### Issue: Frontend can't connect to backend

- Ensure backend is running on port 3000
- Check CORS settings in server.js
- Verify API_URL in AuthContext.jsx

### Issue: Database connection error

- Verify PostgreSQL is running
- Check credentials in .env file
- Ensure database exists

## Next Steps

1. **Database Integration**
   - Create users table (SQL provided above)
   - Run database setup

2. **Environment Configuration**
   - Update .env with secure JWT_SECRET
   - Set appropriate database credentials

3. **Testing**
   - Test registration and login
   - Verify protected endpoints work
   - Test role-based access

4. **Production Deployment**
   - Use strong JWT_SECRET
   - Set NODE_ENV=production
   - Use HTTPS for all communications
   - Implement rate limiting
   - Add CSRF protection
   - Use secure cookie settings

## File Structure

```
backend/
├── src/
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── routes/
│       └── authRoutes.js
├── .env
└── server.js

frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Unauthorized.jsx
│   ├── styles/
│   │   ├── Login.css
│   │   ├── Register.css
│   │   ├── Dashboard.css
│   │   └── Unauthorized.css
│   ├── utils/
│   │   └── apiClient.js
│   └── App.jsx
```

## Support

For issues or questions, refer to:

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT.io](https://jwt.io/)
- [Bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
