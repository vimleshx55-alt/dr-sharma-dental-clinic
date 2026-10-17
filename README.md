# Dr. Sharma Dental Clinic — website starter

A mobile-friendly clinic website with appointment request form, server-side appointment storage, and a password-protected admin page to review requests and update their status.

## What works in this starter
- Responsive public clinic website and contact links.
- Appointment form: name, mobile, address, preferred date/time, concern, and payment preference.
- Appointment requests are saved on the server in `appointments.json`.
- Admin login and appointment list; status can be changed to New, Confirmed, Completed, or Cancelled.
- Cash-at-clinic option.

## Important before publishing
- Online payments are **not active** in this starter. Real payments must not be accepted until a payment provider merchant account is created and the server-side order creation and signature verification are implemented and tested. Do not collect card/UPI credentials directly on this website.
- Replace the generic treatment descriptions with clinic-confirmed services, doctor qualifications, hours, and any required registration details.
- Add a privacy notice and clinic policies before collecting real patient information. Store only the information needed; use HTTPS and secure backups in production.
- The admin panel is protected by a shared password from `.env`; use a long unique password. For a production launch, add stronger authentication, rate limiting, database storage, and backups.
- `appointments.json` is simple local file storage, suitable only for a starter/demo deployment. Use a managed database for production and ensure persistent disk storage on the host.

## Run locally
1. Install Node.js 18 or newer.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env` and change `ADMIN_PASSWORD` to a strong password.
4. Run `npm start`.
5. Open `http://localhost:3000`.
6. Scroll to “Clinic admin” to sign in using the password in `.env`.

## Deploy
Deploy to a Node.js host that supports environment variables and persistent storage, set `ADMIN_PASSWORD`, and enable HTTPS. Do not upload `.env` to a public repository. Add the site's own domain after deployment.
