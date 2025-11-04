import React, { useEffect, useRef } from 'react';
import { isSameDay } from 'date-fns';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import iconsDictionary from '../../library/images/iconsDictionary';

function CurrentWeatherCard({ city, weather }) {
	const locationTimezone = weather.timezone_offset * 1000;

	const todayData = weather.daily.filter((object) => {
		const now = new Date().getTime() + locationTimezone;
		const currentDate = new Date(object.dt * 1000 + locationTimezone);
		return isSameDay(now, currentDate);
	});

	const currentWeather = {
		city: city.name,
		country: city.country,
		description:
			weather.current.weather[0].description.charAt(0).toUpperCase() +
			weather.current.weather[0].description.slice(1),
		icon:
			iconsDictionary[weather.current.weather[0].icon] ||
			iconsDictionary['02d'],
		min: Math.round(todayData[0].temp.min),
		max: Math.round(todayData[0].temp.max),
		temp: Math.round(weather.current.temp),
	};

	// Animations for a subtle entrance
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scaleAnim = useRef(new Animated.Value(0.98)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 600,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				friction: 6,
				useNativeDriver: true,
			}),
		]).start();
	}, [fadeAnim, scaleAnim]);

	return (
		<Animated.View
			style={[
				styles.card,
				{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
			]}
		>
			<View style={styles.headerRow}>
				<Text style={styles.city} numberOfLines={1}>
					{city.name}, {city.country}
				</Text>
				<Text style={styles.smallDescription}>
					{currentWeather.description}
				</Text>
			</View>

			<View style={styles.centerRow}>
				<Image source={currentWeather.icon} style={styles.icon} />
				<Text style={styles.currentTemp}>{currentWeather.temp}°</Text>
			</View>

			<View style={styles.footerRow}>
				<View style={styles.chip}>
					<Text style={styles.chipLabel}>H</Text>
					<Text style={styles.chipValue}>{currentWeather.max}°</Text>
				</View>
				<View style={[styles.chip, styles.lowChip]}>
					<Text style={styles.chipLabel}>L</Text>
					<Text style={styles.chipValue}>{currentWeather.min}°</Text>
				</View>
			</View>
		</Animated.View>
	);
}

export default CurrentWeatherCard;

const styles = StyleSheet.create({
	card: {
		marginTop: 60,
		alignSelf: 'center',
		width: '92%',
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderRadius: 18,
		paddingVertical: 18,
		paddingHorizontal: 18,
		// iOS shadow
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.25,
		shadowRadius: 12,
		// Android elevation
		elevation: 8,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.08)',
	},
	headerRow: {
		alignItems: 'center',
		marginBottom: 6,
	},
	city: {
		textAlign: 'center',
		fontSize: 26,
		fontWeight: '600',
		color: 'white',
	},
	smallDescription: {
		textAlign: 'center',
		fontSize: 14,
		color: 'rgba(255,255,255,0.9)',
		marginTop: 4,
	},
	centerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 8,
	},
	icon: {
		width: 88,
		height: 88,
		resizeMode: 'contain',
		marginRight: 12,
	},
	currentTemp: {
		textAlign: 'center',
		fontSize: 72,
		fontWeight: '200',
		color: 'white',
	},
	footerRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 6,
	},
	chip: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.04)',
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 20,
		marginHorizontal: 6,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.06)',
	},
	lowChip: {
		backgroundColor: 'rgba(255,255,255,0.02)',
	},
	chipLabel: {
		color: 'rgba(255,255,255,0.75)',
		fontSize: 12,
		marginRight: 8,
		fontWeight: '600',
	},
	chipValue: {
		color: 'white',
		fontSize: 14,
		fontWeight: '500',
	},
});
