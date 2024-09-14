// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

interface AIHelper {
  id: string;
  name: string;
  description: string;
  image: any; // Update this type if using remote images
}

const aiHelpers: AIHelper[] = [
  {
    id: 'assistant_1',
    name: 'Assistant 1',
    description: 'Your friendly helper',
    image: require('../../assets/assistant1.png'),
  },
  {
    id: 'assistant_2',
    name: 'Assistant 2',
    description: 'Expert in languages',
    image: require('../../assets/assistant2.png'),
  },
  {
    id: 'assistant_3',
    name: 'Assistant 3',
    description: 'Math genius',
    image: require('../../assets/assistant3.png'),
  },
  {
    id: 'assistant_4',
    name: 'Assistant 4',
    description: 'Science guru',
    image: require('../../assets/assistant4.png'),
  },
  {
    id: 'assistant_5',
    name: 'Assistant 5',
    description: 'History buff',
    image: require('../../assets/assistant5.png'),
  },
  {
    id: 'assistant_6',
    name: 'Assistant 6',
    description: 'Art expert',
    image: require('../../assets/assistant6.png'),
  },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.grid}>
        {aiHelpers.map((helper) => (
          <TouchableOpacity
            key={helper.id}
            style={styles.square}
            onPress={() => navigation.navigate('Chat', { 
              helperId: helper.id 
            })}
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