# User Manual for Scorion Feedback System

## 1. System Requirements

Before proceeding, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (Node Package Manager)
- A terminal or command prompt (CMD, PowerShell, IntelliJ's terminal, etc)

## 2. Project Setup

### Step 1: Install Dependencies

To install the required dependencies, follow these steps:

1. Open IntelliJ command console, CMD, or Terminal.
2. Navigate to the client and server directories, respectively, using the following commands:

   ```sh
   cd path\to\client
   npm install
   ```

   Expected output should include:

   ```
   added <n> packages, and audited <n> packages in <n> seconds
   ```

   Repeat the process for the backend:

   ```sh
   cd path\to\server
   npm install
   ```

   Similar output should be displayed confirming the installation.

## 3. Running the Application

### Step 2: Launching the Backend

To start the backend server:

1. Open the terminal and navigate to the server directory:

   ```sh
   cd path\to\server
   ```

2. Start the backend server by running:

   ```sh
   npm start
   ```

   Expected output should include:

   ```
   Created uploads directory at: [directory]\server\src\videos
   Database initialized and tables are ready.
   Server is running on http://localhost:3000
   ```

**Stopping the Backend:**  
To shut down the server, press `Ctrl + C` in the terminal. You will be prompted with:

```
Terminate batch job (Y/N)?
```

Type `Y` and press `Enter` to stop the server.

### Step 3: Launching the Frontend

To start the frontend:

1. Navigate to the client directory in your terminal:

   ```sh
   cd path\to\client
   ```

2. Start the frontend using the following command:

   ```sh
   npm run dev
   ```

   Expected output should include:

   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ➜  press h + enter to show help
   ```

Open the application by going to `http://localhost:5173/` in your browser.

**Stopping the Frontend:**  
To shut down the server, press `Ctrl + C` in the terminal. You will be prompted with:

```
Terminate batch job (Y/N)?
```

Type `Y` and press `Enter` to stop the frontend.
