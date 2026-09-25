# Bhavee Complete Editorial UI Refresh

Branch: `bhavee-complete-editorial-ui`

## Design Direction

This refresh moves the frontend toward the VIVAATHI editorial style shown in the reference screens:

- serif display headings with compact uppercase navigation
- white paper surfaces, pale blue panels, navy ink sections, and muted gold highlights
- square bordered controls instead of rounded dark cards
- tournament bracket, catalog, ranking, forum, and profile layouts inspired by elite debate publications
- shared UI primitives so old and new pages feel visually connected

## Main Frontend Changes

- `frontend/src/index.css`
  - Defines the global editorial theme tokens, page background, buttons, inputs, cards, panels, tabs, and compatibility overrides.
  - The compatibility layer restyles older dark-theme utility classes inside `page-bg` so untouched workflow pages still match the new UI.

- `frontend/src/pages/public/HomePage.tsx`
  - Rebuilt the landing route as a tournament discovery catalog with filters, image-led event cards, search, pagination visuals, and a host-tournament action.

- `frontend/src/pages/public/ScoringPage.tsx`
  - Rebuilt the rankings route as an editorial leaderboard with top debaters, standings table, metrics, and methodology section.

- `frontend/src/pages/public/ForumPage.tsx`
  - Uses the forum layout from the reference: topic sidebar, proposition/opposition columns, rebuttal tagging, and a point composer.

- `frontend/src/pages/tournament/TournamentPage.tsx`
  - Rebuilt tournament detail as a bracket-first championship page with final card, tournament insights, proceedings, tabs, comments, matches, leaderboard, scoresheet, and results sections.

- `frontend/src/components/common/SharedProfileLayout.tsx`
  - Reworked profile/dashboard shell to match the debater profile reference with portrait, badges, stats, performance chart, history, feedback, and expertise areas.

- Auth and support pages
  - Login, signup, role selection, search, and about pages use the same theme primitives and are covered by the global component system.

## How To Run Locally

From the repository root:

```bash
cd /Users/bhaveenthankajanikanth/Documents/Debate_Front_Work/frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Production build check:

```bash
cd /Users/bhaveenthankajanikanth/Documents/Debate_Front_Work/frontend
npm run build
```

## Where To Change The UI Later

- Colors: edit CSS variables and shared classes in `frontend/src/index.css`.
- Main navigation: edit `frontend/src/components/layout/Navbar.tsx`.
- Footer links/newsletter: edit `frontend/src/components/layout/Footer.tsx`.
- Tournament cards on the landing page: edit `frontend/src/pages/public/HomePage.tsx`.
- Ranking table and methodology content: edit `frontend/src/pages/public/ScoringPage.tsx`.
- Forum topics and sample points: edit `frontend/src/pages/public/ForumPage.tsx`.
- Tournament bracket and detail sections: edit `frontend/src/pages/tournament/TournamentPage.tsx`.
- Profile/dashboard presentation: edit `frontend/src/components/common/SharedProfileLayout.tsx`.

## Version Control Commands

```bash
git status
git add frontend/src docs/bhavee-complete-editorial-ui.md
git commit -m "Complete bhavee editorial frontend refresh"
git push -u origin bhavee-complete-editorial-ui
```
