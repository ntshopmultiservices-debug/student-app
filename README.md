# Student Management System

## Prerequisites
1. **Node.js**: Install from [nodejs.org](https://nodejs.org/).
2. **XAMPP/MySQL**: Install XAMPP to run a local MySQL database.
3. **Git**: Install from [git-scm.com](https://git-scm.com/).

## Local Setup

### 1. Database
- Start Apache and MySQL from XAMPP Control Panel.
- Open phpMyAdmin (http://localhost/phpmyadmin).
- Create a database called `student_db`.
- Import the `database.sql` file provided in this folder, or simply paste the SQL queries from `database.sql` to create the `students` table.

### 2. Backend
- Open a terminal in this folder.
- Run `npm install` to install node modules (Express, MySQL, CORS).
- Run `npm run dev` to start the server. The server will run on `http://localhost:3000`.

### 3. Frontend
- Open `http://localhost:3000` in your browser. The backend serves the `index.html` file automatically!

---

## Git and Online Deployment (Online Run Method)

### Pushing to GitHub
1. Open a terminal in this folder.
2. Run the following commands:
   ```bash
   git init
   git add .
   # IMPORTANT: Create a .gitignore file to exclude node_modules
   echo "node_modules/" > .gitignore
   git add .gitignore
   git commit -m "Initial commit with backend and frontend"
   git branch -M main
   
   # Go to GitHub, create a new Empty Repository, and copy its URL
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Deploying the Database
- You need an online MySQL database since localhost won't work on the internet.
- Use a free provider like **Aiven MySQL** or **Clever Cloud**.
- Get the Host, User, Password, and Database Name from the provider.

### Deploying the Application (Render)
1. Sign up on [Render.com](https://render.com/).
2. Create a new **Web Service** and connect your GitHub account.
3. Select your student app repository.
4. Set the **Build Command** to `npm install`.
5. Set the **Start Command** to `node server.js`.
6. Scroll down to **Environment Variables** and add your online database credentials:
   - `DB_HOST` = (Your online DB Host)
   - `DB_USER` = (Your online DB User)
   - `DB_PASSWORD` = (Your online DB Password)
   - `DB_NAME` = student_db
7. Click **Deploy**. In a few minutes, Render will give you a live URL for your full stack application!
