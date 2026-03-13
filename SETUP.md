# Setup: GitHub Repository

## Create the repo on GitHub

1. Go to https://github.com/new
2. Repository name: `student-centered-statistics-app` (or whatever you prefer)
3. Set to **Public** or **Private**
4. Do NOT initialize with README (we will push from local)
5. Click **Create repository**

## Connect your local folder to GitHub

Open a terminal and run:

```bash
cd "c:/Users/andre/Dropbox/Claude Agent/Student-Centered Statistics App"
git init
git add .
git commit -m "Initial commit: project brief and content reference"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-centered-statistics-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Note on git identity

If you have not configured git globally yet, run these first:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## After setup

All future work in this folder will be tracked. Use standard git workflow:

```bash
git add .
git commit -m "description of changes"
git push
```
