# AI Joke App

A simple Express + frontend app that generates one short funny joke at a time.

The backend asks OpenAI for JSON in this format:

```json
{"joke":"..."}
```

If OpenAI is unavailable (or quota is exceeded), the app automatically returns built-in fallback jokes in the same format.

## Prerequisites

- Node.js 18+
- An OpenAI API key (optional, fallback jokes work without it)

## Setup

1. Open a terminal in the project folder:

```powershell
cd c:\Users\nishi\Desktop\jaiv\github\ai-joke-app
```

2. Install dependencies:

```powershell
npm install
```

3. Add environment variables in `.env`:

```env
OPENAI_API_KEY=your_api_key_here
PORT=3000
```

## Run

```powershell
npm start
```

Then open `http://localhost:3000` in your browser.

If you are running commands from the parent folder, use:

```powershell
npm --prefix "c:\Users\nishi\Desktop\jaiv\github\ai-joke-app" start
```

## API

- Endpoint: `POST /joke`
- Request body: `{}`
- Success response:

```json
{"joke":"Your generated joke here"}
```

## Notes

- If `OPENAI_API_KEY` is missing or the upstream API fails, the server returns built-in fallback jokes.
