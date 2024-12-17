import { GoogleMap } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { getCurrentLocationData } from '../utils/location';

const CurrentLocationMap = () => {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 0,
    lng: 0
  });
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const updateLocation = async () => {
    try {
      const { currentLocation, cityName } = await getCurrentLocationData();
      setCurrentLocation(currentLocation);
      setCityName(cityName);
    } catch (error) {
      console.error('Error updating location:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  return (
    <div className="flex flex-col  px-6">
      <div className="flex items-center">
        <FaMapMarkerAlt className="text-orange-500 text-xl mr-1" />
        <span className="text-lg mr-5">
          Current Location:
          <span className="text-xl font-semibold ml-2">
            {loading ? 'Loading...' : cityName}
          </span>
        </span>

        <button
          onClick={updateLocation}
          className="rounded-2xl border border-gray-500 shadow-sm hover:bg-sky-100 hover:shadow-md bg-white
          text-xs px-2 py-1
          md:text-base md:px-3 md:py-1"
        >
          Set Location
        </button>
      </div>

      <div className="pt-4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentLocation}
          zoom={15}
        />
      </div>

      <p className="pt-3 text-lg text-gray-500">
        Only same city travelers are available
      </p>
    </div>
  );
};

export default CurrentLocationMap;
