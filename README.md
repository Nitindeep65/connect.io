# 💬 Connectio - Modern Chat Application

A full-stack real-time chat application built with Next.js, featuring user authentication, friend management, and modern UI design.

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.19.0-purple)

## 🌟 Features

### ✅ **Currently Available**
- 🔐 **User Authentication** - Secure registration and login system
- 👤 **Profile Management** - Customizable user profiles with avatar uploads
- 👥 **Friend System** - Send, receive, and manage friend requests
- 🔍 **User Search** - Find and connect with other users
- 🎨 **Modern UI** - Dark theme with smooth animations and responsive design
- 📱 **Mobile Friendly** - Fully responsive across all devices

### 🚧 **Coming Soon**
- 💬 Real-time messaging
- 🏠 Chat rooms and group conversations
- 🔔 Push notifications
- 📞 Voice/video calling

## 🏗️ **Tech Stack**

**Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion
**Backend**: Next.js API Routes, PostgreSQL, Prisma ORM
**Authentication**: JWT with secure password hashing
**Deployment**: Vercel-ready

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation
```bash
# Clone the repository
git clone https://github.com/Nitindeep65/connect.io.git
cd connectio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and JWT secret

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📱 **How to Use**

1. **Sign Up** - Create your account with email and username
2. **Set Up Profile** - Add your name and profile picture
3. **Find Friends** - Search for users and send friend requests
4. **Manage Connections** - Accept or decline friend requests
5. **Start Chatting** - Connect with your friends (messaging coming soon!)

## 🎨 **Design**

Connectio features a modern, professional design with:
- **Dark theme** with gradient accents
- **Glass morphism** effects
- **Smooth animations** and transitions
- **Accessible** components and navigation
- **Mobile-first** responsive design

## 👤 **Author**

**Nitindeep Singh**
- GitHub: [@Nitindeep65](https://github.com/Nitindeep65)
- Project: [connect.io](https://github.com/Nitindeep65/connect.io)

## 📄 **License**

MIT License - feel free to use this project for learning and development.

---

⭐ **Star this repository if you find it helpful!**
