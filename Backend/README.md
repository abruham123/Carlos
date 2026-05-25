# Todo Fut Booking API

This backend receives booking requests from `CarlosFINAL.html`, validates the JSON, and stores valid rows in Supabase.

## API Endpoint

```text
POST /api/bookings
```

The frontend form already points here:

```html
data-endpoint="/api/bookings"
```

Because `server.js` serves the website and API together, open the site from Express:

```text
http://localhost:3000
```

Then `/api/bookings` correctly points to:

```text
http://localhost:3000/api/bookings
```

## Request JSON

```json
{
  "contactName": "Carlos Murillo",
  "playerName": "Alex Murillo",
  "phone": "(951) 555-0100",
  "email": "parent@example.com",
  "playerAgeGroup": "Ages 10-13",
  "sessionType": "Private 1-on-1",
  "preferredDate": "2026-06-01",
  "preferredTime": "Weekday evening",
  "trainingGoals": "Finishing and first touch.",
  "bookingConsent": true
}
```

## Success Response

```json
{
  "success": true,
  "message": "Booking request received.",
  "bookingId": "generated-supabase-id"
}
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env`.

3. Add your Supabase values to `.env`:

```env
PORT=3000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. In Supabase SQL Editor, run `supabase-schema.sql`.

5. Start the backend:

```bash
npm run dev
```

6. Open:

```text
http://localhost:3000
```

## Security Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` only in `.env`.
- Do not put Supabase secrets in `main.js`.
- Frontend validation helps users, but backend validation protects the database.
- The hidden `website` field is a honeypot spam check and should stay empty.
