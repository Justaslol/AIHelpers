import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { aiHelpers } from '../AiHelpers';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.grid}>
        {aiHelpers.map((helper) => (
          <TouchableOpacity
            key={helper.id}
            style={styles.square}
            onPress={() =>
              navigation.navigate('Chat', {
                helperId: helper.id,
                assistantName: helper.name,
              })
            }
          >
            <Image source={helper.image} style={styles.image} />
            <Text style={styles.title}>{helper.name}</Text>
            <Text style={styles.subtitle}>{helper.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', // Light gray background similar to Apple design
    padding: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  square: {
    backgroundColor: '#FFFFFF', // White background for squares
    width: '47%',
    aspectRatio: 1, // Ensures the square is a perfect square
    marginBottom: 15,
    borderRadius: 12,
    alignItems: 'center',
    padding: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Android shadow
    elevation: 4,
  },
  image: {
    width: '60%',
    height: '50%',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1C1C1E', // Dark text color
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93', // Gray subtitle color
    textAlign: 'center',
  },
});