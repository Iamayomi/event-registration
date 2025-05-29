# 🎫 Event Registration System

A full-stack backend system for managing event registrations, built with **Express.js**, **TypeScript**, **Prisma**, and **PostgreSQL**. Features include:

- User authentication and role-based access
- Event creation and registration
- Email confirmation on successful registration
- Full pagination, sorting, and filtering
- Clean architecture and service layers

---

## 🚀 Features

- 🔐 Authentication (JWT)
- 👤 Roles (admin, user)
- 📅 Event creation, updates, deletion
- 📝 User event registration
- 📬 Email confirmation on registration
- 📄 Pagination, sorting, filtering
- 📦 Prisma ORM + PostgreSQL

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Email**: Nodemailer
- **Validation**: Zod / Joi / Custom middleware

---

## 📦 Project Structure

```
src/
├── api/              # Route handlers
├── library/          # Config, Mailer, utils, helper functions
├── middlewares/      # Validation, error, role checks
├── prisma/           # Prisma schema models
├── services/         # Business logic, controller, routes, schema-validation
├── app.ts            # App entry point
└── server.ts         # Server point


```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/iamayomi/event-registration.git
cd event-registration
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/eventdb
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=3d
GOOGLE_AUTH_USER=your@email.com
GOOGLE_AUTH_PASSWORD=yourpassword
```

### 4. Run Prisma setup

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the server

```bash
npm run dev
```

---

## 📨 Email Functionality

Emails are sent using **Nodemailer** with custom HTML templates. When a user registers for an event, they receive a styled confirmation email with event details.

---

## 📮 API Endpoints

| Method | Endpoint                           | Description                | Auth     |
| ------ | ---------------------------------- | -------------------------- | -------- |
| POST   | `/auth/register`                   | Register new user          | ❌       |
| POST   | `/auth/login`                      | Login                      | ❌       |
| POST   | `/auth/verify-email`               | Verify email               | ❌       |
| POST   | `/auth/forgot-password`            | Forgot password            | ❌       |
| POST   | `/auth/verify-password-reset-code` | Verify password reset code | ❌       |
| POST   | `/auth/email/resend-code`          | Email resend-code          | ❌       |
| PUT    | `/auth/reset-password`             | Reset password             | ❌       |
| GET    | `/users/search`                    | Search for users (admin)   | ✅ admin |
| GET    | `/user/profile`                    | User profile               | ✅ user  |
| GET    | `/user/:userId`                    | Get user                   | ❌       |
| DELETE | `/user/:userId`                    | Delete user                | ✅ admin |
| GET    | `/event/search`                    | Get all events             | ❌       |
| GET    | `/event/:eventId`                  | Get an event b             | ❌       |
| POST   | `/event`                           | Create new event           | ✅ admin |
| DELETE | `/event/:eventId`                  | Delete an event            | ✅ admin |
| UPDATE | `/event/:eventId`                  | UPDATE an event            | ✅ admin |
| POST   | `/regster/:eventId`                | Register for an event      | ✅ user  |
| GET    | `/regster/:userId`                 | Get an registered event    | ✅ user  |
| GET    | `/regsters/:userId`                | Get al registered events   | ✅ user  |
| DELETE | `/unregister/:registerId`          | Delete registered events   | ✅ user  |

> Include pagination: `seach?page=1&limit=10&sort=createdAt&title=conference`

---

## 🧑‍💻 Author

**Ayomide**  
Backend Developer  
[Email](mailto:ayomidesherif2019@gmail.com) | [GitHub](https://github.com/iamyom1)

---

## 📄 License

MIT License
