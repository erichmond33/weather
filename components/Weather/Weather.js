import React from 'react';
import backgroudDictionary from '../../library/images/backgroundDictionary';
import CurrentWeatherCard from '../CurrentWeather/CurrentWeatherCard';
import {
	ImageBackground,
	ScrollView,
	StatusBar,
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function Weather({ weather, city, airPollution, onBack, onSearch, isSearchResult = false }) {
	let background = backgroudDictionary[weather.current.weather[0].icon];

	return (
		weather &&
		airPollution &&
		city && (
			<ImageBackground source={background} style={{ flex: 1 }}>
				<StatusBar barStyle='light-content' />
				<View
					style={{
						flex: 1,
						backgroundColor: 'rgba(0, 0, 0, 0.3)',
					}}
				>
					{/* Header with navigation buttons */}
					<View style={styles.headerContainer}>
						{isSearchResult && onBack && (
							<TouchableOpacity style={styles.navButton} onPress={onBack}>
								<Ionicons name="arrow-back" size={24} color="#fff" />
								<Text style={styles.navButtonText}>Location</Text>
							</TouchableOpacity>
						)}
						
						{!isSearchResult && onSearch && (
							<TouchableOpacity style={styles.searchButton} onPress={onSearch}>
								<Ionicons name="search" size={24} color="#fff" />
								<Text style={styles.navButtonText}>Search</Text>
							</TouchableOpacity>
						)}
					</View>

					<View style={styles.container}>
						<ScrollView contentContainerStyle={styles.scrollContainer}>
							<CurrentWeatherCard
								weather={weather}
								city={city}
								style={{ height: 300 }}
							/>
						</ScrollView>
					</View>
				</View>
			</ImageBackground>
		)
	);
}

const styles = StyleSheet.create({
	background: { flex: 1 },
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,30,0,0.1)',
	},
	container: {
		flex: 1,
		alignContent: 'center',
		justifyContent: 'center',
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 25,
		paddingHorizontal: 20,
		paddingBottom: 10,
	},
	navButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 20,
	},
	searchButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 20,
		marginLeft: 'auto',
	},
	navButtonText: {
		color: '#fff',
		marginLeft: 5,
		fontSize: 14,
		fontWeight: '600',
	},
});
