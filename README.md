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

## 🛡️ Best Practices

- All secrets and credentials are managed via `.env` files.
- Input validation and error handling throughout.
- Role-based access control for sensitive operations.
- Logging and monitoring enabled.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit and push your changes
4. Open a pull request

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