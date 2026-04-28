<p align="center">
  <img src="assets/thingslog-logo.png" alt="ThingsLog" width="260" />
</p>

# ThingsLog Vue Monitoring Template

![Vue 3](https://img.shields.io/badge/Vue%203-ThingsLog-087c89?style=for-the-badge) ![Vite](https://img.shields.io/badge/Vite-ThingsLog-087c89?style=for-the-badge) ![Express](https://img.shields.io/badge/Express-ThingsLog-087c89?style=for-the-badge) ![Mock Mode](https://img.shields.io/badge/Mock%20Mode-ThingsLog-087c89?style=for-the-badge) ![Partner Portal](https://img.shields.io/badge/Partner%20Portal-ThingsLog-087c89?style=for-the-badge)

A Vue 3 + Vite dashboard template for partner teams that prefer Vue and still need secure ThingsLog API access.

> Build a monitoring business faster: start from a working ThingsLog template, add your customer workflows, and connect real data when you are ready.

## Why This Exists

ThingsLog provides remote IoT monitoring and automation for critical infrastructure: smart metering, water utilities, energy, gas, pressure, tank level, agriculture, buildings, and industrial operations. These repositories help partners move from API access to a sellable monitoring portal or integration product without starting from a blank project.

## What You Get

- Vue monitoring dashboard
- Device and site summary
- Counter history table
- Alarm panel
- Local backend proxy for ThingsLog REST calls

## Best Fit

- **Stack:** Vue 3, Vite, Express backend proxy, dashboard UI
- **Use when:** You want a lightweight Vue customer portal with backend-only ThingsLog credentials.

## Start in 5 Minutes

```bash
git clone https://github.com/ThingsLog/thingslog-vue-monitoring-template.git
cd thingslog-vue-monitoring-template
cp .env.example .env
npm install
npm run dev
```

## Generate Your ThingsLog Token

You need a ThingsLog API token before connecting real devices. For a quick test, use direct login and copy the bearer token from the `Authorization` response header:

```bash
curl -i -X POST "https://iot.thingslog.com:4443/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_USERNAME","password":"YOUR_PASSWORD"}'
```

For partner backends and production integrations, generate a long-term API token:

```bash
KEYCLOAK_TOKEN=$(curl -s -X POST "https://iot.thingslog.com/keycloak/realms/thingslog/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=thingslog-admin" \
  -d "username=YOUR_USERNAME" \
  -d "password=YOUR_PASSWORD" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>console.log(JSON.parse(s).access_token))')

curl -i -X POST "https://iot.thingslog.com:4443/api/api-token?expirationTimeHours=720&name=partner-demo-token" \
  -H "Authorization: Bearer $KEYCLOAK_TOKEN"
```

Copy the generated API token into `THINGSLOG_TOKEN`, set `THINGSLOG_MOCK=false`, choose a real `THINGSLOG_DEVICE_NUMBER`, and start the app. Now you can rock and roll with live ThingsLog data.

## Connect Real ThingsLog Data

Mock mode is enabled by default so the project starts without credentials. To connect real devices, set these values in `.env` or the framework-specific env file:

```bash
THINGSLOG_MOCK=false
THINGSLOG_BASE_URL=https://iot.thingslog.com:4443
THINGSLOG_TOKEN=your_api_token
THINGSLOG_DEVICE_NUMBER=00000109
THINGSLOG_SENSOR_INDEX=0
THINGSLOG_FROM_DATE=2026-02-01T00:00:00+02:00
THINGSLOG_TO_DATE=2026-02-02T00:00:00+02:00
```

Security rule: ThingsLog API tokens stay server-side. Do not expose them through browser variables such as `VITE_*`, `NEXT_PUBLIC_*`, or mobile app bundles.

## Start with Codex

Open this repo in Codex and paste:

```text
Use this repository to build a partner monitoring app for water, energy, gas, pressure, level, or industrial telemetry. Keep ThingsLog credentials server-side and preserve mock mode.

First inspect README.md, AGENTS.md, CLAUDE.md, and the existing ThingsLog client code.
Then propose the smallest useful first version for a partner-facing monitoring portal.
After implementing, run the available build or check commands and summarize how to start it.
```

## Start with Claude

Open this repo in Claude and paste:

```text
You are helping build a ThingsLog partner application.
Read README.md, AGENTS.md, and CLAUDE.md before making changes.
Use ThingsLog concepts: customer, site, device, sensor, counter, measurement, alarm.
Keep ThingsLog API tokens server-side.
Preserve mock mode so the app can be demonstrated without credentials.
Build the next useful partner feature and explain how to run it locally.
```

## Key Files

- `src/App.vue`
- `server/thingslog-client.js`
- `AGENTS.md`
- `CLAUDE.md`

## Partner Product Ideas

- Customer monitoring portal for utilities, buildings, agriculture, or industrial sites
- Alarm and notification center for missed transmission, leaks, battery, or threshold events
- Scheduled reports for municipalities, facility managers, and enterprise customers
- ERP, billing, GIS, BI, SCADA, or maintenance-system integration
- White-label monitoring business where partners operate ThingsLog devices and sell recurring services

## Template Family

This repository is part of the ThingsLog partner template family. For stack selection, copy-paste startup commands, Codex prompts, Claude prompts, and security-review prompts, start here:

- https://github.com/ThingsLog/thingslog-partner-ai-examples

## ThingsLog Links

- Website: https://thingslog.com
- REST Swagger UI: https://iot.thingslog.com:4443/swagger-ui.html
- Support: https://support.thingslog.com

## License

License terms to be selected by ThingsLog before public release.
