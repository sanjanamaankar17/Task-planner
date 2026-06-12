# Planner — Daily Task Planner

A minimal personal daily task planner with a pastel dashboard UI — built for an ETL/AI developer workflow.

## Setup & Run

No build tools or backend required.

1. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
2. Start planning your day

Tasks persist automatically in localStorage — refresh freely.

## Features

- **5 views** — Today, Overdue, Upcoming, Completed, All Tasks
- **3-column dashboard** — sidebar nav, main task area, right widgets (stats, calendar, categories)
- **Top cards** — daily progress ring, motivational quote over scenic images, productivity score bar
- **Quick filters** — All / High Priority / Pending / Completed tabs with sort dropdown
- **Full CRUD** — add, edit, delete tasks with modal forms
- **Start Date, Due Date, Assigned Date** — with relative labels (Today, Yesterday, X days ago)
- **Est. Time & Time Spent** — in `1h 30m` / `45m` format
- **Search** by title, project, or tags
- **Dark mode** toggle with distinct palette
- **Keyboard shortcuts** — `N` new task, `/` search, `Esc` close modal
- **Right widgets** — upcoming deadlines, calendar grid, project categories with progress bars
- **Mini stats** — streak, focus minutes, completed count, achievements
- **Toast notifications** and confetti on all-tasks-complete
- **Profile settings** — click sidebar avatar to set name and role
- **Responsive** — sidebar hidden at 768px, right column hidden at 1024px

## File Structure

```
task-planner/
  index.html    — Single self-contained file (HTML + CSS + JS inlined)
  README.md     — This file
```

## Technology

- Pure HTML, CSS, JavaScript — no frameworks, no dependencies, no build tools
- Single-file — easy to share, just `index.html`
- localStorage for persistence
- Inter font via Google Fonts (falls back to system fonts offline)
- CSS custom properties for light/dark theming

## Design Choices

- **Single file**: CSS and JS are inlined so you can share or open the HTML anywhere — nothing to serve.
- **Vanilla JS over frameworks**: For a single-user tool this simple, a framework adds unnecessary complexity. An IIFE module keeps everything scoped and readable.
- **Pastel palette**: Lavender, mint, pink, and pale blue create a soft, warm aesthetic that's easy on the eyes.
- **3-column layout**: Sidebar navigation, central task area, and right dashboard widgets — desktop-first, responsive down to tablet.
- **Cards with subtle shadows**: Flat shadows and thin borders give structure without visual noise.
- **Inter font**: Clean, highly readable, and pairs well with the minimal aesthetic.
- **Status dropdowns on cards**: Changing status takes one click — no modal required.
- **Inline date reschedule**: Clicking the date lets you reschedule directly from the card.
- **Toast notifications**: Subtle feedback for add/complete/delete actions.
- **Dark mode**: Distinct near-black background with brighter accent colors — not just inverted light mode.
- **Scenic quote card**: Random Unsplash images as background for the motivational quote section.
- **No drag-and-drop**: Deliberately omitted to keep interactions simple and reliable.
