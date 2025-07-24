# 🚀 UrbanSpree Mart – Server API

Welcome to the **UrbanSpree Mart** backend! This Node.js/Express server powers the e-commerce platform, handling authentication, product management, orders, and more.

---

## 📁 Project Structure

```
Server/
├── .env                  # Environment variables
├── .gitignore
├── access.log            # HTTP access logs
├── package.json
├── pnpm-lock.yaml
├── server.js             # Main entry point
├── config/               # Configuration files
│   ├── cloudinaryConfig.js
│   ├── db.js
│   └── mpesa.js
├── controllers/          # Route controllers
│   ├── addressController.js
│   ├── authController.js
│   ├── cartController.js
│   ├── categoryController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   └── shippingController.js
├── middlewares/          # Express middlewares
│   ├── auth.js
│   ├── categoryValidation.js
│   ├── customLogger.js
│   ├── productValidation.js
│   ├── upload.js
│   ├── uploadCloud.js
│   └── userValidation.js
├── models/               # Mongoose models
│   ├── address.js
│   ├── cart.js
│   ├── category.js
│   ├── notification.js
│   ├── order.js
│   ├── payment.js
│   ├── product.js
│   ├── shipping.js
│   └── user.js
├── routes/               # API route definitions
├── uploads/              # Uploaded files (if not using cloud storage)
└── utils/                # Utility functions
```

---

## ⚙️ Technologies & Frameworks Used

- **Node.js** 🟩
- **Express.js** 🚏
- **MongoDB** (with Mongoose) 🍃
- **Multer** (file uploads) 📤
- **Cloudinary** (image storage) ☁️
- **Morgan** (logging) 📋
- **Express-validator** (validation) ✅
- **Mpesa Daraja API** (mobile payments) 🇰🇪

---

## ✨ Features

- 🔐 **Authentication & Authorization** (JWT, role-based)
- 🛒 **Product & Category Management**
- 📦 **Order Processing**
- 🧾 **Cart & Address Management**
- 💳 **Payment Integration** (Mpesa, Cloudinary for images)
- 🛡️ **Validation & Error Handling**
- 📊 **Logging** (custom logger, access logs)
- 📤 **File Uploads** (Multer, Cloudinary)
- 📢 **Notifications**

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```sh
git clone https://github.com/isaack205/E-Commerce_PLP_Final_project.git
cd E-Commerce_PLP_Final_project/Server
```

### 2. Install Dependencies

```sh
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `Server/` directory with the following content:

```properties
JWT_SECRET=your_jwt_secret
PORT=your_port
MONGO_URI=your_mongodb_connection_string

# M-Pesa Daraja API Credentials
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_PASSKEY=your_mpesa_passkey
MPESA_SHORTCODE=your_mpesa_shortcode # Or your specific paybill/till number
MPESA_CALLBACK_URL=your_mpesa_callback_url
MPESA_OAUTH_URL=your_mpesa_oauth_url
MPESA_STK_PUSH_URL=your_mpesa_stk_push_url

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 4. Start the Server

```sh
pnpm start
# or
node server.js
```

Server runs at [http://localhost:5000](http://localhost:5000)

---

## 🛣️ API Overview

- **Auth:** `/api/auth` (register, login)
- **Products:** `/api/products`
- **Categories:** `/api/categories`
- **Orders:** `/api/orders`
- **Cart:** `/api/cart`
- **Addresses:** `/api/addresses`
- **Payments:** `/api/payments`
- **Shipping:** `/api/shipping`
- **Notifications:** `/api/notifications`

> See the `routes/` and `controllers/` folders for detailed endpoint logic.

---

## 🏗️ Key Components

- **server.js** – App entry, connects DB, sets up middleware/routes.
- **config/** – DB, Cloudinary, and Mpesa configuration.
- **controllers/** – Business logic for each resource.
- **middlewares/** – Auth, validation, logging, file uploads.
- **models/** – Mongoose schemas for all resources.
- **routes/** – Express routers for each API resource.
- **uploads/** – Local file storage (if not using cloud).
- **utils/** – Helper functions.

---

## 🛡️ Security & Best Practices

- All sensitive data is managed via `.env`.
- Input validation via `express-validator`.
- Role-based access control in `middlewares/auth.js`.
- Logging via `middlewares/customLogger.js` and `access.log`.

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

- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Mpesa](https://developer.safaricom.co.ke/)
- [Multer](https://github.com/expressjs/multer)

---

> For questions or support, open an issue or contact the maintainer.