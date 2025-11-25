#!/bin/bash

# Script to push Kismat project to GitHub
# Usage: ./push-to-github.sh <your-github-username> <repository-name>

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: ./push-to-github.sh <your-github-username> <repository-name>"
  echo "Example: ./push-to-github.sh shadybrook kismat_updated-main"
  exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME=$2

echo "🚀 Setting up GitHub remote for $GITHUB_USERNAME/$REPO_NAME"

# Add remote (using HTTPS - you can change to SSH if preferred)
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Rename branch to main (GitHub's default)
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Done! Your code is now on GitHub at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
