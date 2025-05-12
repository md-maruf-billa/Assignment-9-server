
# ReviewHub API Server

## 🚀 Project Overview

This is a backend server application built with Node.js, Express, and Prisma ORM. The application provides authentication and authorization services with role-based access control (ADMIN, COMPANY, USER). It includes features like user registration, login, profile management, and password management.

## ✨ Key Features

- **Authentication & Authorization**
    - User registration with role-based accounts (Admin, Company, User)
    - Secure login with JWT authentication
    - Role-based access control
    - Token refresh mechanism
    - Password change functionality

- **Security**
    - Password hashing with bcrypt
    - JWT token-based authentication
    - HTTP-only cookies for refresh tokens

- **Error Handling**
    - Global error handling middleware
    - Custom error classes
    - Validation using Zod

- **Database**
    - Prisma ORM for database operations
    - Transaction support for data integrity

## 🛠️ Getting Started

### 1. Clone the Repository


A powerful review management platform with comprehensive API for creating, managing, and interacting with reviews.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://your-live-url-here)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-4.12.0-blueviolet)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14.0-blue)](https://www.postgresql.org/)

## 📋 Table of Contents

- [🌟 ReviewHub](#-reviewhub)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠 Tech Stack](#-tech-stack)
  - [📚 API Documentation](#-api-documentation)
    - [🔐 Authentication](#-authentication)
      - [Create User](#create-user)

## ✨ Features

- **User Authentication** - Secure signup and login functionality
- **Review Management** - Create, read, update, and delete reviews
- **Categorization** - Organize reviews by categories
- **Comments** - Allow users to comment on reviews
- **Voting System** - Upvote or downvote reviews
- **Premium Content** - Monetize premium reviews with payment integration
- **Admin Controls** - Moderation tools for review approval

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL.
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Render

## 📚 API Documentation

Base URL: `https://assignment-9-server-7r96.onrender.com/api`

### 🔐 Authentication

#### Create User

### Improving Your GitHub README

I'll create an enhanced version of your README with better organization, formatting, and visual appeal.

```markdown project="ReviewHub" file="README.md"
...
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User

```plaintext
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### 📂 Categories

#### Create Category (Admin only)

```plaintext
POST /category/create-category
```

**Request Body:**

```json
{
  "name": "Gadgets"
}
```

**Headers:**

- `Authorization: Bearer {admin_token}`

#### Get All Categories

```plaintext
GET /category
```

#### Get Single Category

```plaintext
GET /category/{categoryId}
```

### 📝 Reviews

#### Create Review

```plaintext
POST /review/create-review
```

**Request Body:**

```json
{
  "title": "Amazing Noise Cancelling Headphones",
  "description": "These headphones provide crystal clear sound and outstanding noise cancellation. Battery life is also impressive with over 30 hours of playback.",
  "rating": 5,
  "purchaseSource": "BestBuy",
  "imageUrls": [
    "https://example.com/images/headphone-front.jpg",
    "https://example.com/images/headphone-side.jpg"
  ],
  "excerp": "Top-notch noise cancelling headphones with long battery life.",
  "isPremium": true,
  "price": 7.99,
  "isPublished": false,
  "categoryId": "8b00f961-4a54-4419-bd37-bf149d163e34"
}
```

**Headers:**

- `Authorization: Bearer {user_token}`

#### Get All Reviews

```plaintext
GET /review
```

**Query Parameters:**

- `searchTerm` - Search by text
- `page` - Page number for pagination
- `limit` - Items per page
- `categoryId` - Filter by category
- `isPaid` - Filter by payment status (true/false/"")
- `isPublished` - Filter by publication status (true/false/"")

#### Get Single Review

```plaintext
GET /review/{reviewId}
```

**Headers:**

- `Authorization: Bearer {user_token}`

#### Get My Reviews

```plaintext
GET /review/my-reviews
```

**Headers:**

- `Authorization: Bearer {user_token}`

#### Get Pending Reviews (Admin only)

```plaintext
GET /review/pending-reviews
```

**Headers:**

- `Authorization: Bearer {admin_token}`

#### Publish Review (Admin only)

```plaintext
PATCH /review/make-review-published/{reviewId}
```

**Headers:**

- `Authorization: Bearer {admin_token}`

#### Update Review

```plaintext
PATCH /review/update-review/{reviewId}
```

**Headers:**

- `Authorization: Bearer {user_token}` (must be review owner)

#### Delete Review

```plaintext
DELETE /review/delete-review/{reviewId}
```

**Headers:**

- `Authorization: Bearer {user_token}` (must be review owner or admin)

### 💬 Comments

#### Create Comment

```plaintext
POST /comment/create-comment
```

**Request Body:**

```json
{
  "content": "This review was very helpful, thank you!",
  "reviewId": "de71f985-3a61-4a28-8d05-ad258d656bff"
}
```

**Headers:**

- `Authorization: Bearer {user_token}`

#### Get My Comments

```plaintext
GET /comment/my-comments
```

**Headers:**

- `Authorization: Bearer {user_token}`

### 👍 Votes

#### Create Vote

```plaintext
POST /vote/create-vote
```

**Request Body:**

```json
{
  "type": "UP",
  "reviewId": "de71f985-3a61-4a28-8d05-ad258d656bff"
}
```

**Note:** A user can vote on a review only once. Valid vote types are "UP" or "DOWN".

**Headers:**

- `Authorization: Bearer {user_token}`

#### Get My Votes

```plaintext
GET /vote/my-votes
```

**Headers:**

- `Authorization: Bearer {user_token}`

### 💰 Payments

#### Make Order

```plaintext
POST /payment/make-order/{reviewId}
```

**Note:** A user can purchase a premium review only once.

**Headers:**

- `Authorization: Bearer {user_token}`

#### Get My Payments

```plaintext
GET /payment/my-payments
```

**Headers:**

- `Authorization: Bearer {user_token}`

## 🚀 Installation

1. **Clone the repository**

```shellscript
git clone https://github.com/HumayunKabirSobuj/ReviewHub-Server.git
cd ReviewHub-Server
```

2. **Install dependencies**

```shellscript
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory (see Environment Variables section)
4. **Run the development server**

```shellscript
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```plaintext
# Database
DATABASE_URL=your_supabase_api_link
DIRECT_URL=your_supabase_direct_url

# API
VITE_API_LINk=your_api_link
PORT=5000
ENABLE_PRISMA_CACHING=false

# Authentication
JWT_SECRET=your_jwt_secret
EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# URLs
BACKEND_API_LINK=your_backend_live_api_link
CLIENT_LINK=your_frontend_live_link
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

```

```
