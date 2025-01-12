# Secure User Authentication and Authorization System
This project implements a secure user authentication and authorization system using **Express.js**. It supports user registration, login, password reset, and role-based access control (RBAC). JWT tokens are used for authentication, 
and activity logging is implemented for auditing purposes.

## Setup🔧

### Prerequisites

- **Node.js** and **npm** installed
- **MongoDB** instance running

### Steps to Set Up
1. Clone the repository from GitHub 
   ```bash
   git clone https://github.com/pankti13/Auth-System.git

2. Navigate to the project directory and Install dependencies
   ```bash
   cd Auth-System
   npm install

3. Configure environment variables in a `.env` file
   ```bash
   MONGO_URL=<your-mongo-url>
   JWT_SECRET=<your-jwt-secret>
   EMAIL_USER=<your-email>
   EMAIL_PASS=<your-email-password>

4. Run the app
   ```bash
   npm run dev

## Features📝

- **User Registration:** Users can register with email and password.
- **Password Hashing:** Passwords are securely hashed using bcrypt.
- **User Login:** JWT-based authentication.
- **Password Reset:** Users can reset passwords via email.
- **JWT Authentication:** Secure and stateless authentication with JWT.
- **Role-based Access Control:** Role validation for accessing specific resources.
- **Cookies for Logging:** Cookies are used for logging and session management.
- **Security Headers**: Protection against common web vulnerabilities:
  - **XSS**: `Content-Security-Policy` header.
  - **CSRF**: Secure cookies and anti-CSRF tokens.

## Endpoints💡

### Public Routes

   - POST /api/users/register: Register a new user.
   - POST /api/users/login: Log in a user and get a JWT token.
   - POST /api/users/forgot-password: Request password reset email.
   - GET /api/users/reset-password/:token: Verify password reset token.
   - POST /api/users/reset-password/:token: Reset user password.

### Protected Routes (Requires JWT)

   - DELETE /api/users/admin-dashboard: Admin can delete a user.
   - GET /api/users/user-dashboard: Get user profile.
   - PUT /api/users/user-dashboard: Update user profile.

## Dependencies🔗

- `express`: Web framework for Node.js.
- `jsonwebtoken`: For generating and verifying JSON Web Tokens.
- `bcryptjs`: For securely hashing passwords.
- `cookie-parser`: For parsing cookies in HTTP requests.
- `express-validator`: For validating and sanitizing input data.
- `nodemon`: Development tool that automatically restarts the server on code changes.
- `helmet`: For securing HTTP headers to prevent security vulnerabilities.
- `mongoose`: MongoDB object modeling for Node.js.
- `nodemailer`: For sending emails from Node.js.
- `crypto`: For cryptographic functionality, such as generating secure tokens.
- `dotenv`: For managing environment variables.

