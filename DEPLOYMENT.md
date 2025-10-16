Production URL
https://ai-antonios-intelligence-5ia9ygi3a.vercel.app

Notes
- This site is deployed to Vercel. The production URL above is the latest deployment created via the Vercel CLI.
- If you want to rebuild Tailwind locally, install Node.js and run the build commands documented below.

Local Tailwind build (optional)
1. Install Node.js (https://nodejs.org/) if you don't have it.
2. From the project root, install dev dependencies:

   npm install -D tailwindcss postcss autoprefixer

3. Build the CSS:

   npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify

CI / Auto-deploy notes
- The repository includes a GitHub Actions workflow which triggers on push to `main` and calls the Vercel CLI to deploy.
- For the action to work, create a repository secret named `VERCEL_TOKEN` with a Vercel personal token and (optionally) `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` if you want to target a specific project.

Troubleshooting
- If camera access doesn't start on the deployed site, ensure the site is loaded over HTTPS and that you have allowed camera permissions for the site in your browser.
- If `dist/output.css` is missing, run the Tailwind build step above or commit a built `dist/output.css` to the repo.
