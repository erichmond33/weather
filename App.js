import React, { useState } from 'react';
import useWeather from './library/customHooks/useWeatherData';
import useCitySearch from './library/customHooks/useCitySearch';
import Loading from './components/Loading/Loading';
import Weather from './components/Weather/Weather';
import SearchPage from './components/Search/SearchPage';

import { View, StyleSheet, Alert } from 'react-native';

export default function App() {
	const { weather, city, airPollution } = useWeather();
	const { searchResults, searchLoading, searchError, searchCity, clearSearch } = useCitySearch();
	const [currentView, setCurrentView] = useState('location'); // 'location', 'search', 'searchResults'
	
	console.log('🏠 App render - City:', city);
	console.log('🏠 App render - Weather:', weather ? 'loaded' : 'null');
	console.log('🏠 App render - Air Pollution:', airPollution ? 'loaded' : 'null');
	console.log('🏠 App render - Current View:', currentView);
	console.log('🏠 App render - Search Results:', searchResults ? 'loaded' : 'null');
	
	// More thorough check for weather data structure
	const isWeatherReady = weather && 
		weather.current && 
		weather.current.weather && 
		Array.isArray(weather.current.weather) && 
		weather.current.weather.length > 0;

	const handleSearch = async (cityName) => {
		await searchCity(cityName);
		// Don't change view here - let useEffect handle it based on search results
	};

	const handleBackToLocation = () => {
		clearSearch();
		setCurrentView('location');
	};

	const handleShowSearch = () => {
		setCurrentView('search');
	};

	// Handle search completion
	React.useEffect(() => {
		if (searchResults && !searchLoading && !searchError) {
			setCurrentView('searchResults');
		} else if (searchError && !searchLoading) {
			Alert.alert('Search Error', searchError, [
				{ text: 'Try Again', onPress: () => setCurrentView('search') },
				{ text: 'Cancel', onPress: () => handleBackToLocation() }
			]);
		}
	}, [searchResults, searchLoading, searchError]);

	// Render based on current view
	if (currentView === 'search') {
		return (
			<View style={styles.container}>
				<SearchPage 
					onSearch={handleSearch}
					isLoading={searchLoading}
					onBack={handleBackToLocation}
				/>
			</View>
		);
	}

	if (currentView === 'searchResults' && searchResults) {
		return (
			<View style={styles.container}>
				<Weather 
					weather={searchResults.weather} 
					city={searchResults.city} 
					airPollution={searchResults.airPollution}
					onBack={handleBackToLocation}
					onSearch={handleShowSearch}
					isSearchResult={true}
				/>
			</View>
		);
	}

	// Default location view
	return (
		<View style={styles.container}>
			{!isWeatherReady || !city || !airPollution ? (
				<Loading />
			) : (
				<Weather 
					weather={weather} 
					city={city} 
					airPollution={airPollution}
					onSearch={handleShowSearch}
					isSearchResult={false}
				/>
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
