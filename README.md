# Pilot Booking & Coupon Payment Management System (Frontend)

A modern web application built with **Next.js**, **React**, and **Ant Design** for managing pilot service bookings, coupon-based payments, vehicle approvals, routes, and pilot assignments.

The system provides two user roles:

- **Admin**
- **Owner**

Owners can register, manage their vehicles, create bookings, and pay using coupons. Administrators manage the overall workflow, including routes, pilots, coupons, booking approvals, and pilot assignments.

---

## Technologies Used

- Next.js 15.5.2
- React 19.1.0
- Ant Design 6.1.1
- Axios
- JWT Authentication
- React Leaflet
- Leaflet Maps

---

## Dependencies

```json
{
  "antd": "^6.1.1",
  "axios": "^1.11.0",
  "jwt-decode": "^4.0.0",
  "leaflet": "^1.9.4",
  "next": "15.5.2",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "react-leaflet": "^5.0.0"
}
```

---

# Features

## Authentication

- User Registration
- Login
- JWT Authentication
- Role Based Authorization
- Protected Routes

---

## Owner Features

- Register Account
- Login
- Dashboard
- Vehicle Management
- View Routes
- View Coupons
- Create Booking
- Booking History
- Profile Management

---

## Admin Features

- Dashboard
- Vehicle Approval / Rejection
- Route Management
- Pilot Management
- Coupon Management
- Booking Approval
- Pilot Assignment

---

## Booking Workflow

```text
Owner Registration
        │
        ▼
Owner Login
        │
        ▼
Add Vehicle
        │
        ▼
Admin Approves Vehicle
        │
        ▼
Select Route
        │
        ▼
Apply Coupon
        │
        ▼
Booking Created
        │
        ▼
Admin Approves Booking
        │
        ▼
Assign Pilot
        │
        ▼
Booking Completed
```

---

# Clone the Repository

```bash
git clone <repository-url>
```

Example

```bash
git clone https://github.com/Onuvob/sample-project-frontend.git
```

Go to the project directory

```bash
cd sample-project-frontend
```

---

# Install Dependencies

```bash
npm install
```

---

# Run Development Server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# Build for Production

```bash
npm run build
```

---

# Start Production Server

```bash
npm run start
```

---

# Admin Credentials

| Email | Password |
|--------|----------|
| admin@sample.com | password123 |

---


# Owner Credentials

| Email | Password |
|--------|----------|
| owner1@sample.com | password123 |
| owner1@sample.com | password123 |

---

# Backend Requirements

This frontend requires the Spring Boot backend to be running.

Example Backend URL

```
http://localhost:8080
```

Update your API base URL if necessary.

---

# Developer

**Sonjoy Tripura**

Email:

```
engr.sonjoy.tripura@gmail.com
```

---

# License

This project is developed for assessment and educational purposes.