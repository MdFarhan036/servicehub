# ServiceHub — Technician Portal

React + Vite technician registration/workspace portal with an embedded rule-based support chatbot.
No backend yet — auth and data are mocked with localStorage / static JS files, ready to be wired
to a real API later.

## Stack
- React 18 + Vite
- JavaScript (no TypeScript)
- Custom CSS (design tokens in `src/styles/variables.css`)
- React Router DOM v6
- React Icons (Feather set)

## Getting Started
```bash
npm install
npm run dev
```
Then open the printed local URL (default http://localhost:5173).

First visit redirects to `/login`. Since there's no backend, any email + password
combination on the Login or Register page will "log you in" (stored in localStorage
under `sh_technician_auth`) and drop you into the Dashboard.

## Structure
- `src/pages/technician/*` — Login, Register, Dashboard, Jobs, Job Details, Profile,
  Documents, Earnings, Notifications, Settings
- `src/components/chatbot/*` — floating support chatbot (button, window, messages,
  quick replies, text input, image/video upload with client-side validation)
- `src/components/jobs/*` — JobCard, JobTimeline, MediaViewer
- `src/components/layout/*` — Sidebar, Header, MobileNav (responsive breakpoints in
  `src/styles/responsive.css`)
- `src/data/*` — mock jobs, technician profile, notifications, earnings, chatbot data
- `src/utils/chatbotLogic.js` — simple rule-based bot reply engine (swap for a real
  API call later)
- `src/utils/fileValidation.js` — file type/size validation for chat + document uploads

## Design tokens (from ServiceHub brand)
Primary indigo `#4F46E5`, near-black headings `#0F172A`, serif display font
(Playfair Display) for headings, Inter for UI/body text — see `variables.css`.

## Next steps (when backend is ready)
- Replace `localStorage` auth in `AppRoutes.jsx` with real JWT/session auth
- Replace `src/data/*.js` static arrays with API calls (React Query / fetch)
- Wire `chatbotLogic.js` to a real support/AI backend endpoint
- Add real file upload (multipart) instead of local `URL.createObjectURL` previews
