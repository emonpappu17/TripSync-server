# TripSync - Travel Buddy & Meetup Platform

A modern web platform connecting travelers worldwide, enabling them to find compatible companions for upcoming trips and create meaningful travel experiences together.

## 🌐 Live Links

- **Client:** [https://trip-sync-client.vercel.app](https://trip-sync-client.vercel.app/)
- **Server:** [https://tripsync-server-1.onrender.com](https://tripsync-server-1.onrender.com/)

## 📂 Repository Links

- **Client Repository:** [https://github.com/emonpappu17/TripSync-client](https://github.com/emonpappu17/TripSync-client)
- **Server Repository:** [https://github.com/emonpappu17/TripSync-server](https://github.com/emonpappu17/TripSync-server)
- Live Client: [https://trip-sync-client.vercel.app](https://trip-sync-client.vercel.app/)
- Live Backend: [https://tripsync-server-1.onrender.com](https://tripsync-server-1.onrender.com/)


## 🔐 Credentials

Admin: [admin@tripSync.com](mailto:admin@tripSync.com) / Admin123!

User: [user1@tripSync.com](mailto:user1@tripSync.com) / user123456

User: [user2@tripSync.com](mailto:user2@tripSync.com) / user123456

## ✨ Key Features

### User Features

- **Travel Plan Management** - Create, edit, and manage detailed travel itineraries
- **Smart Matching System** - Find compatible travel companions based on destination, dates, and interests
- **User Profiles** - Showcase travel history, interests, and upcoming trips
- **Review & Rating** - Share experiences and build trust within the community
- **Premium Subscription** - Access exclusive features with monthly/yearly plans
- **Secure Payments** - Integrated Stripe payment gateway

### Admin Features

- **User Management** - Monitor and manage platform users
- **Travel Plan Oversight** - Review and moderate travel plans
- **Platform Analytics** - Track user activity and engagement

## 🛠️ Technology Stack

### Frontend

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **State Management:** React Context/Redux
- **UI Components:** Custom components with Tailwind
- **Image Upload:** Cloudinary

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon (PostgreSQL)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Stripe account
- Cloudinary account

### Installation

### Client Setup

bash

`*# Clone the repository*
git clone https://github.com/emonpappu17/TripSync-client.git

*# Navigate to project directory*
cd TripSync-client

*# Install dependencies*
npm install

*# Create .env.local file*
NEXT_PUBLIC_BASE_API_URL=your_api_url
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret

*# Run development server*
npm run dev`

### Server Setup

bash

`*# Clone the repository*
git clone https://github.com/emonpappu17/TripSync-server.git

*# Navigate to project directory*
cd TripSync-server

*# Install dependencies*
npm install

*# Create .env file*
NODE_ENV=development
PORT=5000
DATABASE_URL=your_postgresql_url
CORS_ORIGIN=your_frontend_url
FRONTEND_URL=your_frontend_url

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_SALT_ROUND=12
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_PRICE_MONTHLY=your_monthly_price_id
STRIPE_PRICE_YEARLY=your_yearly_price_id

*# Run Prisma migrations*
npx prisma migrate dev

*# Seed database (optional)*
npm run seed

*# Start development server*
npm run dev`

## 📱 Core Functionality

### For Users

1. **Registration & Login** - Secure authentication with JWT
2. **Profile Creation** - Add personal info, travel interests, and visited countries
3. **Travel Planning** - Create detailed trip itineraries with dates and budget
4. **Discover Travelers** - Search and filter compatible travel companions
5. **Reviews & Ratings** - Rate and review fellow travelers after trips
6. **Premium Access** - Subscribe for enhanced features and verified badge

### For Admins

1. **Dashboard Access** - Comprehensive platform overview
2. **User Management** - View, edit, or suspend user accounts
3. **Content Moderation** - Review and manage travel plans
4. **Analytics** - Monitor platform activity and growth

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control (RBAC)
- Secure payment processing

## 📄 API Documentation

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Users

- `GET /api/users/:id` - Get user profile
- `PATCH /api/users/:id` - Update profile

### Travel Plans

- `POST /api/travel-plans` - Create travel plan
- `GET /api/travel-plans` - Get all plans
- `GET /api/travel-plans/match` - Search companions

### Reviews

- `POST /api/reviews` - Add review
- `PATCH /api/reviews/:id` - Edit review
- `DELETE /api/reviews/:id` - Delete review

### Payments

- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/webhook` - Handle Stripe webhooks