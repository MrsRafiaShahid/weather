import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Buttons = ({ setQuery }) => {
  // Initial cities
  const initialCities = [
    { id: 1, name: "London" },
    { id: 2, name: "Lahore" },
    { id: 3, name: "Istanbul" },
    { id: 4, name: "Tokyo" },
    { id: 5, name: "Sydney" },
    { id: 6, name: "Paris" },
    { id: 7, name: "Toronto" },
  ];

  // Load cities from localStorage or use initial
  const [cities, setCities] = useState(() => {
    const savedCities = localStorage.getItem("userCities");
    return savedCities ? JSON.parse(savedCities) : initialCities;
  });

  const [newCity, setNewCity] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Save to localStorage when cities change
  useEffect(() => {
    localStorage.setItem("userCities", JSON.stringify(cities));
  }, [cities]);

  const handleCityChange = (city) => {
    setQuery({ q: city.name });
  };

  const handleAddCity = () => {
    if (newCity.trim() !== "") {
      const cityExists = cities.some(
        (city) => city.name.toLowerCase() === newCity.trim().toLowerCase()
      );

      if (!cityExists) {
        const newCityObj = {
          id: Date.now(), // Unique ID
          name: newCity.trim(),
        };

        setCities((prev) => [...prev, newCityObj]);
        setNewCity("");
        setShowAddForm(false);
      } else {
        alert("City already exists!");
      }
    }
  };

  const handleRemoveCity = (id, e) => {
    e.stopPropagation();
    setCities((prev) => prev.filter((city) => city.id !== id));
  };

  return (
    <div className="flex overflow-x-auto items-center justify-start gap-2 my-4 py-2 w-full scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
      {cities.map((city) => (
        <div key={city.id} className="relative group">
          <button
            className="text-sm md:text-lg font-medium hover:bg-cyan-400/20 px-3 py-2 rounded-md transition ease-in"
            onClick={() => handleCityChange(city)}
          >
            {city.name}
          </button>
          {/* Remove button for user-added cities */}
          {city.id > 7 && (
            <button
              onClick={(e) => handleRemoveCity(city.id, e)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              x
            </button>
          )}
        </div>
      ))}

      {/* Add City Button */}
      {!showAddForm ? (
        <button
          className="text-lg font-medium border-2 border-gray-500 rounded-full hover:border-blue-600 hover:shadow-gray-500 hover:shadow-xs text-white px-2 py-1 transition ease-in flex items-center justify-center"
          onClick={() => setShowAddForm(true)}
        >
          <span className="mr-1 ml-1">+</span>
        </button>
      ) : (
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Enter city"
            className="text-sm md:text-lg px-2 md:px-3 py-1 md:py-2 rounded-md border border-gray-300"
            autoFocus
          />
          <button
            className="text-sm md:text-lg font-medium  bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md"
            onClick={handleAddCity}
          >
            Add
          </button>
          <button
            className="text-lg font-medium bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

Buttons.propTypes = {
  setQuery: PropTypes.func.isRequired,
};

export default Buttons;
