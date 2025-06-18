# GitHub Setup for LiteCMMS

## 1. Repository Initialization
- Create a new private repository on GitHub (recommended)
- Clone the repository to your local machine:
  ```bash
  git clone https://github.com/your-org/litecmms.git
  ```

## 2. Add Remote (if not cloned)
```bash
git remote add origin https://github.com/your-org/litecmms.git
git branch -M main
git push -u origin main
```

## 3. Branching Strategy
- Use `main` for production
- Use `develop` for development
- Feature branches: `feature/xyz`
- Bugfix branches: `bugfix/xyz`
- Release branches: `release/x.y.z`

## 4. Pull Requests
- Always create a pull request for merging to `main` or `develop`
- Use clear titles and descriptions
- Assign reviewers

## 5. GitHub Actions (CI/CD)
- Configure workflows in `.github/workflows/`
- Example: Lint, test, build, deploy

## 6. Secrets & Environment Variables
- Never commit `.env` or secrets to the repo
- Use GitHub Secrets for CI/CD

## 7. Useful Commands
```bash
git status
git add .
git commit -m "Opis zmian"
git push
```

## 8. Issues & Discussions
- Use GitHub Issues for bug reports and feature requests
- Use Discussions for questions and ideas

## 9. Code Review
- Review code for security, performance, and readability
- Use comments and suggestions

## 10. License
- This project is proprietary. All rights reserved. 