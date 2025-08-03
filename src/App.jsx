import Buttons from "./Component/Layout/Buttons";
import SearchBar from "./Component/Layout/SearchBar";
import TimeLocation from "./Component/Layout/TimeLocation";
import TempDetails from "./Component/Layout/TempDetails";
import Forecast from "./Component/Layout/Forecast";

import { ToastContainer, toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import getFormatData from "./services/Weatherapi";
import Loading from "./Component/Layout/Loading";

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
const App = () => {
  const [query, setQuery] = useState({ q: "lahore" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getWeather = useCallback(async () => {
    // Clear any previous toasts
    const cityName = query.q ? query.q : "current.location";
    toast.info(`Fetching Weather data for ${capitalizeFirstLetter(cityName)}`);
    // fetch weather data
    await getFormatData({ ...query, units }).then((data) => {
      toast.success(`Fetching weather data for ${data.name}, ${data.country}`);
      setWeather(data);
    });
  }, [query, units]);

  useEffect(() => {
    getWeather();
  }, [query, units, getWeather]);

  if (!weather) return <Loading />;
  const formatBackground = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const isDaytime =
      currentTime >= weather.sunrise && currentTime < weather.sunset;
    const weatherCondition = weather.details.toLowerCase();

    // Daytime backgrounds
    if (isDaytime) {
      switch (weatherCondition) {
        case "clear":
          return "from-cyan-300 to-blue-800"; // Sunny day
        case "clouds":
          return "from-gray-300 to-gray-600"; // Cloudy day
        case "rain":
        case "drizzle":
          return "from-gray-400 to-blue-900"; // Rainy day
        case "thunderstorm":
          return "from-purple-700 to-gray-900"; // Stormy day
        case "snow":
          return "from-blue-100 to-blue-400"; // Snowy day
        default:
          return "from-cyan-300 to-blue-800"; // Default daytime
      }
    }
    // Nighttime backgrounds
    else {
      switch (weatherCondition) {
        case "clear":
          return "from-gray-800 to-black"; // Clear night
        case "clouds":
          return "from-gray-700 to-gray-900"; // Cloudy night
        case "rain":
        case "drizzle":
          return "from-gray-800 to-blue-950"; // Rainy night
        case "thunderstorm":
          return "from-purple-900 to-black"; // Stormy night
        case "snow":
          return "from-blue-800 to-gray-900"; // Snowy night
        default:
          return "from-gray-700 to-black"; // Default nighttime
      }
    }
  };
  return (
    <>
      <div
        className={`mx-auto max-w-screen-lg md:max-w-screen w-full py-5 px-4 md:px-32 bg-gradient-to-br ${formatBackground()}`}
      >
        <Buttons setQuery={setQuery} />
        <SearchBar
          setQuery={setQuery}
          setUnits={setUnits}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
        />
        {weather && (
          <>
            <TimeLocation weather={weather} />
            <TempDetails weather={weather} units={units} />
            <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900 py-5 px-4 md:px-32">
              <Forecast title="3 hour Forcast" data={weather.hourly} />
              <Forecast title="Daily Forecast" data={weather.daily} />
            </div>
          </>
        )}
        <ToastContainer
          autoClose={2500}
          hideProgressBar={true}
          theme="colored"
        />
      </div>
    </>
  );
};

export default App;
