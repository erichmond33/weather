import { useState } from 'react';

function useCitySearch() {
	const [searchResults, setSearchResults] = useState(null);
	const [searchLoading, setSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState(null);

	const searchCity = async (cityName) => {
		setSearchLoading(true);
		setSearchError(null);
		setSearchResults(null);

		try {
			console.log('🔍 Searching for city:', cityName);
			
			// First, get coordinates for the city
			const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=a44ab69c8bbeb111888405f042814c9f`;
			console.log('🗺️ Geocoding URL:', geocodeUrl);
			
			const geocodeResponse = await fetch(geocodeUrl);
			
			if (!geocodeResponse.ok) {
				throw new Error(`Geocoding failed: ${geocodeResponse.status}`);
			}
			
			const geocodeData = await geocodeResponse.json();
			console.log('🗺️ Geocoding response:', geocodeData);
			
			if (!geocodeData || geocodeData.length === 0) {
				throw new Error('City not found. Please check the spelling and try again.');
			}
			
			const { lat, lon, name, country, state } = geocodeData[0];
			
			// Now fetch weather data for these coordinates
			const weatherData = await fetchWeatherForCoordinates(lat, lon);
			const airPollutionData = await fetchAirPollutionForCoordinates(lat, lon);
			
			// Format city data
			const cityData = {
				name: name,
				country: country,
				state: state || null,
			};
			
			const results = {
				weather: weatherData,
				city: cityData,
				airPollution: airPollutionData,
				coordinates: { lat, lon }
			};
			
			console.log('✅ Search completed successfully:', results);
			setSearchResults(results);
			
		} catch (error) {
			console.error('❌ Search failed:', error.message);
			setSearchError(error.message);
		} finally {
			setSearchLoading(false);
		}
	};

	const fetchWeatherForCoordinates = async (lat, lon) => {
		console.log('🌤️ Fetching weather data for searched city:', lat, lon);
		
		// Fetch current weather (free) - using imperial units
		const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=a44ab69c8bbeb111888405f042814c9f`;
		
		// Fetch 5-day forecast (free) - using imperial units
		const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=a44ab69c8bbeb111888405f042814c9f`;
		
		const [currentResponse, forecastResponse] = await Promise.all([
			fetch(currentWeatherUrl),
			fetch(forecastUrl)
		]);
		
		if (!currentResponse.ok || !forecastResponse.ok) {
			throw new Error(`Weather API Error: Current ${currentResponse.status}, Forecast ${forecastResponse.status}`);
		}
		
		const [currentData, forecastData] = await Promise.all([
			currentResponse.json(),
			forecastResponse.json()
		]);
		
		// Transform data to match OneCall structure
		const transformedData = {
			timezone_offset: currentData.timezone,
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
			hourly: forecastData.list.slice(0, 24),
			daily: processDailyForecast(forecastData.list)
		};
		
		return transformedData;
	};

	const fetchAirPollutionForCoordinates = async (lat, lon) => {
		console.log('🏭 Fetching air pollution data for searched city:', lat, lon);
		
		const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=a44ab69c8bbeb111888405f042814c9f`;
		
		const response = await fetch(url);
		
		if (!response.ok) {
			throw new Error(`Air Pollution API Error: ${response.status}`);
		}
		
		const airData = await response.json();
		
		if (airData && airData.list && airData.list.length > 0) {
			return airData.list[0];
		} else {
			throw new Error('Invalid air pollution data');
		}
	};

	// Helper function to process daily forecast from 5-day/3-hour forecast
	const processDailyForecast = (forecastList) => {
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
		
		return Object.values(dailyData).slice(0, 5);
	};

	const clearSearch = () => {
		setSearchResults(null);
		setSearchError(null);
		setSearchLoading(false);
	};

	return {
		searchResults,
		searchLoading,
		searchError,
		searchCity,
		clearSearch
	};
}

export default useCitySearch;