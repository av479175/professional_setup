# Chai Aur Backend

Node.js and Express backend for a YouTube-style application.

## Setup

```bash
npm install
npm run dev
```

The development server starts from `src/index.js` and uses Nodemon to restart after file changes.

Create a local `.env` file:

```env
PORT=8000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017
ACCESS_TOKEN_SECERT=your-access-token-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECERT=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=10d
```

The database name is `youtube`, so the application connects to `MONGODB_URI/youtube`.

Keep `.env` private. It is excluded through `.gitignore`.

## Packages

### Runtime

| Package | Use |
| --- | --- |
| `express` | HTTP server, routes, and middleware |
| `mongoose` | MongoDB connection, schemas, and models |
| `dotenv` | Loads environment variables from `.env` |
| `cors` | Allows frontend-to-backend requests |
| `cookie-parser` | Reads cookies from requests |
| `bcrypt` | Hashes and compares passwords |
| `jsonwebtoken` | Creates JWT access and refresh tokens |
| `mongoose-paginate-v2` | Mongoose pagination support |

### Development

| Package | Use |
| --- | --- |
| `nodemon` | Restarts the server during development |
| `prettier` | Formats project files |

All packages are already listed in `package.json`; `npm install` installs them.

## Application Flow

```text
npm run dev
    |
    v
src/index.js
    |
    |-- Loads .env using dotenv
    |-- Imports the Express app
    |-- Connects to MongoDB using Mongoose
    |-- Starts Express only after the database connects
    |
    v
Client request
    |
    |-- CORS checks the frontend origin
    |-- Express parses JSON and form data
    |-- Cookie parser reads request cookies
    |-- Routes call controllers
    |-- Controllers use Mongoose models
    |
    v
API response sent as JSON
```

## Main Files

- `src/index.js`: Loads configuration, connects to MongoDB, and starts the server.
- `src/app.js`: Configures Express middleware.
- `src/db/index.js`: Creates the MongoDB connection.
- `src/models/user.model.js`: User schema, password hashing, and JWT methods.
- `src/models/video.model.js`: Video schema and user relationship.
- `src/utils/asyncHandler.js`: Forwards asynchronous errors to Express.
- `src/utils/apiError.js`: Standard custom API errors.
- `src/utils/respone.js`: Standard API response format.

## Current Status

Application setup, database connection, models, and utilities are ready. Routes, controllers, and authentication endpoints still need to be added.
