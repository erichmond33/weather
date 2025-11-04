import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Animated,
    Dimensions,
    ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import backgroundDictionary from '../../library/images/backgroundDictionary';

const { width, height } = Dimensions.get('window');

export default function SearchPage({ onSearch, isLoading, onBack }) {
    const [searchQuery, setSearchQuery] = useState('');

    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.9));

    // Get a random background image
    const backgroundKeys = Object.keys(backgroundDictionary);
    const randomKey = backgroundKeys[2];
    const randomBackground = backgroundDictionary[randomKey];

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
            setSearchQuery(''); // Clear input after search
        } else {
            Alert.alert('Error', 'Please enter a city name');
        }
    };

    return (
        <ImageBackground source={randomBackground} style={styles.container}>
            <View style={styles.overlay}>
                <Animated.View 
                    style={[
                        styles.contentContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onBack}>
                        <View style={styles.backButtonContainer}>
                            <Ionicons name="arrow-back" size={24} color="#4a5568" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    {/* Welcome Section */}
                    <View style={styles.welcomeSection}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="location" size={48} color="#4a5568" />
                        </View>
                        <Text style={styles.welcomeTitle}>Discover Weather</Text>
                        <Text style={styles.welcomeSubtitle}>
                            Search for any city worldwide to get detailed weather information
                        </Text>
                    </View>

                    {/* Search Card */}
                    <View style={styles.searchCard}>
                        <View style={styles.searchInputContainer}>
                            <Ionicons name="search" size={20} color="#a0aec0" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Enter city name (e.g., New York, London)"
                                placeholderTextColor="#a0aec0"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                autoFocus={true}
                                returnKeyType="search"
                            />
                        </View>

                        <TouchableOpacity 
                            style={[styles.searchButton, isLoading && styles.searchButtonDisabled]} 
                            onPress={handleSearch}
                            disabled={isLoading}
                        >
                            <View style={styles.searchButtonContent}>
                                {isLoading ? (
                                    <ActivityIndicator color="#718096" size="small" />
                                ) : (
                                    <>
                                        <Ionicons name="search" size={18} color="#2C3E50" style={styles.buttonIcon} />
                                        <Text style={styles.searchButtonText}>Search Weather</Text>
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Popular Cities */}
                    <View style={styles.popularSection}>
                        <Text style={styles.popularTitle}>Popular Cities</Text>
                        <View style={styles.cityTags}>
                            {['San Francisco', 'London', 'Tokyo', 'Paris', 'Sydney'].map((city) => (
                                <TouchableOpacity
                                    key={city}
                                    style={styles.cityTag}
                                    onPress={() => {
                                        setSearchQuery(city);
                                        onSearch(city);
                                    }}
                                >
                                    <Text style={styles.cityTagText}>{city}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Animated.View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(248, 250, 252, 0.1)',
        backdropFilter: 'blur(10px)',
    },
    contentContainer: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginBottom: 20,
    },
    backButton: {
        zIndex: 1,
    },
    backButtonContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.95)',
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2d3748',
        textAlign: 'center',
        flex: 1,
    },
    headerSpacer: {
        width: 44,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    welcomeSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.95)',
        shadowColor: 'rgba(0, 0, 0, 0.15)',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 6,
    },
    welcomeTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2d3748',
        marginBottom: 12,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#3a434fff',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    searchCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 24,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.98)',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 8,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(248, 250, 252, 0.9)',
        borderRadius: 15,
        paddingHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.8)',
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 16,
        color: '#2C3E50',
        fontWeight: '500',
    },
    searchButton: {
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 1)',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    searchButtonDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.7)',
    },
    searchButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    buttonIcon: {
        marginRight: 8,
    },
    searchButtonText: {
        color: '#2d3748',
        fontSize: 16,
        fontWeight: '700',
    },
    popularSection: {
        marginBottom: 20,
    },
    popularTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#4a5568',
        marginBottom: 16,
        textAlign: 'center',
    },
    cityTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    cityTag: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        margin: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.95)',
        shadowColor: 'rgba(0, 0, 0, 0.12)',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    cityTagText: {
        color: '#4a5568',
        fontSize: 14,
        fontWeight: '600',
    },
});