# The Unsealable Message

> A free, viral web app that lets you send a message that unlocks at a future moment — creating anticipation, emotion, and a memorable reveal.

## Project summary

The Unsealable Message is a lightweight, zero-backend web application that lets users create time-locked messages for friends, loved ones, or their future selves. Users write a personal message, optionally attach a media link (YouTube, Spotify, image), choose a precise future unseal date/time, and receive a unique shareable link. The message data is encoded directly in the URL, and the recipient sees a live countdown that automatically reveals the message when the clock reaches zero.

## Key features

1. Write a message to the future
   - Write a personal message
   - Add an optional YouTube / Spotify / image link
   - Choose an exact date & time for the message to unlock

2. Shareable, zero-backend link
   - The entire message payload (text, unseal datetime, sender, media link) is encoded in the URL fragment (e.g. `#data=<encoded-string>`)
   - No server-side storage or database required

3. The anticipation hook
   - Recipients open the link and see a beautiful live countdown timer
   - The message remains hidden until the unseal time arrives

4. Auto-reveal
   - When the countdown ends the message unlocks instantly
   - Embedded media (YouTube, image, etc.) is shown inline
   - A prompt encourages the recipient to create their own message (viral loop)

5. Viral loop
   - Every receiver can become a sender; messages naturally propagate

## Technical architecture (zero backend)

- Single-page static app (HTML, CSS, JS) — designed to be deployed as static files
- All message data is encoded in the URL fragment (no query string or server storage needed)
- Client-side JavaScript handles:
  - Encoding/decoding the message payload
  - Time comparison and countdown logic (client clock used; local timezone supported)
  - Secure reveal UI and media embedding
- Consequences:
  - No backend costs, trivially scalable
  - Better privacy: message content is not sent to any server

## Privacy & security notes

- Messages live in the URL itself. Anyone with the link can view the message once it is unsealed. Treat links as private.
- The app does not persist messages to a server by design. If you need server-side backups or access control, consider adding an optional encryption layer or a server-based storage option.

## Why this works

- Emotionally powerful: anticipation + curiosity
- Highly shareable: users naturally forward the link to others
- Cheap and scalable: only a domain + static hosting required

## Typical use cases

- Birthdays and anniversaries
- New Year messages and future resolutions
- Exam-day motivation or encouragement
- Long-distance surprises and relationship notes

## One-sentence description

Send a message that unlocks at a future moment — creating anticipation, emotion, and a memorable reveal.

## Local development

Prerequisites: Node.js (recommended via nvm) and npm.

Start the dev server:

```powershell
npm install
npm run dev
```

Open the URL printed by the dev server (commonly `http://localhost:8080`).

## Build & deploy

Build the static bundle:

```powershell
npm run build
```

Deploy the generated `dist`/`build` folder to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, S3 + CloudFront, etc.).

## Files of interest

- `index.html` — main entry and social metadata
- `src/` — application source (React + TypeScript)
- `src/main.tsx` — app bootstrap
- `src/pages/Index.tsx` — primary UI for creating/unsealing messages

## Extending the app (ideas)

- Add optional client-side encryption so messages require a passphrase to decode
- Provide a server-side encrypted backup option for users who want recoverability
- Add a QR code generator for easier mobile sharing

## Contributing

Contributions are welcome. Please open issues or PRs for bug fixes and small improvements.
