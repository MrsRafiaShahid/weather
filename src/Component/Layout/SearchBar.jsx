import { useEffect, useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";
import PropTypes from "prop-types";
import { getGeoData } from "../../services/Weatherapi";

export default function SearchBar({
  setQuery,
  setUnits,
  loading,
  error,
  setLoading,
  setError,
}) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    // If there is no text, clear suggestions
    if (!city.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const data = await getGeoData(city);
        setSuggestions(data);
      } catch (err) {
        setError("Failed to fetch suggestions", err);
      } finally {
        setLoading(false);
      }
    };
    // Debounce the API call by 500ms
    const timer = setTimeout(fetchSuggestions, 500);

    return () => clearTimeout(timer);
  }, [city, setError, setLoading]);
  const handleSearchChange = () => {
    if (city !== "") setQuery({ q: city });
  };
  // Handle clicking a suggestion from the list
  const handleSuggestionClick = (suggestion) => {
    // Format the city name nicely: "City, State, Country" (if state available)
    const cityName = `${suggestion.name}${
      suggestion.state ? `, ${suggestion.state}` : ""
    }, ${suggestion.country}`;
    setCity(cityName);
    setSuggestions([]);
    setQuery({ lat: suggestion.lat, lon: suggestion.lon });
  };
  const handleLocationChange = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setQuery({ lat: latitude, lon: longitude });
        },
        () => {
          alert("Unable to retrieve your current location");
        }
      );
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row w-[15rem] md:w-full items-center justify-center my-6">
        <div className=" flex items-center justify-center space-x-4 w-full md:w-3/6 ">
          <input
            type="text"
            className="search text-gray-300 text-xl w-full shadow-xl font-light rounded-2xl rounded-b-none border-b-2 border-b-violet-200 focus:outline-none p-2 capitalize placeholder:lowercase"
            placeholder="Search.."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <BiSearch
            size={25}

            className="cursor:pointer hover:scale-150 transition ease-in-out"
            onClick={handleSearchChange}
          />
          <BiCurrentLocation
            size={25}
            className="cursor:pointer hover:scale-150 transition ease-in-out"
            onClick={handleLocationChange}
          />
        </div>

        <div className="flex mt-4 md:mt-0 flex-row w-1/5 items-center justify-center">
          <button
            className="md:text-2xl text-xl font-medium transition ease-out hover:scale-150"
            onClick={() => setUnits("metric")}
          >
            °C
          </button>
          <p className="md:text-2xl text-xl font-medium mx-1">|</p>
          <button
            className="md:text-2xl text-xl font-medium transition ease-out hover:scale-150"
            onClick={() => setUnits("imperial")}
          >
            °F
          </button>
        </div>
      </div>
      <div className="flex flex-col relative  z-10 justify-self-start m-auto items-start">
        {/* Autocomplete suggestions */}
        {loading && (
          <div className="mt-2 text-gray-400">Loading suggestions...</div>
        )}
        {error && <div className="mt-2 text-red-500">{error}</div>}
        {suggestions.length > 0 && (
          <ul className="w-1/4 absolute top-full left-4 z-50  mt-1 shadow-lg rounded-b-2xl ">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:text-amber-200 hover:text-xl transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
                {suggestion.state ? `, ${suggestion.state}` : ""},
                {suggestion.country}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

SearchBar.propTypes = {
  setQuery: PropTypes.func.isRequired,
  setUnits: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  setLoading: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};
