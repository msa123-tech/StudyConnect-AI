@echo off
cd /d "%~dp0"
git add .
git commit -m "feat: modern UI polish for landing and login - Typography, gradients, buttons, hero, features, login, university search, navbar, footer"
git push origin final_frontend
pause
