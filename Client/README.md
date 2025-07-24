# 🛍️ UrbanSpree Mart – Client (Frontend)

Welcome to the **UrbanSpree Mart** frontend! This is a modern, responsive React application for a full-featured e-commerce experience.

---

## 📁 Project Structure

```
Client/
├── .env
├── .gitignore
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package.json
├── pnpm-lock.yaml
├── README.md
├── vercel.json
├── vite.config.js
├── public/
│   └── vite.svg
└── src/
    ├── App.css
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── assets/
    │   └── react.svg
    ├── components/
    │   ├── footer.jsx
    │   ├── header.jsx
    │   ├── layout.jsx
    │   ├── navbar.jsx
    │   ├── productCard.jsx
    │   ├── productDetailsModal.jsx
    │   ├── protectedRoute.jsx
    │   └── ui/
    ├── contexts/
    │   └── authContext.jsx
    ├── lib/
    │   └── utils.js
    ├── pages/
    │   ├── aboutPage.jsx
    │   ├── addAddressPage.jsx
    │   ├── cartPage.jsx
    │   ├── checkoutPage.jsx
    │   ├── contactPage.jsx
    │   ├── dasboard/
    │   │   ├── addressManagementPage.jsx
    │   │   ├── categoryManagementPage.jsx
    │   │   ├── dasboardOverview.jsx
    │   │   ├── orderManagementPage.jsx
    │   │   ├── productManagementPage.jsx
    │   │   ├── shippingManagementPage.jsx
    │   │   └── userManagementPage.jsx
    │   ├── loginPage.jsx
    │   ├── manageAddressesPage.jsx
    │   ├── orderDetailsPage.jsx
    │   ├── orderHistoryPage.jsx
    │   ├── productsPage.jsx
    │   ├── profile/
    │   │   ├── changePasswordPage.jsx
    │   │   ├── updateProfilePage.jsx
    │   ├── register.jsx
    │   ├── trackShipping.jsx
    │   └── ...
    ├── services/
    │   ├── addressApi.js
    │   ├── api.js
    │   ├── authApi.js
    │   ├── cartApi.js
    │   ├── categoryApi.js
    │   ├── orderApi.js
    │   ├── paymentApi.js
    │   └── productApi.js
    └── utils/
```

---

## ⚙️ Technologies & Frameworks Used

- **React** ⚛️ (with Vite)
- **Tailwind CSS** 🎨
- **Shadcn UI** 🧩
- **Heroicons** 🦸
- **React Router** 🛣️
- **Sonner** (toast notifications) 🔔

---

## ✨ Features

- 🛒 Product catalog, cart, and checkout
- 🔐 User authentication (register, login, JWT)
- 🧑‍💼 Role-based dashboards (admin, manager, customer)
- 📦 Order management and tracking
- 🏷️ Category and product management (admin/manager)
- 🏠 Address management
- 💳 Payment integration (M-Pesa)
- 🌙 Dark mode support
- 📱 Responsive design

---

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/isaack205/E-Commerce_PLP_Final_project.git
cd E-Commerce_PLP_Final_project/Client
```

### 2. Install Dependencies

```sh
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `Client/` directory with the following content:

```properties
VITE_API_URL=your_backend_api_url
```

Example:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the Development Server

```sh
pnpm dev
# or
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## 🏗️ Key Components

- **App.jsx** – Main application and routing logic
- **components/** – Reusable UI and layout components
- **pages/** – All route-based pages (products, cart, dashboard, etc.)
- **services/** – API service modules for backend communication
- **contexts/** – React context providers (e.g., authentication)
- **lib/utils.js** – Utility functions

---

## 🛡️ Best Practices

- All sensitive data is managed via `.env`.
- API endpoints are centralized in `services/api.js`.
- Uses React Context for authentication state.
- Responsive and accessible UI with Tailwind and Shadcn UI.

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
- [Heroicons](https://heroicons.com/)

---

> For questions or support, open an issue or contact