# Planner — Daily Task Planner

A minimal personal daily task planner — clean, focused, and distraction-free.

## Setup & Run

No build tools or backend required.

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
2. Start planning your day

Tasks persist automatically in localStorage — refresh freely.

## Features

- **Daily view** focused on today's tasks
- **Overdue, Upcoming, Completed, All** views
- **Top 3 Priorities** section for daily focus
- **Progress bar** tracking today's completion
- **Quick actions** — check off, change status/priority, reschedule from the card
- **Full CRUD** — add, edit, delete tasks
- **Search** by title, project, or tags
- **Filter & sort** by priority, status, due date
- **Dark mode** toggle
- **Keyboard shortcuts** — `N` new task, `/` search, `Esc` close modal
- **Delete confirmation** dialog
- **Sample seed data** on first load
- **Responsive** — desktop and tablet

## File Structure

```
task-planner/
  index.html    — Main HTML structure
  styles.css    — All styling (light + dark mode)
  app.js        — Application logic (IIFE module)
  README.md     — This file
```

## Technology

- Pure HTML, CSS, JavaScript — no frameworks, no dependencies, no build tools
- localStorage for persistence
- Inter font via Google Fonts (falls back to system fonts offline)
- CSS custom properties for theming

## Design Choices

- **Vanilla JS over frameworks**: For a single-user tool this simple, a framework adds unnecessary complexity. An IIFE module keeps everything scoped and readable.
- **Single-page approach**: All views are filtered from the same task list, avoiding routing complexity.
- **Minimal color palette**: Muted blues and grays reduce cognitive load. Priority colors use red/amber/green only where meaningful.
- **Cards with subtle borders**: Flat shadows and thin borders give structure without visual noise. Hover states are barely perceptible.
- **Inter font**: Clean, highly readable, and pairs well with the minimal aesthetic.
- **Status dropdowns on cards**: Changing status takes one click — no modal required. This makes daily progress tracking fast.
- **Inline date reschedule**: Clicking the date lets you reschedule directly from the card.
- **Top 3 priorities**: A dedicated section forces focus on what matters most each day. Tasks can be starred as "top priority" via the planner.
- **Completed tasks stay visible** but visually separated and de-emphasized — you can see what you've accomplished.
- **Dark mode uses data-theme attribute**: CSS custom properties swap instantly without FOUC.
- **No drag-and-drop**: Deliberately omitted to keep interactions simple and reliable. Sorting handles prioritization.
