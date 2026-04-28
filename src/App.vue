<script setup>
import { Activity, AlertTriangle, Gauge, Radio, RefreshCw } from "lucide-vue-next";
import { onMounted, ref } from "vue";

const dashboard = ref(null);
const loading = ref(true);
const error = ref(null);

async function loadDashboard() {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch("/api/dashboard");
    if (!response.ok) throw new Error(await response.text());
    dashboard.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(loadDashboard);

function formatNumber(value) {
  if (value === null || value === undefined) return "n/a";
  return new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);
}

function formatDate(value) {
  if (!value) return "n/a";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}
</script>

<template>
  <main class="shell">
    <header class="topbar">
      <div>
        <p class="eyebrow">ThingsLog partner portal</p>
        <h1>Monitoring dashboard</h1>
      </div>
      <button class="icon-button" title="Refresh dashboard" @click="loadDashboard">
        <RefreshCw :size="18" />
      </button>
    </header>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading && !dashboard" class="loading">Loading dashboard...</div>

    <template v-if="dashboard">
      <section class="device-band">
        <div>
          <p class="eyebrow">Device</p>
          <h2>{{ dashboard.device.name || dashboard.device.deviceNumber }}</h2>
          <p>{{ dashboard.device.site || "Customer site" }} · ThingsLog device</p>
        </div>
        <div class="status-pill">Last seen {{ formatDate(dashboard.summary.lastSeen) }}</div>
      </section>

      <section class="metrics">
        <article class="metric">
          <div class="metric-icon"><Gauge /></div>
          <div><p>Latest counter</p><strong>{{ formatNumber(dashboard.summary.latestCounter) }}</strong></div>
        </article>
        <article class="metric">
          <div class="metric-icon"><Activity /></div>
          <div><p>Period consumption</p><strong>{{ formatNumber(dashboard.summary.periodConsumption) }}</strong></div>
        </article>
        <article class="metric warn">
          <div class="metric-icon"><AlertTriangle /></div>
          <div><p>Active alarms</p><strong>{{ dashboard.summary.activeAlarms }}</strong></div>
        </article>
        <article class="metric">
          <div class="metric-icon"><Radio /></div>
          <div><p>Connection</p><strong>Online</strong></div>
        </article>
      </section>

      <section class="content">
        <div class="panel">
          <div class="panel-heading">
            <h3>Counter history</h3>
            <span>{{ dashboard.counters.length }} points</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Date</th><th>Counter</th></tr></thead>
              <tbody>
                <tr v-for="row in dashboard.counters" :key="row.date">
                  <td>{{ formatDate(row.date) }}</td>
                  <td>{{ formatNumber(row.counter) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="panel">
          <div class="panel-heading">
            <h3>Alarms</h3>
            <span>{{ dashboard.alarms.length }}</span>
          </div>
          <div class="alarm-list">
            <article v-for="alarm in dashboard.alarms" :key="`${alarm.alarmType}-${alarm.date}`" class="alarm">
              <div>
                <strong>{{ alarm.description || alarm.alarmType }}</strong>
                <p>{{ alarm.deviceNumber }} · {{ formatDate(alarm.date) }}</p>
              </div>
              <AlertTriangle :size="18" />
            </article>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>

