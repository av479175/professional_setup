# Chai Aur Backend

A Node.js and Express backend project for a YouTube-style application. The project currently contains the application setup, MongoDB connection, user and video models, and reusable API utilities. Controllers, routes, and custom middleware are prepared as folders but are not implemented yet.

## Technologies

- Node.js
- Express
- MongoDB with Mongoose
- ES modules
- JWT authentication support
- bcrypt password hashing

## Requirements

- Node.js and npm
- A running MongoDB instance or a MongoDB Atlas connection string

## Installation

Clone or open the project, then install the dependencies:

```bash
npm install
```

Start the development server with Nodemon:

```bash
npm run dev
```

The development script runs `src/index.js` and restarts the server when source files change.

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=8000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017

ACCESS_TOKEN_SECERT=replace-with-an-access-token-secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECERT=replace-with-a-refresh-token-secret
REFRESH_TOKEN_EXPIRY=10d
```

`DB_NAME` is currently defined in `src/constants.js` as `youtube`, so the MongoDB database URL becomes:

```text
MONGODB_URI/youtube
```

Do not commit `.env` or real secrets to Git.

## Dependencies

### Runtime dependencies

These packages are required when the application runs:

| Package | Purpose |
| --- | --- |
| `express` | Creates the HTTP server, routes, and middleware pipeline. |
| `mongoose` | Connects to MongoDB and defines schemas and models. |
| `dotenv` | Loads values from `.env` into `process.env`. |
| `cors` | Allows configured frontend origins to call the API. |
| `cookie-parser` | Reads cookies from incoming requests. |
| `bcrypt` | Hashes passwords and compares passwords during login. |
| `jsonwebtoken` | Creates and verifies JWT access and refresh tokens. |
| `mongoose-paginate-v2` | Provides Mongoose pagination support. |

### Development dependencies

| Package | Purpose |
| --- | --- |
| `nodemon` | Restarts the development server when files change. |
| `prettier` | Formats JavaScript and project files consistently. |

Install an individual package only when needed:

```bash
npm install package-name
npm install --save-dev package-name
```

Normally, `npm install` is enough because all packages are already listed in `package.json`.

## Project Structure

```text
professional_setup/
|-- public/                 Static files served by Express
|-- src/
|   |-- app.js              Express app and global middleware
|   |-- index.js            Application entry point
|   |-- constants.js        Shared constants such as the database name
|   |-- db/
|   |   `-- index.js        MongoDB connection function
|   |-- controllers/        Request and response business logic
|   |-- middlewares/        Authentication and error middleware
|   |-- models/
|   |   |-- user.model.js   User schema and authentication methods
|   |   `-- video.model.js  Video schema and pagination plugin
|   |-- routes/              API route definitions
|   `-- utils/
|       |-- apiError.js     Custom API error class
|       |-- asyncHandler.js Async controller error wrapper
|       `-- respone.js      Standard API response class
|-- .env                    Local environment variables
|-- package.json            Dependencies and npm scripts
`-- package-lock.json       Exact dependency versions
```

## Application Flow

The application starts in the following order:

```text
npm run dev
	|
	v
src/index.js
	|
	|-- dotenv/config loads .env
	|-- imports the Express app
	|-- calls connectDB()
	|       |
	|       `-- Mongoose connects to MONGODB_URI/youtube
	|
	`-- after MongoDB connects, app.listen(PORT) starts the server
```

When a request reaches the server:

```text
Client request
	|
	v
CORS middleware
	|
	v
JSON and URL-encoded body parsers
	|
	v
Static file middleware and cookie parser
	|
	v
Routes
	|
	v
Controllers
	|
	v
Mongoose models and MongoDB
	|
	v
API response
```

## Main Modules

### `src/app.js`

Creates the Express application and registers CORS, JSON parsing, form parsing, static-file serving, and cookie parsing. It exports `app`; it does not start the server itself.

### `src/index.js`

Loads environment variables, connects to MongoDB, and starts Express with `app.listen()` only after the database connection succeeds.

### `src/db/index.js`

Uses Mongoose to connect to `${MONGODB_URI}/${DB_NAME}`. If the connection fails, the process exits with an error.

### `src/models/user.model.js`

Defines user fields such as username, email, password, avatar, watch history, and refresh token. It also contains password hashing, password comparison, and JWT token-generation methods.

### `src/models/video.model.js`

Defines video metadata such as title, description, video file, thumbnail, owner, duration, views, and publish status. Videos reference users through MongoDB ObjectIds.

### `src/utils/asyncHandler.js`

Wraps an asynchronous controller and forwards rejected promises to Express error middleware, avoiding repeated `try...catch` blocks.

### `src/utils/apiError.js`

Provides a custom error object with `statusCode`, `message`, `error`, and `success` properties.

### `src/utils/respone.js`

Provides a consistent response shape containing `success`, `message`, `data`, and `statusCode`.

## Important Dependency Check

`package.json` currently installs `mongoose-paginate-v2`, but `src/models/video.model.js` imports `mongooseAggregatePaginate`. These are different package names. The video model will need to use the package that is actually installed, or the required aggregate-pagination package must be added before that model can run successfully.

## Current Project Status

- Express application setup is present.
- MongoDB connection setup is present.
- User and video models are present.
- Controllers, routes, and middleware folders are currently empty.
- Authentication and API endpoints still need to be connected through routes and controllers.
