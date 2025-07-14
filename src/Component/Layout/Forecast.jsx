import PropTypes from 'prop-types';
const Forecast = ({ title, data }) => {
  return (
    <>
      <div className="flex items-center justify-start mt-6" >
        <p className="font-medium uppercase">{title}</p>
      </div>
      <hr className="my-2" />
      <div className="grid w-[15rem] md:w-full grid-cols-2 md:grid-cols-5 gap-10 items-center justify-between">
        {data.map((item, index) => {
          return (
            <div key={index} className="flex flex-col items-center space-x-2 border border-gray-300 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow hover:shadow-gray-500 duration-300">
              <span className="text-sm font-light">
                {item.date.slice(0, 10)}
              </span>
              <p className="font-light text-sm">{item.title}</p>
              <img src={item.icon} alt="weather-icon" className=" w-15 my-2" />
              <span className="font-bold">{item.details}</span>
              <span className="text-sm font-mono">{item.humidity}</span>
              <span className="text-sm font-medium">
                {item.temp.toFixed()}°C
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

Forecast.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      details: PropTypes.string.isRequired,
      humidity: PropTypes.number.isRequired,
      temp: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Forecast;
