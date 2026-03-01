# Stride Mobile Shop - MERN E-commerce

Production-ready full-stack e-commerce setup for a local mobile shop.

## Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Image Storage: Cloudinary
- Auth: JWT (Admin)

## Folder Structure

```text
client/
server/
```

Server folders:
- `config/`
- `controllers/`
- `models/`
- `routes/`
- `middleware/`
- `utils/`
- `server.js`

Client folders:
- `src/components/`
- `src/pages/`
- `src/context/`
- `src/services/`
- `src/utils/`
- `src/App.jsx`

## Setup
1. Install dependencies:
```bash
npm install
npm run install:all
```

2. Create env files:
- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`

3. Seed admin user:
```bash
npm run seed:admin --prefix server
```

4. Run app:
```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## API Endpoints
- `POST /api/admin/login`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/products/upload` (admin)

## Features
- Home with hero, featured, latest offers
- Products with category filter + search
- Product details with gallery, specs, discount, EMI badge
- Cart with localStorage and total calculation after discount
- WhatsApp order links with dynamic message
- Call-now action
- Admin dashboard for add/edit/delete products and image upload

## Deployment
- Client: Vercel (set `VITE_API_URL`)
- Server: Render (set all server env variables)
- MongoDB Atlas and Cloudinary credentials via env vars
