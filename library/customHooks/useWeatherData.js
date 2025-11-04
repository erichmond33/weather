import { useState, useEffect } from 'react';
//import { API_KEY } from 'react-native-dotenv';
import useGeoLocation from './useGeolocation';

function useWeatherData(lat, long) {
	const [weather, setWeather] = useState(null);
	const [city, setCity] = useState(null);
	const coordinates = useGeoLocation();
	const [airPollution, setAirPollution] = useState(null);

	useEffect(() => {
		console.log('📍 Coordinates updated:', coordinates);
		if (coordinates) {
			console.log('🚀 Starting API calls...');
			fetchWeatherData(...coordinates);
			fetchCityData(...coordinates);
			fetchAirPollutionData(...coordinates);
		}
	}, [coordinates]);

	async function fetchWeatherData(lat, long) {
		try {
			console.log('🌤️ Fetching weather data for:', lat, long);
			
			// Fetch current weather (free) - using imperial units
			const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&appid=a44ab69c8bbeb111888405f042814c9f`;
			console.log('🌤️ Current Weather API URL:', currentWeatherUrl);
			
			// Fetch 5-day forecast (free) - using imperial units
			const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=imperial&appid=a44ab69c8bbeb111888405f042814c9f`;
			console.log('🌤️ Forecast API URL:', forecastUrl);
			
			const [currentResponse, forecastResponse] = await Promise.all([
				fetch(currentWeatherUrl),
				fetch(forecastUrl)
			]);
			
			console.log('🌤️ Current Weather API response status:', currentResponse.status);
			console.log('🌤️ Forecast API response status:', forecastResponse.status);
			
			if (!currentResponse.ok || !forecastResponse.ok) {
				throw new Error(`HTTP Error: Current ${currentResponse.status}, Forecast ${forecastResponse.status}`);
			}
			
			const [currentData, forecastData] = await Promise.all([
				currentResponse.json(),
				forecastResponse.json()
			]);
			
			console.log('🌤️ Current Weather API response:', currentData);
			console.log('🌤️ Forecast API response:', forecastData);
			
			// Transform data to match OneCall structure
			const transformedData = {
				timezone_offset: currentData.timezone, // Add timezone offset
				current: {
					dt: currentData.dt,
					temp: currentData.main.temp,
					feels_like: currentData.main.feels_like,
					pressure: currentData.main.pressure,
					humidity: currentData.main.humidity,
					uvi: 0, // Not available in free API
					visibility: currentData.visibility,
					wind_speed: currentData.wind.speed,
					wind_deg: currentData.wind.deg,
					weather: currentData.weather,
					sunrise: currentData.sys.sunrise,
					sunset: currentData.sys.sunset
				},
				hourly: forecastData.list.slice(0, 24), // First 24 hours (3-hour intervals)
				daily: processDailyForecast(forecastData.list)
			};
			
			console.log('🌤️ Transformed weather data:', transformedData);
			
			if (transformedData && transformedData.current) {
				setWeather(transformedData);
				console.log('✅ Weather data set successfully');
			} else {
				console.error('❌ Invalid weather data structure:', transformedData);
			}
		} catch (err) {
			console.error('❌ Unable to fetch weather:', err.message);
		}
	}

	// Helper function to process daily forecast from 5-day/3-hour forecast
	function processDailyForecast(forecastList) {
		const dailyData = {};
		
		forecastList.forEach(item => {
			const date = new Date(item.dt * 1000).toDateString();
			if (!dailyData[date]) {
				dailyData[date] = {
					dt: item.dt,
					temp: {
						min: item.main.temp,
						max: item.main.temp,
						day: item.main.temp
					},
					weather: item.weather,
					humidity: item.main.humidity,
					wind_speed: item.wind.speed,
					wind_deg: item.wind.deg
				};
			} else {
				// Update min/max temperatures
				dailyData[date].temp.min = Math.min(dailyData[date].temp.min, item.main.temp);
				dailyData[date].temp.max = Math.max(dailyData[date].temp.max, item.main.temp);
			}
		});
		
		return Object.values(dailyData).slice(0, 5); // Return up to 5 days
	}	async function fetchCityData(lat, long) {
		try {
			console.log('🏙️ Fetching city data for coordinates:', lat, long);
			const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&&units=imperial&appid=a44ab69c8bbeb111888405f042814c9f`;
			console.log('🏙️ City API URL:', url);
			const response = await fetch(url);
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			
			const data = await response.json();
			console.log('🏙️ City API response:', data);
			
			if (data.name) {
				const cityData = {
					name: data.name,
					country: data.sys?.country || 'Unknown',
				};
				console.log('✅ City data set:', cityData);
				setCity(cityData);
			} else {
				console.error('❌ No city name in API response');
			}
		} catch (err) {
			console.error('❌ Unable to fetch city:', err.message);
		}
	}

	async function fetchAirPollutionData(lat, long) {
		try {
			console.log('🏭 Fetching air pollution data for:', lat, long);
			const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${long}&appid=a44ab69c8bbeb111888405f042814c9f`;
			console.log('🏭 Air Pollution API URL:', url);
			
			const response = await fetch(url);
			console.log('🏭 Air Pollution API response status:', response.status);
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			
			const airData = await response.json();
			console.log('🏭 Air Pollution API response:', airData);
			
			if (airData && airData.list && airData.list.length > 0) {
				setAirPollution(airData.list[0]);
				console.log('✅ Air pollution data set successfully:', airData.list[0]);
			} else {
				console.error('❌ Invalid air pollution data structure:', airData);
			}
		} catch (err) {
			console.error('❌ Unable to fetch air pollution:', err.message);
		}
	}

	return { weather, city, airPollution };
}

export default useWeatherData;
