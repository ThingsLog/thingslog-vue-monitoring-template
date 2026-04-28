# ThingsLog Vue Monitoring Template

Vue 3 monitoring portal template for ThingsLog partners.

Use this stack when your team prefers Vue for customer portals while keeping ThingsLog API tokens in a backend proxy.

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev
```

Open the frontend URL printed by Vite. The backend proxy runs on `http://localhost:8791`.

Mock mode is enabled by default. To use real ThingsLog data:

```bash
THINGSLOG_MOCK=false
THINGSLOG_BASE_URL=https://iot.thingslog.com:4443
THINGSLOG_TOKEN=your_api_token
THINGSLOG_DEVICE_NUMBER=00000109
```

## Security

- Keep `THINGSLOG_TOKEN` in the backend process.
- Do not expose tokens through `VITE_*` variables.
- Add partner login and tenant checks before production use.

