import React from 'react';
import backgroudDictionary from '../../library/images/backgroundDictionary';
import CurrentWeatherCard from '../CurrentWeather/CurrentWeatherCard';
import {
	ImageBackground,
	ScrollView,
	StatusBar,
	View,
	StyleSheet,
} from 'react-native';


export default function Weather({ weather, city, airPollution }) {
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
});
