# Portfolio

Personal portfolio skeleton. Design and content are placeholders.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, Lenis (smooth scroll), three.js with React Three Fiber and drei, Resend (contact email).

## Structure

```
src/
  app/          Routes, layout, global styles, api/contact route
  components/
    layout/     Navbar, MobileMenu, Footer, SmoothScroll
    sections/   One component per page section (ids match data/navigation)
    ui/         Button, Card, SectionTitle, ProjectCard, TestimonialCard
    three/      R3F Scene, CrtScreen, shaders
  data/         All site content (typed, placeholder samples)
  types/        Types per domain
  lib/          validation, utils
  hooks/        useLenis, useActiveSection
public/         cv/, icons/stack/, images/
```

Components never hardcode content; they import from `src/data`.

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm run start`: serve the production build
- `npm run lint`: run ESLint

## Environment variables

Copy `.env.example` to `.env.local`:

- `RESEND_API_KEY`: Resend API key
- `CONTACT_TO_EMAIL`: address that receives contact form messages
