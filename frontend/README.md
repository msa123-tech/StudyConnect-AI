# StudyConnect

AI-powered academic collaboration platform — premium landing page for hackathon demo.

## Stack

- **React** (Vite)
- **Tailwind CSS**
- **React Router**

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Hero background:** Place your hero image as `public/hero-bg.png` to show the study session photo behind the hero section.

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/components/` — Navbar, Hero, About, Features, CollegeSelector, Footer
- `src/pages/` — Landing, Login
- College selector redirects to `/login?college=<name>` (frontend-only for demo)
