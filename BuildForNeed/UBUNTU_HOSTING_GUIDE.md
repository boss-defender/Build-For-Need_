# Ubuntu Local Self-Hosting Guide 🖥️

This guide outlines exactly how to host **Project From Problem** on your local Ubuntu PC, making it an independent, network-accessible, and highly resilient community portal. Since all data is stored directly on your machine's filesystem, you can safely power off your computer at any time without losing any data.

---

## 🧠 Part 1: How your local PC acts as the Server

When you run this application on your local Ubuntu machine:
1. **The Backend Server (Express/Node.js)**: Runs on your local CPU. It serves the custom REST API endpoints, coordinates user registrations, verifies hashed credentials, and manages the posts/comments pipeline.
2. **The Database Layer (`db.json`)**: A local JSON file storage located at safety path `/db.json`. Unlike transient in-memory engines:
   - Every user registration, login salt/hash, post, bookmark, and comment is immediately serialized and written to the solid-state or hard drive of your Ubuntu PC.
   - When the Node.js server starts, it reads `db.json` back into memory.
   - When the server is turned off, the file remains locked safely on disk on your Ubuntu machine. When it boots up again, the state resume is 100% loss-free.
3. **The Web UI (Vite/React)**: Handed out by the Express server to anyone typing your machine's local network IP in a browser. The code runs directly in their browser but communicates with your Ubuntu PC over the local network.

---

## 🛠️ Part 2: Step-by-Step Installation on Ubuntu

Follow these instructions to set up and run the app from your Ubuntu laptop or desktop:

### 1. Prerequisites (Install Node.js & Git)
Ensure your Ubuntu machine has Node.js (version 18+ recommended) and `npm` installed. Run these terminal commands:

```bash
# Update Ubuntu package indices
sudo apt update

# Install Node.js & npm packages
sudo apt install -y nodejs npm

# Confirm successful installation
node -v
npm -v
```

### 2. Prepare Project Folder
Extract or clone the project folder on your Ubuntu PC:

```bash
# Enter the workspace directory where you copied the project files
cd path/to/project-from-problem
```

### 3. Install NPM Dependencies
Run this command from the root of the project to retrieve and install all the local packages (Vite, React, Express, Lucide, Motion, etc.) safely:

```bash
npm install
```

---

## 🏃 Part 3: Running the Platform

### Single Command to Build and Start
Your project is configured with a streamlined build-and-run system. You should compile the assets to optimized Javascript before running. 

To execute the application:

```bash
# Step A: Compile the client-side files and bundle the backend server (run once or after edits)
npm run build

# Step B: Start the production server
npm run start
```

Your server is now active and listening on **Port 3000**!

---

## 🌐 Part 4: Accessing the App From Your Network
To allow your friends on the same Wi-Fi or LAN network to post problems and solutions, perform these simple steps:

1. **Find your Ubuntu PC's Local IP address**:
   In your terminal, run:
   ```bash
   ip a | grep "inet "
   ```
   Look for your network interface IP (typically starting with `192.168.X.X` or `10.X.X.X`).

2. **Accessing from other devices**:
   On any phone, laptop, or tablet connected to the **same Wi-Fi network**, open a web browser and navigate to:
   ```txt
   http://<YOUR_UBUNTU_IP_ADDRESS>:3000
   ```
   *For example: `http://192.168.1.42:3000`*

3. **Check Firewall Settings (if others cannot connect)**:
   By default, Ubuntu might block incoming traffic on Port 3000. To allow connections, run:
   ```bash
   sudo ufw allow 3000/tcp
   sudo ufw reload
   ```

---

## 🔄 Part 5: Safe Shutdown & Restart Workflow

Because we utilize robust, atomic filesystem writes to `db.json`, there is **no risk of database corruption or data loss** during restarts.

### How to Power Off Safely:
1. In your terminals running `npm run start`, press **`Ctrl + C`** to gracefully stop the Node process.
2. It is now completely safe to turn off or reboot your Ubuntu computer. All accounts, passwords, categories, bookmarks, posts, and comments are persisted securely inside `./db.json`.

### How to Turn On Again:
1. Turn on your PC.
2. Open your terminal, navigate to the folder, and start the engine:
   ```bash
   cd path/to/project-from-problem
   npm run start
   ```
3. All prior usernames, hashed passwords, session logs, and discussions are loaded back instantly.

---

## 👑 Part 6: DevOps Protip — Autostart on Ubuntu Boot (Systemd)

If you want the website to launch automatically in the background whenever your Ubuntu PC starts up, you can configure a standard Linux **systemd system service**:

1. Create a service configuration file:
   ```bash
   sudo nano /etc/systemd/system/project-problem.service
   ```

2. Paste the following configuration (replace `/path/to/project-from-problem` with the absolute path of your project directory, and replace `yourusername` with your active Ubuntu username):
   ```ini
   [Unit]
   Description=Project From Problem Self-Hosted Server
   After=network.target

   [Service]
   Type=simple
   User=yourusername
   WorkingDirectory=/path/to/project-from-problem
   ExecStart=/usr/bin/npm run start
   Restart=on-failure
   Environment=NODE_ENV=production

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start your new service:
   ```bash
   # Reload systemd configuration
   sudo systemctl daemon-reload

   # Enable service to start automatically on system bootup
   sudo systemctl enable project-problem.service

   # Start the service immediately
   sudo systemctl start project-problem.service
   ```

4. You can check the server logs at any time using:
   ```bash
   sudo journalctl -u project-problem.service -f -n 100
   ```

Now your Ubuntu PC is a true self-hosted local server. The app starts automatically, stays running, hashes credentials securely, and keeps everything stored on your machine!
