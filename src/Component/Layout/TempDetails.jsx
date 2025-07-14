import { FaThermometerEmpty, FaWind } from "react-icons/fa";
import {
  BsSunriseFill,
  BsSunsetFill,
  BsDropletHalf,
  BsClouds,
} from "react-icons/bs";
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdVisibility,
} from "react-icons/md";
import PropTypes from 'prop-types';

const TempDetails = ({
  weather: {
    details,
    temp,
    icon,
    temp_max,
    temp_min,
    formattedSunrise,  // Use formatted time
    formattedSunset,   // Use formatted time
    speed,
    feels_like,
    humidity,
    all,
    visibility,
  },
  units
}) => {
  const Vdetails = [
    {
      id: 1,
      Icon: FaThermometerEmpty,
      title: "Real Feal Like",
      value:`${feels_like.toFixed()}°`,
    },
    {
      id: 2,
      Icon: FaWind,
      title: "Wind speed",
      value: `${speed.toFixed()} ${units === "metric" ? 'km/h' : 'm/s'}`,
    },
    {
      id: 3,
      Icon: BsDropletHalf,
      title: "Humidity",
      value: `${humidity}%`,
    },
    {
      id: 4,
      Icon: BsClouds,
      title: "Clouds",
      value: `${all}`,
    },
    {
      id: 5,
      Icon: MdVisibility,
      title: "Visiblity",
      value: `${visibility}`,
    },
  ];
  const Hdetails = [
    {
      id: 1,
      Icon: BsSunriseFill,
      title: "Sunrise",
      value:formattedSunrise,
    },
    {
      id: 2,
      Icon: BsSunsetFill,
      title: "Sun Set",
      value: formattedSunset,
    },
    {
      id: 3,
      Icon: MdKeyboardArrowUp,
      title: "High",
      value: `${temp_max.toFixed()} °`,
    },
    {
      id: 4,
      Icon: MdKeyboardArrowDown,
      title: "Low",
      value:  `${temp_min.toFixed()} °`,
    },
   
 
  ];
  return (
    <>
      <div className="flex  justify-center items-center text-xl text-cyan-300">
        <p className="">{details}</p>
      </div>
      <div className="flex flex-col md:flex-row justify-around items-center py-3">
        <img
          src={icon}
          alt="weather-icon"
        />
        <p className="text-white mx-auto text-5xl">{`${temp.toFixed()}°${units === "metric" ? 'C' : 'F'}`}</p>
        <div className="grid w-[15rem] md:w-full grid-cols-2 md:grid-cols-3 gap-1.5 space-y-3 py-3 items-start">
          {Vdetails.map(({ id, Icon, value, title }) => {
            return (
              <div key={id} className="flex text-sm font-light ">
                <Icon size={18} className="m-1" />
                <p className="font-light ml-1">
                  {`${title}:`}{" "}
                  <span className="font-medium ml-1">{value}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-2  w-[15rem] md:w-full items-center justify-center py-3 space-x-10 text-sm">
        {Hdetails.map(({ id, Icon, value, title }) => {
          return (
            <div key={id} className="flex text-sm font-light ">
              <Icon size={30} className="m-1" />
              {`${title}:`} <span className="font-medium ml-1">{value}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

TempDetails.propTypes = {
  weather: PropTypes.shape({
    details: PropTypes.string.isRequired,
    temp: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    temp_max: PropTypes.number.isRequired,
    temp_min: PropTypes.number.isRequired,
    formattedSunrise: PropTypes.string.isRequired,
    formattedSunset: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
    feels_like: PropTypes.number.isRequired,
    humidity: PropTypes.number.isRequired,
    all: PropTypes.number.isRequired,
    visibility: PropTypes.number.isRequired,
  }).isRequired,
  units: PropTypes.string.isRequired,
};

export default TempDetails;
