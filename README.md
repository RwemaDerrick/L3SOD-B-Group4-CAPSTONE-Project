# Moodlink

Emotional support platform with mood-based peer matching, real-time chat, and **Aria** — an AI wellness companion.

## Stack

- **Frontend:** HTML, CSS, vanilla JS (ES modules)
- **Backend:** Node.js, Express, Socket.io, Prisma, SQLite
- **Auth:** JWT in httpOnly cookies, bcrypt passwords

## Quick start (Windows)

Double-click **`start.bat`** in the project folder, or run:

```powershell
cd C:\Users\derri\moodlink\server
npm install
npm run dev
```

Open **http://localhost:5000** in your browser.

> **Important:** Do not open `index.html` directly from the file explorer. The app must run through the server on port 5000, or API calls will fail.

### Development (optional split ports)

```bash
npm run dev
```

- Client: http://localhost:3000  
- API: http://localhost:5000  

## Features

| Feature | Endpoint / page |
|---------|-----------------|
| Register / login | `POST /api/register`, `POST /api/login` |
| Dashboard & matching | `GetStarted.html` + Socket.io |
| Aria AI chat | `aria.html` → `POST /api/aria/chat` |
| Contact form | `contact.html` → `POST /api/contact` |

## Aria & OpenAI

Without `OPENAI_API_KEY`, Aria uses built-in supportive responses. Add your key to `server/.env`:

```
OPENAI_API_KEY=sk-...
```

## Crisis support

Aria detects crisis language and surfaces **988** resources. Moodlink is wellness support, not clinical care.

## Project structure

```
moodlink/
  client/          Static frontend
  server/
    prisma/        Schema & SQLite DB
    src/           Express + Socket.io
```

## License

MIT
