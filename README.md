# Cebu Eastern College portal

HTML, CSS and plain JavaScript frontend, Node.js backend, and Firebase Cloud Firestore database integration.

## Preview now — no Firebase project needed

Install Node.js 22 or newer. Open this project folder in your terminal:

```sh
npm run demo
```

Visit http://localhost:3000.

On Windows PowerShell, use `npm.cmd run demo` (and `npm.cmd install` / `npm.cmd test`) if execution policy blocks `npm.ps1`.

Demo username: `student.demo`  
Demo password: `Preview123!`

Preview mode stores changes in memory and resets on restart. It does not connect to Firebase. To connect a real database, follow [SETUP.md](SETUP.md).

## Pages

- Landing page: `public/index.html`
- Login and create-account pages: `public/login.html`, `public/signup.html`
- Home dashboard: `public/dashboard.html`
- Personal profile: `public/profile.html`
- Grades, academic records with year/semester controls, and class schedule
- Enrollment form, announcements, settings, about, and contact
- Assignments and attendance provide empty states until records are supplied

Successful login opens the dashboard. Profile edits, enrollment submissions, report submissions and notification preferences use authenticated backend endpoints. Firebase mode stores them in Firestore. Registration uses salted scrypt password hashes; login accepts the username shown in the design. This implementation uses custom Node.js authentication, not Firebase Authentication. Sessions use HttpOnly cookies and are stored in Firestore in Firebase mode.

## Design and photo spaces

The layouts were recreated from the supplied screenshots and the accessible Figma canvas at https://www.figma.com/design/zXZGJgIICzTXdsaox4zNkI/PORTAL-DESIGN. The original logo, campus photos, watermark, and portrait photos are intentionally not bundled. See [PHOTO-SPACES.md](PHOTO-SPACES.md) for replacement locations.

The implementation follows the inspected major page layouts. Exact pixel parity is not certified: the Figma guest view did not expose inspectable font/spacing specifications, some small text was unreadable, original media are placeholders, and responsive layouts adapt to screen size. Academic sample values, names and announcement copy are demonstration content. Secondary component variants were not separately reproduced as standalone pages.

## Current limits

No Firebase project has been created or connected; the user does not have one yet. Firebase integration code is included, but live Firebase requests have not been verified. Preview mode has working sample data. Firebase mode starts with no published academic records.

Google/Facebook OAuth, password reset email, payment processing and document uploads are not configured. The UI explains those states. Enrollment submits information only; supporting documents go through the school office. Report submission stores a report for review and does not send email. Notification preferences are stored but notification delivery is not implemented. There is no administrative editing interface; trusted administrators can populate school records through the Firebase console or an authorized backend process.

## Tests

```sh
npm test
```

Tests run a separate in-memory server and cover page routes, authentication, validation, duplicate accounts, protected records, profile updates, preference and enrollment isolation, logout, and cross-origin rejection. They do not connect to Firebase.

The server binds to localhost by default. For a deployed server, configure HOST, APP_ORIGIN and HTTPS, set NODE_ENV=production, and use appropriate Firebase IAM access for the server account. Keep service-account files and `.env` out of public folders and source control.
