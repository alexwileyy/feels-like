// Open-Meteo fetch + browser geolocation, with canned fallback data so the
// demo never dies on stage.

export interface HourForecast {
  time: Date;
  feelsLike: number;
  precipProb: number;
  weatherCode: number;
  windKmh: number;
}

export interface Weather {
  feelsLike: number;
  actual: number;
  weatherCode: number;
  windKmh: number;
  isRaining: boolean;
  sunrise: Date;
  sunset: Date;
  hourly: HourForecast[];
  live: boolean;
}

const LONDON = { latitude: 51.5072, longitude: -0.1276 };

function geolocate(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(LONDON);
      return;
    }
    const fallback = setTimeout(() => resolve(LONDON), 5000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(fallback);
        resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      () => {
        clearTimeout(fallback);
        resolve(LONDON);
      },
      { timeout: 4500 }
    );
  });
}

export async function fetchWeather(): Promise<Weather> {
  try {
    const { latitude, longitude } = await geolocate();
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m` +
      `&hourly=apparent_temperature,precipitation_probability,weather_code,wind_speed_10m` +
      `&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const data = await res.json();

    const hourly: HourForecast[] = data.hourly.time.map((t: string, i: number) => ({
      time: new Date(t),
      feelsLike: data.hourly.apparent_temperature[i],
      precipProb: data.hourly.precipitation_probability[i] ?? 0,
      weatherCode: data.hourly.weather_code[i],
      windKmh: data.hourly.wind_speed_10m[i],
    }));

    return {
      feelsLike: data.current.apparent_temperature,
      actual: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      windKmh: data.current.wind_speed_10m,
      isRaining: data.current.precipitation > 0,
      sunrise: new Date(data.daily.sunrise[0]),
      sunset: new Date(data.daily.sunset[0]),
      hourly,
      live: true,
    };
  } catch {
    return cannedWeather();
  }
}

// A pleasant-but-changeable British day; also the on-stage safety net.
export function cannedWeather(): Weather {
  const today = new Date();
  const at = (h: number) => {
    const d = new Date(today);
    d.setHours(h, 0, 0, 0);
    return d;
  };
  const curve = [11, 10, 10, 9, 9, 10, 11, 12, 14, 15, 17, 18, 19, 19, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11];
  return {
    feelsLike: 17,
    actual: 19,
    weatherCode: 2,
    windKmh: 12,
    isRaining: false,
    sunrise: at(5),
    sunset: at(21),
    hourly: curve.map((feelsLike, h) => ({
      time: at(h),
      feelsLike,
      precipProb: h >= 16 && h <= 18 ? 60 : 10,
      weatherCode: h >= 16 && h <= 18 ? 61 : 2,
      windKmh: 12,
    })),
    live: false,
  };
}
