# e-ORB Marine — Electronic Oil Record Book (Training & Practice)

A training/practice Electronic Oil Record Book PWA for Marine Engineers, built with reference
to MARPOL Annex I and IMO Resolution MEPC.312(74). This is a **training and practice tool**,
not an approved statutory electronic record book.

## What's in this zip
- `index.html` — the entire app (offline-first, single file)
- `manifest.json` — PWA manifest (installable "Add to Home Screen")
- `sw.js` — service worker for offline caching
- `icons/` — app icons and splash background

All paths are relative, so this works whether it's served from the root of a GitHub Pages
site (`https://<user>.github.io/`) or from a project subpath
(`https://<user>.github.io/<repo>/`).

## Testing with GitHub Pages
1. Create a new GitHub repository (public, for free Pages hosting).
2. Upload all the files in this zip to the repository root, keeping the `icons/` folder intact.
3. Go to **Settings → Pages**, set Source to the `main` branch, root folder, and save.
4. GitHub will publish it at `https://<your-username>.github.io/<repo-name>/` after a minute
   or two.
5. Open that link on a phone and use "Add to Home Screen" (Safari/Chrome) to install it like
   an app.

## Notes
- Data is stored locally in the browser (per device). There's no backend and no account —
  nothing is uploaded anywhere.
- The service worker caches the app shell so it keeps working offline after the first load.
- If you update the files later and push again, bump the `CACHE_NAME` value in `sw.js` (e.g.
  `eorb-marine-v23`) so returning users actually get the new version instead of a cached copy.
