import { useState, useEffect } from 'react';

export default function useGeolocation(lat, lon) {
	const [coordinates, setCoordinates] = useState(null);
	
	useEffect(() => {
		console.log('🌍 Geolocation hook starting...');
		
		// Check if geolocation is available
		if (!navigator.geolocation) {
			console.error('❌ Geolocation is not supported by this browser');
			// Fallback to a default location (New York) for testing
			console.log('🗽 Using fallback coordinates (New York)');
			setCoordinates([40.7128, -74.0060]);
			return;
		}

		// Get current position with detailed error handling
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const coords = [position.coords.latitude, position.coords.longitude];
				console.log('✅ Location obtained:', coords);
				setCoordinates(coords);
			},
			(err) => {
				console.error('❌ Geolocation error:', err.message);
				console.error('Error code:', err.code);
				
				switch(err.code) {
					case err.PERMISSION_DENIED:
						console.error('❌ User denied the request for Geolocation');
						break;
					case err.POSITION_UNAVAILABLE:
						console.error('❌ Location information is unavailable');
						break;
					case err.TIMEOUT:
						console.error('❌ The request to get user location timed out');
						break;
					default:
						console.error('❌ An unknown error occurred');
				}
				
				// Fallback to a default location (New York) for testing
				console.log('🗽 Using fallback coordinates (New York) due to geolocation error');
				setCoordinates([40.7128, -74.0060]);
			},
			{
				timeout: 5000/2,
				enableHighAccuracy: false,
				maximumAge: 600000 // 10 minutes
			}
		);
	}, []);

	return coordinates;
}
