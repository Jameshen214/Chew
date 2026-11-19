# CHEW website: setup and deployment guide

Static website (no build step). Pages: index.html, game.html, leaderboard.html, profile.html, admin.html.
Backend: Supabase project "CHEW" (ref dryekzswjtcimnkpcasw). The site only uses the PUBLIC publishable key. No secret keys are in this folder.

## Part 1: Supabase dashboard settings (you must do these, they cannot be done from code)
Open https://supabase.com/dashboard/project/dryekzswjtcimnkpcasw

1. **Email codes (OTP)** — Authentication → Email Templates. Edit BOTH "Confirm signup" and "Magic Link". Replace the body with:
   `<h2>Your CHEW code</h2><p>Enter this code on the CHEW site:</p><h1>{{ .Token }}</h1><p>It expires soon. If you did not ask for it, ignore this email.</p>`
   (New users get "Confirm signup", returning users get "Magic Link". Both need the {{ .Token }} line.)
2. **Email sending limit** — Supabase's built-in email is for testing only (very few emails per hour). Before launch: Project Settings → Authentication → SMTP Settings → add a free SMTP service (for example Resend or Brevo).
3. **Google sign-in**
   - Google Cloud Console → APIs & Services → Credentials → Create credentials → OAuth client ID → Web application.
   - Authorized redirect URI: `https://dryekzswjtcimnkpcasw.supabase.co/auth/v1/callback`
   - Authorized JavaScript origin: your Vercel site URL (after deploying).
   - Copy the Client ID and Client Secret into Supabase → Authentication → Providers → Google → Enable → Save.
4. **Site URL and redirects** — Authentication → URL Configuration:
   - Site URL: your Vercel URL, for example https://your-project.vercel.app
   - Redirect URLs: add https://your-project.vercel.app/** (add your custom domain too if you use one).

## Part 2: Deploy to Vercel (no GitHub needed)
You need a computer with Node.js (https://nodejs.org). On a phone the only realistic route is GitHub (see below).
1. Unzip chew-site.zip.
2. Open a terminal in the chew-site folder and run: `npx vercel`
3. Log in when your browser opens, accept the defaults (framework: Other, no build command, output directory: `.`).
4. Run `npx vercel --prod` to publish. Vercel prints your live URL.
5. Do Part 1 steps 3 and 4 with that URL.

Option B (GitHub): upload the folder contents to a GitHub repository, then at vercel.com/new import it and press Deploy.

## Part 3: First login and admin
Sign in once with **jameshen7777@gmail.com** (email code or Google). That email is pre-registered as the owner, so /admin.html works for you. Nobody else is an admin.

## Weekly winners
Weeks run Monday 00:00 to Sunday 23:59:59 UTC. The top 3 accepted scores are shown on leaderboard.html (this week and previous winners) and in admin.html. Flagged scores wait for your review and do not appear on the board until accepted. Nothing is paid out automatically.

## Files
- site.css, app.js (login gate, Supabase client), js/game.js, js/home.js, js/leaderboard.js, js/profile.js, js/admin.js
- video and images are in the same folder; vercel.json
