# Frontend (React + Vite)

## Quick start
- Install deps: `npm install`
- Dev server: `npm run dev` (http://localhost:5176)
- Backend proxy: requests to `/api` go to `http://localhost:8082`

## Env toggles
- `VITE_USE_MOCK`: `true` to use local mock data (no network)
- `VITE_API_BASE`: absolute API base for production (e.g. `https://example.com`); leave empty in dev to rely on proxy

Examples:
```
# .env.development
VITE_API_BASE=
VITE_USE_MOCK=false

# .env.production - GitHub Pages or remote API
VITE_API_BASE=https://your-host-or-lan-ip
VITE_USE_MOCK=false
```

## PWA
- Build: `npm run build`; Preview: `npm run preview`
- Place icons at `public/icons/icon-192.png` and `public/icons/icon-512.png`
- Service Worker auto-updates (via vite-plugin-pwa)

## Notes
- In mock mode: filters work client-side, images fallback to `public/placeholder.svg`
- In backend mode: ensure API is reachable by the browser (CORS/proxy)
