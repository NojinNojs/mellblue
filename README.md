# MELLBLUE — Premium Artisan Treats

![Laravel](https://img.shields.io/badge/Laravel-v12-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia)
![Shadcn UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

**MELLBLUE** is a modern, full-stack e-commerce platform for premium artisan food products. Built with the latest technologies, it features a complete order lifecycle — from browsing and checkout, to payment verification, shipping, and downloadable PDF receipts.

---

## ✨ Features

### 🛒 Customer Experience
- **Product Catalog** — Browse products with image galleries, variants, and pricing
- **Shopping & Checkout** — Streamlined checkout flow with shipping details
- **Payment Upload** — Upload payment proof with image preview
- **Order Tracking** — Real-time order timeline with status progression
- **Downloadable Receipt** — PDF invoice generation with professional branding (DomPDF)
- **Order Completion** — Confirm receipt when package arrives

### 🔧 Admin Panel
- **Dashboard** — Overview with stats, recent orders, and products
- **Order Management** — Verify payments, update shipping status, add tracking numbers
- **Product Management** — CRUD products with image uploads, variants, and categories
- **User Management** — View and manage customer accounts

### 🎨 Design & UX
- **Responsive Design** — Mobile-first, works on all devices
- **Modern UI** — Built with shadcn/ui components and Tailwind CSS v4
- **Animations** — Smooth transitions with Framer Motion
- **Dark/Light Mode** — Theme support via next-themes

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | [Laravel 12](https://laravel.com) (PHP 8.2+) |
| **Frontend** | [React 19](https://react.dev) + [TypeScript](https://typescriptlang.org) |
| **Bridge** | [Inertia.js](https://inertiajs.com) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Database** | MySQL |
| **PDF Generation** | [DomPDF](https://github.com/barryvdh/laravel-dompdf) |
| **Build Tool** | [Vite 7](https://vitejs.dev) |

---

## 📋 Requirements

- PHP 8.2+
- Composer
- Node.js 18+ & npm
- MySQL 8.0+

---

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/NojinNojs/mellblue.git
cd mellblue
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Environment setup

```bash
cp .env.example .env
```

Open `.env` and configure:
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` — your MySQL credentials
- `APP_NAME` — your store name (default: `MELLBLUE`)
- `APP_PHONE` — contact phone number
- `APP_INSTAGRAM`, `APP_TIKTOK` — social media links

### 4. Generate application key

```bash
php artisan key:generate
```

### 5. Run migrations

```bash
php artisan migrate
```

### 6. Create storage symlink

```bash
php artisan storage:link
```

---

## 💻 Development

Start all development servers concurrently (Laravel, Queue, Vite):

```bash
composer run dev
```

Access the application at `http://localhost:8000`.

---

## 📦 Production

```bash
npm run build
php artisan optimize
php artisan migrate --force
```

Point your web server (Nginx or Apache) to the `public/` directory.

---

## 🐘 Laragon (Windows)

1. Clone into Laragon's `www` directory
2. Reload Laragon — it will auto-create a virtual host (e.g., `http://mellblue.test`)
3. Ensure PHP 8.2+ is selected (**Menu > PHP > Version**)
4. Create the database via HeidiSQL, then run migrations

---

## 📁 Project Structure

```
├── app/
│   ├── Http/Controllers/        # Route controllers (Admin + Customer)
│   ├── Models/                  # Eloquent models
│   └── Services/                # Business logic (OrderService, ProductService)
├── database/
│   ├── migrations/              # Database schema
│   └── seeders/                 # Sample data
├── resources/
│   ├── js/
│   │   ├── components/          # Reusable UI components
│   │   ├── layouts/             # App & Admin layouts
│   │   ├── pages/               # Inertia page components
│   │   └── types/               # TypeScript type definitions
│   └── views/
│       └── receipts/            # Blade templates for PDF receipts
├── routes/
│   └── web.php                  # All route definitions
└── public/                      # Public assets
```

---

## 🧑‍💻 Author

**Muhammad Raffi Aqsan** ([@NojinNojs](https://github.com/NojinNojs))

---

_Built with ❤️ using Laravel, React, and modern web technologies._
