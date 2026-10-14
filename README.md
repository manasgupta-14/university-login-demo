# University Backend

## Install and run locally
1. Install Node.js and MongoDB Community Server.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `MONGO_URI`.
4. Run `npm run dev`.

## Render deployment
- Build command: `npm install`
- Start command: `npm start`
- In Render > Environment, set `MONGO_URI` to your MongoDB Atlas connection string.
- Set `CLIENT_URL` to your frontend URL. Multiple allowed origins can be comma-separated.
- Do not commit `.env` or share your database password.

## Routes
- `GET /` health check
- `POST /api/register` body: `{ "name": "...", "email": "...", "password": "..." }`
- `POST /api/login` body: `{ "email": "...", "password": "..." }`
