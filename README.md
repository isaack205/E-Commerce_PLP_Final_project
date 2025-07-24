# 🛒 UrbanSpree Mart – E-Commerce Platform

Welcome to **UrbanSpree Mart**, a modern, full-stack e-commerce platform. This project features a robust backend API and a sleek, responsive frontend for seamless online shopping and management.

🌐 **Live Demo:** [https://e-commerce-plp-final-project.vercel.app/](https://e-commerce-plp-final-project.vercel.app/)

---

## 📦 Project Structure

```
E-Commerce_PLP_Final_project/
├── Client/   # Frontend (React, Vite, Tailwind, Shadcn UI)
├── Server/   # Backend (Node.js, Express, MongoDB, Mpesa, Cloudinary)
└── README.md # Project documentation
```

---

## 🚀 Features

- User authentication & role-based access (admin, manager, courier, customer)
- Product catalog, categories, brands, and variants
- Shopping cart & checkout
- Order management & tracking
- Address management
- Admin dashboard for users, products, categories, and orders
- Mpesa payment integration
- Cloudinary image uploads
- Notifications system
- Responsive UI with dark mode

---

## ⚙️ Technologies Used

**Frontend:**
- React (Vite)
- Tailwind CSS
- Shadcn UI
- Heroicons
- React Router
- Sonner (toast notifications)

**Backend:**
- Node.js & Express.js
- MongoDB (Mongoose)
- Multer (file uploads)
- Cloudinary (image storage)
- Morgan (logging)
- Express-validator (validation)
- Mpesa Daraja API (payments)

---

## 🛠️ Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/isaack205/E-Commerce_PLP_Final_project.git
cd E-Commerce_PLP_Final_project
```

### 2. Setup the Backend

```sh
cd Server
pnpm install
# or
npm install
```

Create a `.env` file in `Server/` with:

```properties
JWT_SECRET=your_jwt_secret
PORT=your_port
MONGO_URI=your_mongodb_connection_string

# M-Pesa Daraja API Credentials
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_CALLBACK_URL=your_mpesa_callback_url
MPESA_OAUTH_URL=your_mpesa_oauth_url
MPESA_STK_PUSH_URL=your_mpesa_stk_push_url

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```sh
pnpm start
# or
node server.js
```

### 3. Setup the Frontend

```sh
cd ../Client
pnpm install
# or
npm install
```

Create a `.env` file in `Client/` with:

```properties
VITE_API_URL=your_backend_api_url
# Example: VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```sh
pnpm dev
# or
npm run dev
```

---

## 🛣️ API & Pages Overview

- **Backend API:** `/api` (see Server/routes and Server/controllers for endpoints)
- **Frontend Pages:** Home, Products, Cart, Checkout, Orders, Dashboard, Profile, etc.

---

## 📚 API Documentation

🛠️ **Base URL**  
Local: `http://localhost:5000/api`  
Production: `https://e-commerce-plp-final-project.vercel.app/api`

---

### 📚 Authentication  
Routes: `/api/auth`

| Method | Endpoint     | Description           | Auth Required | Roles           |
|--------|-------------|----------------------|---------------|-----------------|
| POST   | /register   | Register a new user  | No            | -               |
| POST   | /login      | Login and get JWT    | No            | -               |
| GET    | /me         | Get own profile      | Yes           | All             |
| PUT    | /me         | Update own profile   | Yes           | All             |
| DELETE | /me         | Delete own profile   | Yes           | All             |
| GET    | /users      | Get all users        | Yes           | admin, manager  |
| GET    | /:id        | Get user by ID       | Yes           | admin, manager  |
| DELETE | /users/:id  | Delete user by ID    | Yes           | admin, manager  |

---

### 🛒 Products  
Routes: `/api/products`

| Method | Endpoint                | Description                | Auth Required | Roles           |
|--------|------------------------|----------------------------|---------------|-----------------|
| POST   | /                      | Create product             | Yes           | admin, manager  |
| GET    | /                      | Get all products           | No            | -               |
| GET    | /:id                   | Get product by ID          | No            | -               |
| PUT    | /:id                   | Update product by ID       | Yes           | admin, manager  |
| DELETE | /:id                   | Delete product by ID       | Yes           | admin, manager  |
| GET    | /category/:categoryId  | Get products by category   | No            | -               |

---

### 🏷️ Categories  
Routes: `/api/categories`

| Method | Endpoint   | Description           | Auth Required | Roles           |
|--------|-----------|-----------------------|---------------|-----------------|
| POST   | /         | Create category       | Yes           | admin, manager  |
| GET    | /         | Get all categories    | No            | -               |
| GET    | /:id      | Get category by ID    | No            | -               |
| PUT    | /:id      | Update category by ID | Yes           | admin, manager  |
| DELETE | /:id      | Delete category by ID | Yes           | admin, manager  |

---

### 🛒 Cart  
Routes: `/api/carts`

| Method | Endpoint             | Description                  | Auth Required | Roles                |
|--------|---------------------|------------------------------|---------------|----------------------|
| POST   | /                   | Create or update cart        | Yes           | customer             |
| GET    | /user/:userId       | Get cart by user ID          | Yes           | customer, admin      |
| PATCH  | /remove-item        | Remove item from cart        | Yes           | customer             |
| PATCH  | /update-quantity    | Update quantity of item      | Yes           | customer             |
| DELETE | /user/:userId       | Clear cart for user          | Yes           | customer             |

---

### 📦 Orders  
Routes: `/api/orders`

| Method | Endpoint           | Description                | Auth Required | Roles                        |
|--------|-------------------|----------------------------|---------------|------------------------------|
| POST   | /                 | Create order from cart     | Yes           | customer                     |
| GET    | /                 | Get all orders             | Yes           | admin, manager               |
| GET    | /:id              | Get order by ID            | Yes           | admin, manager, courier, customer |
| GET    | /user/:userId     | Get orders by user ID      | Yes           | admin, manager, customer     |
| PUT    | /:id              | Update order (status, etc.)| Yes           | admin, manager               |
| DELETE | /:id              | Delete order               | Yes           | admin                        |

---

### 🏠 Addresses  
Routes: `/api/addresses`

| Method | Endpoint   | Description         | Auth Required | Roles    |
|--------|-----------|---------------------|---------------|----------|
| POST   | /         | Add address         | Yes           | customer |
| GET    | /         | Get all addresses   | Yes           | customer |
| GET    | /:id      | Get address by ID   | Yes           | customer |
| PUT    | /:id      | Update address      | Yes           | customer |
| DELETE | /:id      | Delete address      | Yes           | customer |

---

### 🚚 Shipping  
Routes: `/api/shippings`

| Method | Endpoint   | Description           | Auth Required | Roles                |
|--------|-----------|-----------------------|---------------|----------------------|
| POST   | /         | Create shipping info  | Yes           | admin, manager       |
| GET    | /         | Get all shippings     | Yes           | admin, manager       |
| GET    | /:id      | Get shipping by ID    | Yes           | admin, manager, courier |
| PUT    | /:id      | Update shipping info  | Yes           | admin, manager, courier |
| DELETE | /:id      | Delete shipping info  | Yes           | admin, manager       |

---

### 💳 Payments  
Routes: `/api/payments`

| Method | Endpoint             | Description                | Auth Required | Roles           |
|--------|---------------------|----------------------------|---------------|-----------------|
| POST   | /mpesa/stkpush      | Initiate M-Pesa STK Push   | Yes           | customer        |
| POST   | /mpesa/callback     | M-Pesa callback (webhook)  | No            | -               |
| GET    | /                   | Get all payments           | Yes           | admin, manager  |
| GET    | /:id                | Get payment by ID          | Yes           | admin, manager  |

---

### 🔔 Notifications  
Routes: `/api/notifications`

| Method | Endpoint | Description         | Auth Required | Roles    |
|--------|----------|---------------------|---------------|----------|
| GET    | /        | Get notifications   | Yes           | customer |

---

### 🖼️ File Uploads

Product images are uploaded via Cloudinary using the `/api/products` POST and PUT endpoints.  
Only image files (jpeg, jpg, png, gif) are allowed, max size 5MB.

---

### 🛡️ Security & Best Practices

- All endpoints requiring authentication use JWT in the Authorization header.
- Role-based access control is enforced for sensitive routes.
- Input validation is performed on all create/update endpoints.
- All sensitive data is managed via environment variables.

---

### 📦 Error Handling

All endpoints return JSON responses with appropriate HTTP status codes and error messages.

---

### 🧭 Health Check

`GET /` – Returns a simple message to confirm the API is running.

---

## 📄 License

MIT License

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Mpesa](https://developer.safaricom.co.ke/)
- [Express](https://expressjs.com/)

---

> For questions or support, open an issue or contact