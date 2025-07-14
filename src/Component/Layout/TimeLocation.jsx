import PropTypes from 'prop-types';

export default function TimeLocation({
  weather: { formatLocalTime, name, country },
}) {
  return (
    <>
      <div className="flex flex-row justify-center items-center">
        <p className="md:text-xl text-base font-medium text-gray-300">
          {/* Tuesday, 4 Febraury 2025 | Local Time : 00:00 AM */}
          {formatLocalTime}
        </p>
      </div>
      <div className="flex items-center justify-center my-3">
        <p className="font-medium text-3xl">{`${name},${country}`}</p>
      </div>
    </>
  );
}

TimeLocation.propTypes = {
  weather: PropTypes.shape({
    formatLocalTime: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
  }).isRequired,
};
