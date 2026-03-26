# GreenGoblin E-Commerce Platform

## Project Overview
GreenGoblin is a full-stack e-commerce web application built for browsing and purchasing comics and figurines. Developed with the latest Next.js 16 and React 19, it features a robust backend powered by Prisma ORM and MongoDB, complete with custom authentication, role-based access control, and secure image uploads.

## Key Features

* **Product Catalog:** Browse products categorized into Comics and Figurines, featuring detailed views, pricing, and featured status.
* **Order Management:** Complete checkout flow with order tracking capabilities (Pending, Processing, Shipped, Delivered) and detailed order item tracking.
* **Authentication & Authorization:** Secure user registration and login using bcryptjs and jsonwebtoken, including role-based permissions (Admin vs User).
* **Media Management:** Integrated file and image uploads using UploadThing.

## Technology Stack

* **Frontend:** Next.js 16.0.1, React 19.2.0, Tailwind CSS v4, TypeScript.
* **Backend:** Next.js API Routes, Prisma ORM.
* **Database:** MongoDB.
* **Security & Auth:** bcryptjs, jsonwebtoken.
* **Cloud Storage:** UploadThing.

## Database Schema

The MongoDB database is managed via Prisma and includes the following core models:
* `User` / `Account` / `Session`: Handles user identities, credentials, and active sessions.
* `Product`: Stores catalog items, image keys, prices, and categories.
* `Order` / `OrderItem`: Manages user purchases, shipping information, and historical pricing snapshots.

## Setup & Execution

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd greengoblin
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Variables:**
Create a `.env` file in the root directory and add the necessary tokens:
```env
DATABASE_URL="your_mongodb_connection_string"
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"
JWT_SECRET="your_jwt_secret"
```

4. **Database Setup:**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the Development Server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
