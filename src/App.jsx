import Buttons from "./Component/Layout/Buttons";
import SearchBar from "./Component/Layout/SearchBar";
import TimeLocation from "./Component/Layout/TimeLocation";
import TempDetails from "./Component/Layout/TempDetails";
import Forecast from "./Component/Layout/Forecast";

import { ToastContainer, toast } from "react-toastify";
import { useCallback, useEffect, useState } from "react";
import getFormatData from "./services/weatherapi";

import "react-toastify/dist/ReactToastify.css";

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

  if (!weather) return <div>Loading...</div>;
  const formatBackground = () => {
    const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
    const sunriseTime = weather.sunrise;
    const sunsetTime = weather.sunset;

    return currentTime >= sunriseTime && currentTime < sunsetTime
      ? "from-cyan-300 to-blue-800"
      : "from-gray-700 to-black";
  };
  return (
    <>
      <div
        className={`mx-auto max-w-screen max-h-screen-lg py-5 px-32 bg-gradient-to-br ${formatBackground()}`}
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
            <Forecast title="3 hour Forcast" data={weather.hourly} />
            <Forecast title="Daily Forecast" data={weather.daily} />
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
