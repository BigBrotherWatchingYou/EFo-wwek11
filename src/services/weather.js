const API = 'https://api.openweathermap.org/data/2.5/weather';

export async function getWeatherByCity(city) {
  const key = import.meta.env.VITE_OPENWEATHER_KEY;
  if (!key) throw new Error('Missing VITE_OPENWEATHER_KEY');
  const url = `${API}?q=${encodeURIComponent(city)}&appid=${key}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getWeatherByCoords(lat, lon) {
  const key = import.meta.env.VITE_OPENWEATHER_KEY;
  if (!key) throw new Error('Missing VITE_OPENWEATHER_KEY');
  const url = `${API}?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}
