import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	StatusBar,
	StyleSheet,
	Animated,
	Easing,
} from 'react-native';

export default function Loading() {
	const cardScale = useRef(new Animated.Value(0.95)).current;
	const cardOpacity = useRef(new Animated.Value(0)).current;
	const rotate = useRef(new Animated.Value(0)).current;
	const pulseScale = useRef(new Animated.Value(1)).current;
	const pulseOpacity = useRef(new Animated.Value(0.3)).current;
	const shimmerTranslate = useRef(new Animated.Value(-200)).current;
	const [dots, setDots] = useState('');

	useEffect(() => {
		// Card entrance animation
		Animated.parallel([
			Animated.timing(cardOpacity, {
				toValue: 1,
				duration: 800,
				useNativeDriver: true,
				easing: Easing.out(Easing.ease),
			}),
			Animated.spring(cardScale, {
				toValue: 1,
				tension: 100,
				friction: 8,
				useNativeDriver: true,
			}),
		]).start();

		// Pulsing animation for the background circle
		const pulse = Animated.loop(
			Animated.sequence([
				Animated.parallel([
					Animated.timing(pulseScale, {
						toValue: 1.08,
						duration: 1200,
						useNativeDriver: true,
						easing: Easing.out(Easing.ease),
					}),
					Animated.timing(pulseOpacity, {
						toValue: 0.1,
						duration: 1200,
						useNativeDriver: true,
						easing: Easing.out(Easing.ease),
					}),
				]),
				Animated.parallel([
					Animated.timing(pulseScale, {
						toValue: 1,
						duration: 1200,
						useNativeDriver: true,
						easing: Easing.in(Easing.ease),
					}),
					Animated.timing(pulseOpacity, {
						toValue: 0.3,
						duration: 1200,
						useNativeDriver: true,
						easing: Easing.in(Easing.ease),
					}),
				]),
			])
		);

		// Rotating animation for the weather icon
		const rotation = Animated.loop(
			Animated.timing(rotate, {
				toValue: 1,
				duration: 3000,
				useNativeDriver: true,
				easing: Easing.linear,
			})
		);

		// Shimmer effect animation
		const shimmer = Animated.loop(
			Animated.sequence([
				Animated.timing(shimmerTranslate, {
					toValue: 200,
					duration: 1500,
					useNativeDriver: true,
					easing: Easing.out(Easing.ease),
				}),
				Animated.delay(800),
			])
		);

		pulse.start();
		rotation.start();
		shimmer.start();

		return () => {
			pulse.stop();
			rotation.stop();
			shimmer.stop();
		};
	}, [cardScale, cardOpacity, rotate, pulseScale, pulseOpacity, shimmerTranslate]);

	// Animated dots for loading text
	useEffect(() => {
		let i = 0;
		const id = setInterval(() => {
			i += 1;
			setDots('.'.repeat((i % 4) + 1));
		}, 400);
		return () => clearInterval(id);
	}, []);

	const rotateInterpolate = rotate.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});

	return (
		<View style={styles.screen}>
			<StatusBar barStyle="light-content" />

			<View style={styles.container}>
				{/* Background pulse effect */}
				<Animated.View
					style={[
						styles.pulse,
						{
							transform: [{ scale: pulseScale }],
							opacity: pulseOpacity,
						},
					]}
				/>

				{/* Main loading card */}
				<Animated.View
					style={[
						styles.loadingCard,
						{
							opacity: cardOpacity,
							transform: [{ scale: cardScale }],
						},
					]}
				>
					{/* Shimmer overlay */}
					<View style={styles.shimmerContainer}>
						<Animated.View
							style={[
								styles.shimmer,
								{
									transform: [{ translateX: shimmerTranslate }],
								},
							]}
						/>
					</View>

					{/* Weather icon */}
					<Animated.Text
						accessibilityRole="image"
						style={[
							styles.weatherIcon,
							{ transform: [{ rotate: rotateInterpolate }] },
						]}
					>
						☀️
					</Animated.Text>

					{/* Loading progress dots */}
					<View style={styles.progressContainer}>
						{[0, 1, 2].map((index) => (
							<LoadingDot key={index} delay={index * 200} />
						))}
					</View>
				</Animated.View>
			</View>
		</View>
	);
}

// Component for animated loading dots
function LoadingDot({ delay }) {
	const opacity = useRef(new Animated.Value(0.3)).current;

	useEffect(() => {
		const animate = Animated.loop(
			Animated.sequence([
				Animated.delay(delay),
				Animated.timing(opacity, {
					toValue: 1,
					duration: 400,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 0.3,
					duration: 400,
					useNativeDriver: true,
				}),
			])
		);

		animate.start();
		return () => animate.stop();
	}, [opacity, delay]);

	return <Animated.View style={[styles.progressDot, { opacity }]} />;
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#52c2faff',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	pulse: {
		position: 'absolute',
		width: 240,
		height: 240,
		borderRadius: 120,
		backgroundColor: 'rgba(255,255,255,0.08)',
	},
	loadingCard: {
		width: '92%',
		backgroundColor: 'rgba(255,255,255,0.06)',
		borderRadius: 18,
		paddingVertical: 32,
		paddingHorizontal: 24,
		alignItems: 'center',
		// iOS shadow
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.25,
		shadowRadius: 12,
		// Android elevation
		elevation: 8,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.08)',
		overflow: 'hidden',
	},
	shimmerContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		overflow: 'hidden',
	},
	shimmer: {
		width: 100,
		height: '100%',
		backgroundColor: 'rgba(255,255,255,0.1)',
		transform: [{ skewX: '-20deg' }],
	},
	weatherIcon: {
		fontSize: 64,
		marginBottom: 16,
		zIndex: 2,
	},
	loadingTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: 'white',
		marginBottom: 8,
		textAlign: 'center',
	},
	loadingSubtitle: {
		fontSize: 14,
		color: 'rgba(255,255,255,0.8)',
		textAlign: 'center',
		marginBottom: 24,
		fontWeight: '400',
	},
	progressContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	progressDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: 'white',
		marginHorizontal: 4,
	},
	statusText: {
		marginTop: 32,
		fontSize: 14,
		color: 'rgba(255,255,255,0.7)',
		textAlign: 'center',
		fontWeight: '400',
		paddingHorizontal: 16,
		lineHeight: 20,
	},
});
