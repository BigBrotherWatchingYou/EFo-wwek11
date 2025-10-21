<script setup>
import { ref } from 'vue'
import { getWeatherByCity, getWeatherByCoords } from './services/weather'

const city = ref('Melbourne, AU')
const loading = ref(false)
const error = ref('')
const data = ref(null)

async function fetchCity() {
  error.value = ''; data.value = null; loading.value = true
  try { data.value = await getWeatherByCity(city.value) }
  catch (e) { error.value = e.message }
  finally { loading.value = false }
}

async function fetchMyLocation() {
  error.value = ''; data.value = null; loading.value = true
  try {
    const pos = await new Promise((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 10000 })
    )
    const { latitude, longitude } = pos.coords
    data.value = await getWeatherByCoords(latitude, longitude)
  } catch (e) { error.value = e.message || 'Location error' }
  finally { loading.value = false }
}
</script>

<template>
  <div style="max-width:720px;margin:2rem auto;padding:1rem;">
    <h1>GetWeather (Vue + Vite)</h1>

    <div style="display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;">
      <input v-model="city" placeholder="Enter city, e.g. Sydney, AU" />
      <button @click="fetchCity" :disabled="loading">Search</button>
      <button @click="fetchMyLocation" :disabled="loading">Use my location</button>
    </div>

    <p v-if="loading">Loading…</p>
    <p v-if="error" style="color:crimson;">{{ error }}</p>

    <div v-if="data" style="margin-top:1rem;border:1px solid #ddd;border-radius:12px;padding:1rem;">
      <h2 style="margin:0 0 .5rem 0;">
        {{ data.name }}, {{ data.sys?.country }}
      </h2>
      <p style="font-size:2rem;margin:.25rem 0;">
        {{ Math.round(data.main?.temp) }}°C
      </p>
      <p style="margin:.25rem 0;">
        Feels like {{ Math.round(data.main?.feels_like) }}°C •
        Humidity {{ data.main?.humidity }}% • Wind {{ Math.round(data.wind?.speed) }} m/s
      </p>
      <p style="margin:.25rem 0; text-transform:capitalize;">
        {{ data.weather?.[0]?.description }}
      </p>
      <p style="margin:.25rem 0; font-size:.9rem; color:#666;">
        Min {{ Math.round(data.main?.temp_min) }}°C • Max {{ Math.round(data.main?.temp_max) }}°C
      </p>
    </div>
  </div>
</template>

<style>
input{ padding:.5rem .75rem; border:1px solid #ccc; border-radius:8px; }
button{ padding:.5rem .75rem; border:1px solid #ccc; border-radius:8px; background:#f7f7f7; cursor:pointer; }
button:disabled{ opacity:.6; cursor:not-allowed; }
</style>
