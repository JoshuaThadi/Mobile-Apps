https://reactnative.dev/
https://cloudinary.com/
https://www.mongodb.com/

BOOKSTORE APP - SETUP GUIDE

This project is divided into two main folders:
1. mobile/   → For the frontend (e.g., React Native app for mobile)
2. backend/  → For the backend API (Node.js + Express)

─────────────────────────────────────────────
BACKEND SETUP (Located in the "backend" folder)
─────────────────────────────────────────────

1. Initialize the Node.js project:
   npm init -y

2. Install the required production dependencies:
   npm i express mongoose dotenv jsonwebtoken cloudinary bcryptjs cors

   - express: Framework to build server and APIs
   - mongoose: MongoDB ODM to define models and schemas
   - dotenv: Loads environment variables from a .env file
   - jsonwebtoken: Handles token-based authentication
   - cloudinary: Used for image storage and management
   - bcryptjs: For password hashing and comparison
   - cors: To allow cross-origin requests (useful when frontend is on a different port or domain)

3. Install the development dependency:
   npm i nodemon -D

   - nodemon: Automatically restarts the server when file changes are detected (for development)

4. To run the backend server with nodemon:
   npm run dev

   (Assumes you have the following script in your package.json)
   "scripts": {
     "dev": "nodemon src/index.js"
   }

───────────────────────────────────────────── 
BACKEND FOLDER STRUCTURE
─────────────────────────────────────────────

backend/
│
├── node_modules/              → Installed dependencies (auto-generated)
│
├── src/
│   ├── index.js               → Entry point for the backend server
│
│   ├── lib/
│   │   ├── db.js              → MongoDB connection logic
|   |   |-- cron.js            → cron.js schedule tasks to run automatically at specific times or intervals.
│   │   └── cloudinary.js      → Cloudinary configuration and setup
│
│   ├── routes/
│   │   ├── authRoutes.js      → Route definitions for authentication
│   │   └── bookRoutes.js      → Route definitions for book-related operations
│
│   ├── middleware/
│   │   └── auth.middleware.js → Middleware to authenticate JWT tokens
│
│   ├── models/
│   │   ├── Book.js            → Mongoose schema/model for books
│   │   └── User.js            → Mongoose schema/model for users
│
│   └── (future folders: controllers/, services/, etc.)
│
├── .env                       → Environment variables (e.g., DB_URL, JWT_SECRET)
├── package.json               → Project config and dependencies
├── .gitignore                 → Ignore node_modules, .env, etc.



─────────────────────────────────────────────
NOTES:
─────────────────────────────────────────────

- Ensure MongoDB is running locally or use a hosted DB like MongoDB Atlas.

Steps to connect with MongoDB Atlas:
1. Create an account and login at https://www.mongodb.com/cloud/atlas
2. Create a new project.
3. Inside the project, create a new cluster (e.g., free shared cluster).
4. In the left menu, go to "Network Access" and click "Add IP Address".
   - Choose "Allow access from anywhere" (0.0.0.0/0) or your specific IP.
5. In the left menu, go to "Database Access" and create a database user.
   - Set a username and password.
6. Go to "Clusters" → Click "Connect" → Select "Connect your application".
   - Copy the provided connection string (e.g., mongodb+srv://...).
   - Replace <password> in the URI with your database user's password.
   - Optional: Replace <dbname> with your desired database name (e.g., bookstore).

Example:
   MONGODB_URI=mongodb+srv://username:yourpassword@cluster0.mongodb.net/bookstore?retryWrites=true&w=majority

- Your .env file should include variables like:
     PORT=5000
     MONGODB_URI=your_connection_string
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_API_KEY=your_key
     CLOUDINARY_SECRET=your_secret
     CLOUDINARY_NAME=your_cloud_name

- Add additional routes, controllers, and models as the project expands.

---------------------------------------------------------------------

─────────────────────────────────────────────
MOBILE SETUP (Located in the "mobile" folder)
─────────────────────────────────────────────

1. Create the frontend app using Expo:
   npx create-expo-app@latest .

   - Bootstraps a new React Native project using Expo in the current directory.
   - Sets up a ready-to-use environment with TypeScript and example files.

2. If needed, reset the Expo project:
   npm run reset-project

   - Clears the cache and resets build-related configurations.
   - Useful for resolving issues with project inconsistencies.

3. Start the Expo development server:
   npx expo

   - Launches Expo CLI's development environment.
   - Allows live testing on physical/emulated devices.

4. Install image handling support with Expo:
   npx expo install expo-image

   - Installs the `expo-image` package optimized for performance and caching.
   - Recommended over the standard `Image` component for advanced features.

5. Install Zustand for global state management:
   npm i zustand

   - Lightweight, scalable, and intuitive state management for React Native.
   - Useful for managing user auth, theme toggles, or shared app state.

6. Install AsyncStorage for local data persistence:
   npm i @react-native-async-storage/async-storage

   - Enables storing key-value data on the device (e.g., JWT tokens, preferences).
   - Commonly used for storing login sessions or offline data.

7. Install cron for scheduling tasks:
   npm i cron

   - Useful for running scheduled or repeating background jobs (e.g., reminders, sync tasks).
   - Works well in backend or Node environments for timing-based execution.


─────────────────────────────────────────────
MOBILE FOLDER STRUCTURE
─────────────────────────────────────────────

mobile/
│
├── expo/                         → Expo-specific configuration
│   └── types/
│       ├── router.d.ts
│       ├── devices.json
│       └── readme.md
│
├── .vscode/
│   └── settings.json
│
├── app/                          → Application screens and layout
│   ├── _layout.tsx              → Main layout wrapper
│   ├── index.tsx                → Entry screen
│   └── auth/                    → Auth flow screens
│   |   ├── _layout.jsx
│   |   ├── index.jsx
│   |   └── signup.jsx
│   |
|   |-- tabs/
|        |
|        |-- _layout.jsx
|        |-- create.jsx
|        |-- index.jsx
|        |-- profile.jsx
|
├── assets/                      → Static assets
│   ├── fonts/                   → Custom fonts
│   ├── images/                  → App images
│   └── styles/                  → Style definitions
│       ├── create.styles.js
│       ├── home.styles.js
│       ├── login.styles.js
│       ├── profile.styles.js
│       └── signup.styles.js
│
├── components/                  → Reusable UI components
│   └── SafeScreen.jsx
|   |-- Loader.jsx
|   |-- LogoutButton.jsx 
|   |-- ProfileHeader.jsx
│
├── constants/                   → App-wide constants
│   └── colors.js
|   |-- api.js
|
|-- lib
|    |-- utils.js
|
│
├── store/                       → Global state management (Zustand)
│   └── authStore.js             → Auth state store using Zustand
│
├── node_modules/
│
├── .gitignore
├── app.json
├── eslint.config.js
├── expo-env.d.ts
├── package-lock.json
├── package.json
├── readme.md
├── tsconfig.json
