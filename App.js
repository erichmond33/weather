import React from 'react';
import useWeather from './library/customHooks/useWeatherData';
import Loading from './components/Loading/Loading';
import Weather from './components/Weather/Weather';

import { View, StyleSheet } from 'react-native';

export default function App() {
	const { weather, city, airPollution } = useWeather();
	
	console.log('🏠 App render - City:', city);
	console.log('🏠 App render - Weather:', weather ? 'loaded' : 'null');
	console.log('🏠 App render - Air Pollution:', airPollution ? 'loaded' : 'null');
	
	// More thorough check for weather data structure
	const isWeatherReady = weather && 
		weather.current && 
		weather.current.weather && 
		Array.isArray(weather.current.weather) && 
		weather.current.weather.length > 0;
	
	return (
		<View style={styles.container}>
			{!isWeatherReady || !city || !airPollution ? (
				<Loading />
			) : (
				<Weather weather={weather} city={city} airPollution={airPollution} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//justifyContent: 'center',
		//alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.6)',
	},
});
