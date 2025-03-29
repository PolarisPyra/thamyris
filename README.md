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

- [pnpm](https://pnpm.io/) (Latest version)
- [Node.js](https://nodejs.org/) (v19 or higher)
- MySQL Server
- TypeScript knowledge

## 🔢 Node.js Version Management

This project includes a `.npmrc` file that specifies Node.js version 22.14.0. To manage Node.js versions with pnpm, you can use the following commands:

### Installing Node.js Versions

````bash
# Install LTS version
pnpm env use --global lts

# Install specific version
pnpm env use --global 22.14.0

# Install latest version
pnpm env use --global latest

# Install by name (e.g. hydrogen)
pnpm env use --global lts

# or just use pnpm once in the projects root directory and it will install the version in the npmrc

### 🛠 Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd thamyris
````

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:

```env

   # Required environment variables

JWT_SECRET=
DOMAIN=localhost
RATELIMIT_KEY=

# Development database credentials (required by the application)

DEV_MYSQL_HOST=
DEV_MYSQL_USERNAME=
DEV_MYSQL_PASSWORD=
DEV_MYSQL_DATABASE=

# Production database credentials (required by the application)

PROD_MYSQL_HOST=
PROD_MYSQL_USERNAME=
PROD_MYSQL_PASSWORD=
PROD_MYSQL_DATABASE=

# Additional configuration

NODE_ENV=development
CLIENT_PORT=3000
SERVER_PORT=3001

# Cloudflare turnstile

CFTurnstileKey=1x00000000000000000000AA

# CDN Configuration

CDN_URL=https://thamyris.b-cdn.net/
```

4. **Database Setup**

- Create a MySQL database following the artemis [guide](https://gitea.tendokyu.moe/Hay1tsme/artemis) and configure your `.env` file

## 🚀 Development

### Starting the Development Server

```bash
bun client:dev    # Frontend only
bun server:dev    # Backend only
```

## 🔧 Configuration Files

- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite bundler configuration
- `.env` - Environment variables
- `eslint.config.js` - Linting rules

## 🏗 Building for Production

1. Build the application:

   ```bash
   pnpm build
   ```
