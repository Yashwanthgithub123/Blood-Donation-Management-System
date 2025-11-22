# Blood Donation Management System (BDMS)

A full-stack Blood Donation Management System that lets donors register, generate QR codes, search for donors, and administrators manage donors and messages. This repository contains a React frontend and a Node.js/Express backend which stores data in MongoDB.

**Contents**
- **frontend/** — React app (bdms-frontend)
- **backend/** — Node.js + Express API (bdms-backend)
- **.gitignore** — ignores `node_modules` and env files

**Preview**
- Frontend (dev): http://localhost:3000
- Backend API (dev): http://localhost:5000

**Tech stack**
- Frontend: React, Axios, Leaflet, qr-code generation, CSS
- Backend: Node.js, Express, Mongoose, JWT, bcrypt
- Database: MongoDB (runs locally or via Docker)

---

**Quick setup (recommended)**

Prerequisites:
- Node.js (16+)
- npm
- Docker (optional but recommended for MongoDB)

1. Clone this repository (already in workspace)

2. Start MongoDB (recommended using Docker):

```bash
docker run -d --name bdms-mongo -p 27017:27017 -v bdms-mongo-data:/data/db mongo:6.0
```

3. Backend: install deps and start the server

```bash
cd backend
npm install
# Create a .env file (see Environment variables below)
npm start
```

4. Frontend: install deps and start the dev server

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000` to use the app. The frontend is configured to call the backend at `http://localhost:5000` by default.

---

**Environment variables**
Create a `.env` file in `backend/` with at least the following (example values):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bdms
JWT_SECRET=your_jwt_secret_here
```

Notes:
- If you run Mongo in Docker on the same machine, the `MONGO_URI` above works.
- The frontend currently uses hard-coded `http://localhost:5000` API URLs. If you prefer an env var, you can update the frontend to use `REACT_APP_API_URL` and set it before `npm start`.

---

**API (selected endpoints)**
Base URL: `http://localhost:5000/api`

- POST `/donors/register` — Register a donor
	- Request body (application/json): `fullName, username, email, password, bloodGroup, phone, city, district, latitude, longitude, lastDonationDate`
	- Example:
		```bash
		curl -X POST http://localhost:5000/api/donors/register \
			-H 'Content-Type: application/json' \
			-d '{"fullName":"Test","username":"test1","email":"t@example.com","password":"pass","bloodGroup":"O+","phone":"999","city":"C","district":"D","latitude":12.97,"longitude":77.59}'
		```

- POST `/donors/login` — Donor login (returns token)
- GET `/donors/:id` — Get donor by id
- POST `/donors/search` — Search donors by blood group / location

- POST `/users/register` and POST `/users/login` — user/admin accounts (see `backend/routes/userRoutes.js`)
- POST `/contacts/add` — Submit contact messages

See `backend/routes/` and `backend/controllers/` for complete API behavior and available endpoints.

---

**Project structure (top-level)**

`/frontend` — React source in `src/` (components, pages, styles)

`/backend` — Express server
- `server.js` — app entry
- `config/db.js` — mongoose connection
- `routes/` — route definitions
- `controllers/` — request handlers
- `models/` — Mongoose models

---

**Running both locally (summary)**
1. Ensure Mongo is running (Docker or local mongod).
2. Start backend: `cd backend && npm install && npm start` (server logs: "Server running on port 5000").
3. Start frontend: `cd frontend && npm install && npm start` (dev server: "Local: http://localhost:3000").
4. Use the UI to register donors or call API endpoints directly with `curl` / Postman.

---

**Troubleshooting**
- If backend can't connect to Mongo, check `MONGO_URI` and that `mongod` is running or the Docker container is up (`docker ps`).
- If ports are already in use, change `PORT` in `.env` or stop the conflicting process.
- If the frontend can't reach the API, check network/port forwarding in your environment and browser devtools console for CORS errors.

**Clean up**
- Stop backend/frontend processes in the terminal (Ctrl+C) or kill the node processes.
- Stop and remove Mongo container:

```bash
docker stop bdms-mongo && docker rm bdms-mongo
```

---

**Contributing**
- Fork and create feature branches, open pull requests into `main`.
- Keep `node_modules` out of commits (this repo uses `.gitignore`).

**License**
- MIT (adjust as needed).

---

If you'd like, I can:
- Add `REACT_APP_API_URL` support to the frontend and a short `.env.example` for both services.
- Run an end-to-end registration test and show the HTTP response body.

Questions or next step? Open a port preview or ask me to run a test registration and I'll execute it.
