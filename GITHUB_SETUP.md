# GitHub Setup Guide

This guide will help you push this project to GitHub.

## Step 1: Initialize Git Repository

```bash
cd /Users/sp380/jira-velocity-metrics
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Jira Velocity Metrics Generator"
```

## Step 4: Create Repository on GitHub

1. Go to [GitHub.com](https://github.com)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `jira-velocity-metrics` (or your preferred name)
4. Description: `Automated tool to generate velocity metrics and AI impact reports from Jira sprint boards`
5. Choose visibility: **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

## Step 5: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/jira-velocity-metrics.git

# Or if you prefer SSH:
# git remote add origin git@github.com:YOUR_USERNAME/jira-velocity-metrics.git
```

## Step 6: Push to GitHub

```bash
# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 7: Verify

Go to your GitHub repository page and verify all files are uploaded correctly.

## Important Notes

### Files NOT Included (Protected by .gitignore)
- `.env` - Contains your API tokens (never commit this!)
- `reports/` - Generated PowerPoint files
- `__pycache__/` - Python cache files
- `*.pptx` - PowerPoint files

### Files Included
- ✅ All source code (`.py` files)
- ✅ `README.md` - Project documentation
- ✅ `requirements.txt` - Dependencies
- ✅ `.env.example` - Template for environment variables
- ✅ All documentation files (`.md` files)

## Next Steps After Pushing

1. **Add a License** (optional but recommended)
   - Go to repository → Settings → Scroll down → Add license
   - MIT License is a good choice for open source

2. **Add Topics/Tags** (optional)
   - Click on the gear icon next to "About"
   - Add topics: `jira`, `velocity-metrics`, `python`, `agile`, `sprint-tracking`

3. **Enable GitHub Actions** (optional)
   - Add CI/CD workflows if you want automated testing

4. **Add Collaborators** (if needed)
   - Settings → Collaborators → Add people

## Troubleshooting

### "Repository already exists" error
- You may have already created the repository
- Check your GitHub account for existing repositories
- Or use a different repository name

### Authentication issues
- Use GitHub Personal Access Token instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### "Permission denied" error
- Make sure you have write access to the repository
- Check that the remote URL is correct

## Quick Commands Reference

```bash
# Check status
git status

# See what files will be committed
git status --short

# View commit history
git log --oneline

# Update remote URL if needed
git remote set-url origin https://github.com/YOUR_USERNAME/jira-velocity-metrics.git

# Pull latest changes (if working with others)
git pull origin main
```
