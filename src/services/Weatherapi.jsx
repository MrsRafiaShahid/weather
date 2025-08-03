import axios from "axios";
import { DateTime } from "luxon";

const API_KEY = import.meta.env.VITE_API_KEY;
console.log("API Key",API_KEY);

const BASE_URL = import.meta.env.VITE_BASE_URL ;
console.log("BASE URL",BASE_URL);

const getWeatherData = (infoType, searchParams) => {
  const url = `${BASE_URL}${infoType}?${new URLSearchParams({
    ...searchParams,
    appid: API_KEY,
  }).toString()}`;

  return axios.get(url);
};
export { getWeatherData };
// Add this function in weatherapi.jsx
const getGeoData = async (searchParams) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?${new URLSearchParams({
    q: searchParams,
    limit: 5,
    appid: API_KEY,
  })}`;

  const response = await axios.get(url);
  return response.data.map((item) => ({
    name: item.name,
    state: item.state,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  }));
};
export { getGeoData };
const iconURL = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;
const formatTimeLocal = (
  secs,
  offset,
  format = "cccc, dd LLL yyyy' | Local Time: 'hh:mm a"
) =>  {
  const hours = offset / 3600;
  const zone = `UTC${hours >= 0 ? '+' : ''}${hours}`;
  return DateTime.fromSeconds(secs).setZone(zone).toFormat(format);
}

const currentWeather = (data) => {

  console.log(data);
  const {
    coord: { lat, lon } = {},
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    timezone,
    weather,
    wind: { speed },
    visibility,
    clouds:{all},
  } = data;
  const { main: details, icon } = weather[0] || {};
  const formatLocalTime = formatTimeLocal(dt, timezone);

  return {
    temp,
    feels_like,
    temp_max,
    temp_min,
    humidity,
    name,
    country,
    sunrise,
    formattedSunrise: formatTimeLocal(sunrise, timezone, "hh:mm a"),
    sunset,
    formattedSunset:formatTimeLocal(sunset, timezone, "hh:mm a"),
    visibility,
    all,
    speed,
    details,
    icon: iconURL(icon),
    formatLocalTime,
    dt,
    timezone,
    lat,
    lon,
  };
};
const formatForecastData = (secs, offset, data) => {
  console.log(secs);
  //hourly
  const hourly = data
    .filter((f) => f.dt > secs)
    .slice(0, 5)
    .map((f) => ({
      temp: f.main.temp,
      title: formatTimeLocal(f.dt, offset, "hh:mm a"),
      icon: iconURL(f.weather[0].icon),
      details: f.weather[0].main,
      date: f.dt_txt,
      humidity: f.main.humidity,
      temp_min: f.main.temp_min,
    }));

  console.log(hourly);
  //daily
  const daily = data
    .filter((d) => d.dt_txt.slice(-8) === "00:00:00")
    .map((d) => ({
      temp: d.main.temp,
      title: formatTimeLocal(d.dt, offset, "hh:mm a"),
      icon: iconURL(d.weather[0].icon),
      details: d.weather[0].main,
      date: d.dt_txt,
      humidity: d.main.humidity,
      temp_min: d.main.temp_min,
    }));
  return { hourly, daily };
};

const getFormatData = async (searchParams) => {
  const weatherData = await getWeatherData("weather", searchParams);
  const formatWeatherData = currentWeather(weatherData.data);
  const { dt, timezone, lat, lon } = formatWeatherData;
  const forecastResponse = await getWeatherData("forecast", {
    lat,
    lon,
    units: searchParams.units,
  });
  const forecastData = formatForecastData(
    dt,
    timezone,
    forecastResponse.data.list
  );

  return { ...formatWeatherData, ...forecastData };
};
export default getFormatData;
