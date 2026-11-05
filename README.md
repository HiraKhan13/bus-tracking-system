# Real-Time Bus Tracking & Management System

A REST API for managing a bus service and tracking buses in real time. It handles users, buses, routes, schedules, live location updates and bus status, with secure login and role-based access.

This is a term project from my BS Software Engineering degree at the University of Central Punjab (UCP). The project document is in [`docs/`](docs/).

## Features

- **26 REST endpoints** covering authentication, users, buses, routes, schedules, live location and status.
- **Secure login** with JWT and Passport (local strategy). Passwords are hashed with bcrypt.
- **Role-based access control** for three roles: `admin`, `driver` and `user`.
- **MongoDB data model** with 6 Mongoose schemas: User, Bus, Route, Location, Schedule and Status.
- All endpoints were tested with Postman.

## Roles

| Role | Can do |
|---|---|
| `admin` | Manage users, buses, routes and schedules |
| `driver` | Post live location and update bus status |
| `user` | View buses, routes, schedules, live location and status |

## Tech stack

Node.js, Express, MongoDB, Mongoose, Passport, JSON Web Tokens, bcrypt

## Run it locally

You need [Node.js](https://nodejs.org) and a running [MongoDB](https://www.mongodb.com/try/download/community) server.

```bash
git clone https://github.com/HiraKhan13/bus-tracking-system.git
cd bus-tracking-system
npm install
cp .env.example .env
```

Open `.env` and set `JWT_SECRET` to a long random string. Then start the server:

```bash
npm start
```

The API runs at `http://localhost:5000`.

## API overview

Send the token as `Authorization: Bearer <token>` on every request except register and login.

| Group | Endpoints | Access |
|---|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/profile` | Public (register, login), any logged-in user (logout, profile) |
| Users | `GET /api/users`, `GET /api/users/:id`, `PUT /api/users/:id`, `DELETE /api/users/:id` | admin |
| Buses | `POST /api/buses`, `PUT /api/buses/:id`, `DELETE /api/buses/:id` | admin |
| Buses | `GET /api/buses`, `GET /api/buses/:id` | any logged-in user |
| Routes | `POST /api/routes`, `PUT /api/routes/:id` | admin |
| Routes | `GET /api/routes`, `GET /api/routes/:id` | any logged-in user |
| Schedule | `POST /api/schedule`, `PUT /api/schedule/:busId` | admin |
| Schedule | `GET /api/schedule/:busId` | any logged-in user |
| Location | `POST /api/location/update` | driver |
| Location | `GET /api/location/:busId`, `GET /api/location/history/:busId` | any logged-in user |
| Status | `POST /api/status/update`, `PUT /api/status/:busId` | driver |
| Status | `GET /api/status/:busId` | any logged-in user |

### Quick example

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","email":"ali@example.com","password":"secret123"}'

# 2. Log in and copy the token from the response
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ali@example.com","password":"secret123"}'

# 3. Use the token
curl http://localhost:5000/api/buses -H "Authorization: Bearer <token>"
```

## Possible improvements

- Stop the register endpoint from accepting a `role` in the request body.
- Invalidate tokens on logout.
- Add request validation and automated tests.

## Author

Hira Khan, [LinkedIn](https://www.linkedin.com/in/hirakhan01)
