# Thamyris

A modern web application built with React, Hono, and TypeScript.

## 🚀 Features

- Full-stack TypeScript application
- React for frontend development
- Hono for backend API
- MySQL database integration
- Authentication with Argon2
- Modern UI with Tailwind CSS and Radix UI
- Rate limiting support
- Development and production environments
- Type-safe environment variables

## 📋 Prerequisites

- [Bun](https://bun.sh/) (Latest version)
- [Node.js](https://nodejs.org/) (v19 or higher)
- MySQL Server
- TypeScript knowledge

## 🛠 Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd thamyris
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

   ```env
   # Required in both environments
   JWT_SECRET=your_jwt_secret
   DOMAIN=localhost
   RATELIMIT_KEY=your_ratelimit_key

   # Production database credentials
   PROD_MYSQL_HOST=your_prod_host
   PROD_MYSQL_USERNAME=your_prod_username
   PROD_MYSQL_PASSWORD=your_prod_password
   PROD_MYSQL_DATABASE=your_prod_database

   # Development database credentials
   DEV_MYSQL_HOST=localhost
   DEV_MYSQL_USERNAME=your_dev_username
   DEV_MYSQL_PASSWORD=your_dev_password
   DEV_MYSQL_DATABASE=your_dev_database

   # Additional configuration
   NODE_ENV=development  # or production
   PORT=3000
   SERVER_PORT=3001

   # CDN Configuration
   CDN_URL=/
   ```

4. **Database Setup**
   - Create a MySQL database following the artemis [guide](https://gitea.tendokyu.moe/Hay1tsme/artemis) and configure your `.env` file

## 🚀 Development

### Starting the Development Server

```bash
# Start the full stack development environment
bun dev

# Or start frontend and backend separately
bun client:dev    # Frontend only
bun server:dev    # Backend only
```

### Available Scripts

- `bun dev` - Start development environment
- `bun build` - Build for production
- `bun start` - Start production server
- `bun typecheck` - Run TypeScript type checking
- `bun lint` - Run ESLint
- `bun lint:fix` - Fix ESLint issues

## 📁 Project Structure

```
thamyris/
├── src/           # Source code
├── public/        # Static assets
├── scripts/       # Build and development scripts
├── dist/          # Production build output
├── components.json # UI components configuration
└── vite.config.ts # Vite configuration
```

## 🔧 Configuration Files

- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite bundler configuration
- `.env` - Environment variables
- `eslint.config.js` - Linting rules

## 🏗 Building for Production

1. Build the application:

   ```bash
   bun build
   ```

2. Start the production server:
   ```bash
   bun start
   ```
