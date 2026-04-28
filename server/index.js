import "dotenv/config";
import express from "express";
import { mockDashboard } from "./mock-data.js";
import { ThingsLogClient } from "./thingslog-client.js";

const app = express();
const port = Number(process.env.PORT || 8791);
const mockMode = process.env.THINGSLOG_MOCK !== "false";
const client = new ThingsLogClient({
  baseUrl: process.env.THINGSLOG_BASE_URL || "https://iot.thingslog.com:4443",
  token: process.env.THINGSLOG_TOKEN
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mockMode });
});

app.get("/api/dashboard", async (_req, res, next) => {
  try {
    if (mockMode) {
      res.json(mockDashboard);
      return;
    }

    const deviceNumber = requiredEnv("THINGSLOG_DEVICE_NUMBER");
    const sensorIndex = process.env.THINGSLOG_SENSOR_INDEX || "0";
    const fromDate = requiredEnv("THINGSLOG_FROM_DATE");
    const toDate = requiredEnv("THINGSLOG_TO_DATE");
    const [device, counters, alarms] = await Promise.all([
      client.getDevice(deviceNumber),
      client.getCounters({ deviceNumber, sensorIndex, fromDate, toDate }),
      client.getAlarms({ deviceNumber, fromDate, toDate })
    ]);

    res.json({ device, counters, alarms, summary: summarize(deviceNumber, counters, alarms) });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error.message });
});

app.listen(port, () => {
  console.log(`ThingsLog Vue backend listening on http://localhost:${port}`);
});

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function summarize(deviceNumber, counters, alarms) {
  const first = counters.at(0)?.counter ?? null;
  const last = counters.at(-1)?.counter ?? null;
  return {
    deviceNumber,
    latestCounter: last,
    periodConsumption: first !== null && last !== null ? last - first : null,
    activeAlarms: alarms.length,
    lastSeen: counters.at(-1)?.date ?? null
  };
}

