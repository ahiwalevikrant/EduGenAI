# EduGen AI

EduGen AI is a curriculum-grounded teaching workspace for creating board-aligned classroom material. It helps educators select an official curriculum chapter and generate question papers, daily practice plans, answer keys, teaching presentations, and educational diagrams.

The interface is designed around a focused educator workflow: one sidebar for navigation, a compact header, page-transition feedback, light/dark themes, and a profile menu with settings and logout.

## Features

- Curriculum directory for CBSE/NCERT, Maharashtra State Board/Balbharati, and ICSE/CISCE content.
- Chapter, board, class, academic-year, and subject selection.
- AI-powered generation tools:
  - Question papers
  - Daily Practice Plans (DPP)
  - Answer keys and marking rubrics
  - Teaching slide decks with PPTX export
  - Educational diagrams
- DOCX export for question papers, answer keys, and DPP worksheets.
- Saved generated papers, rubrics, and slide decks in browser storage.
- OpenRouter and Groq provider settings, connection testing, model selection, and API-key storage.
- Responsive desktop sidebar and mobile navigation drawer.
- Login screen with local demo credentials (`admin` / `admin`).

## Tech stack

- [Next.js 14](https://nextjs.org/)
- React 18 and TypeScript
- Tailwind CSS
- Lucide icons
- `docx` for DOCX exports
- `pptxgenjs` for PowerPoint exports

## Getting started

### Prerequisites

- Node.js 18.17 or later
- npm 9 or later
- An OpenRouter or Groq API key if you want to use AI generation

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. New visitors are shown the Login screen. Use `admin` as both the username and password for the local demo login.

### Production build

```bash
npm run build
npm run start
```

## AI provider setup

1. Sign in to the workspace.
2. Open the profile initials in the upper-right corner.
3. Select **AI Settings**.
4. Add an API key to OpenRouter or Groq, choose a model, and make it the active provider.
5. Use the connection test before generating classroom material.

Provider configuration is stored in the browser's local storage. Do not use production secrets in an untrusted shared browser profile.

## Project structure

```text
app/                    Route pages and root layout
components/             UI, layout, curriculum, generation, and preview components
services/               Curriculum catalogs, AI providers, generators, and exporters
store/                  Browser-backed React state hooks
  use-auth-store.ts     Local login state
  use-settings-store.ts AI-provider and theme settings
  use-history-store.ts  Saved generated content
```

Key routes:

| Route | Purpose |
| --- | --- |
| `/` | Educator dashboard |
| `/curriculum` | Curriculum and chapter directory |
| `/generate/question-paper` | Question-paper generator |
| `/generate/dpp` | Daily Practice Plan generator |
| `/generate/answer-key` | Answer-key and rubric generator |
| `/generate/ppt` | Teaching slide-deck studio |
| `/generate/images` | Diagram generator |
| `/history` | Saved work |
| `/settings` | AI provider settings |

## Authentication note

Authentication is a local demo workflow backed by browser storage; it is not a production identity system. 

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create and validate the production build
npm run start    # Start the production server after building
npm run lint     # Run the configured lint command
```

## Current limitations

- API keys and generated-history records are stored locally in the browser.
- AI requests are made with the selected provider configuration; production deployments should move credential handling to a secure server-side layer.
- Local authentication should be replaced with a real identity provider before production use.

