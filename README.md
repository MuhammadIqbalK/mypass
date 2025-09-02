```
███╗   ███╗██╗   ██╗██████╗  █████╗ ███████╗███████╗
████╗ ████║╚██╗ ██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝
██╔████╔██║ ╚████╔╝ ██████╔╝███████║███████╗███████╗
██║╚██╔╝██║  ╚██╔╝  ██╔═══╝ ██╔══██║╚════██║╚════██║
██║ ╚═╝ ██║   ██║   ██║     ██║  ██║███████║███████║
╚═╝     ╚═╝   ╚═╝   ╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝
                                                     
```

# 🔐 MyPass - Secure Password Manager

MyPass is a secure and intuitive password manager built with a modern full-stack TypeScript ecosystem. It allows you to securely store, manage, and generate strong passwords, with features like robust authentication, data visualization, and client-side encryption.

---

## 🌟 Features

*   **🔒 Secure Authentication**: User registration, login, and logout with `httpOnly` session cookies.
*   **🔑 Password Management**: Add, view (decrypted), edit, and delete passwords.
*   **🎲 Password Generator**: Generate strong, random passwords.
*   **📊 Data Visualization**: Dashboard charts showing password category distribution and strength analysis.
*   **🛡️ Client-Side Encryption**: Passwords are encrypted using AES-256-GCM with a securely derived key (PBKDF2) before being stored.
*   **_typeDefinition Type-Safe APIs**: End-to-end type safety between frontend and backend using tRPC.
*   **🎨 Modern UI**: Built with Tailwind CSS and shadcn/ui components for a clean and responsive user experience.

---

## ⚙️ Tech Stack

*   **_frontend Frontend**: Next.js 15 (App Router), React, TypeScript
*   **🎨 Styling**: Tailwind CSS, shadcn/ui
*   **backend Backend**: Next.js API Routes, tRPC, Node.js
*   **🗃️ ORM**: DrizzleORM
*   **💾 Database**: SQLite (local development), Turso (production-ready via `libsql`)
*   **📈 Data Visualization**: Recharts
*   **🔒 Encryption**: Node.js `crypto` module (AES-256-GCM, PBKDF2)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/en/) (v18.x or higher recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [pnpm](https://pnpm.io/) (recommended for monorepos)

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/MuhammadIqbalK/mypass.git # Replace with your actual repo URL
cd mypass
```

### 2️⃣ Install Dependencies

This project uses npm workspaces. Install all dependencies from the project root:

```bash
npm install
# or pnpm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the `apps/server` directory and add the following:

```
# apps/server/.env
DATABASE_URL="file:./local.db"
# CORS_ORIGIN="http://localhost:3001" # Uncomment and adjust if your frontend is on a different origin
```
*Note: `CORS_ORIGIN` is typically not needed for local development with the current proxy setup, but it's good practice to include it for clarity or if you change the setup.*

### 4️⃣ Database Setup

This project uses SQLite with Drizzle ORM.

1.  **Start the local SQLite database**:
    ```bash
    npm run db:local
    ```
    This command will start a local Turso development server and create a `local.db` file in `apps/server`.

2.  **Apply the database schema**:
    ```bash
    npm run db:push
    ```
    This will push the Drizzle schema to your `local.db` database.

### 5️⃣ Run the Development Servers

Start both the web and server applications in development mode:

```bash
npm run dev
```

### 6️⃣ Access the Application

Open your browser and navigate to:

[http://localhost:3001](http://localhost:3001)

You should see the MyPass login page.

---

## 📁 Project Structure

```
mypass/
├── apps/
│   ├── web/         # Frontend application (Next.js, React, Tailwind, shadcn/ui)
│   └── server/      # Backend API (Next.js API Routes, tRPC, DrizzleORM, SQLite)
├── packages/        # (Optional: for shared utilities, not currently used extensively)
```

---

## 📜 Available Scripts

*   `npm install`: Install dependencies for all workspaces.
*   `npm run dev`: Start both web and server applications in development mode.
*   `npm run build`: Build all applications for production.
*   `npm run check-types`: Check TypeScript types across all applications.
*   `npm run dev:web`: Start only the web application (on port 3001).
*   `npm run dev:server`: Start only the server application (on port 3000).
*   `npm run db:push`: Apply schema changes to the database.
*   `npm run db:studio`: Open Drizzle Studio UI for database inspection.
*   `npm run db:generate`: Generate Drizzle migrations based on schema changes.
*   `npm run db:migrate`: Run pending Drizzle migrations.
*   `cd apps/server && npm run db:local`: Start the local SQLite database.

## 🎯 Summary

MyPass is built for security-first password management 🔐 with a modern developer experience ⚡.
Easily extendable, type-safe, and production-ready 🚀.


## 🌟 Support & Follow

If you like this project, don’t forget to ⭐ the repo and follow me on GitHub!
👉 [**Follow me here**](https://github.com/MuhammadIqbalK)💙