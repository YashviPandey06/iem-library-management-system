# GitHub Repository Upload & Publishing Guide
**Institute of Engineering & Management, Kolkata**  
*Library Management System*

---

## 1. Overview

This self-contained project package has been prepared for you to upload directly to **YOUR OWN GitHub account**.

> [!IMPORTANT]
> **No remote repositories have been created, accessed, or modified on the sender's account.**
> You have complete ownership and control over where and how you publish this codebase.

---

## 2. Step-by-Step GitHub Upload Instructions

### Step 1: Create a New Repository on GitHub
1. Open your web browser and navigate to [https://github.com/](https://github.com/).
2. Sign in to **your personal or organizational GitHub account**.
3. In the top-right corner, click the **`+`** icon and select **New repository**.
4. Fill in the repository details:
   - **Repository name**: `iem-library-management-system` (or your preferred name).
   - **Description**: `Full-stack Library Management System for Institute of Engineering & Management, Kolkata`.
   - **Visibility**: Choose **Public** or **Private**.
   - **Initialize this repository with**: **DO NOT** check "Add a README file", `.gitignore`, or license (this package already contains custom, pre-configured versions of all three).
5. Click **Create repository**.
6. GitHub will now display your new repository URL (e.g. `https://github.com/YOUR_USERNAME/iem-library-management-system.git`).

---

### Step 2: Initialize Git and Push from Your Local Computer

1. Open your terminal (PowerShell, Command Prompt, or Bash) and navigate to the extracted project root directory:
   ```bash
   cd path/to/IEM_Library_Management_System_GitHub_Ready
   ```

2. Initialize a local Git repository:
   ```bash
   git init
   ```

3. Stage all files (the `.gitignore` is already configured to automatically exclude build caches, dependencies, and temporary files):
   ```bash
   git add .
   ```

4. Create your initial commit:
   ```bash
   git commit -m "Initial commit: Complete IEM Library Management System full-stack release"
   ```

5. Set the primary branch to `main`:
   ```bash
   git branch -M main
   ```

6. Link your local repository to your newly created GitHub repository:
   *(Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub details)*
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/iem-library-management-system.git
   ```

7. Push your project to GitHub:
   ```bash
   git push -u origin main
   ```

---

## 3. Alternative: GitHub Desktop Workflow

If you prefer a graphical interface:
1. Open **GitHub Desktop**.
2. Select **File** -> **Add Local Repository...**.
3. Browse to the extracted `IEM_Library_Management_System_GitHub_Ready` folder and click **Add Repository**.
4. Click **Publish repository**.
5. Select your GitHub account, choose visibility (Public/Private), and click **Publish Repository**.

---

## 4. Post-Upload Verification

Once pushed, visit your repository page on GitHub. You should verify:
- [ ] Root `README.md` renders with official IEM Kolkata branding, architecture diagrams, and quickstart commands.
- [ ] Directories `frontend/`, `backend/`, `console/`, `android/`, `database/`, `docs/`, and `scripts/` are cleanly populated.
- [ ] No `node_modules/`, `build/`, `.gradle/`, or temporary logs are present in the repository tree.
- [ ] GitHub Actions / CI workflows can be attached if desired.

---

## 5. Deployment Notice

Remember that while GitHub Pages can host the static frontend (`frontend/dist`), the Kotlin Ktor backend and SQLite database require an active server or container runtime (such as Render, Railway, AWS, or a Linux VPS). See [`docs/DEPLOYMENT.md`](DEPLOYMENT.md) for full deployment instructions.
