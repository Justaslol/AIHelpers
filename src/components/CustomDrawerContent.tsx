import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { aiHelpers } from '../AiHelpers';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || 'User');
      } else {
        setUserName('');
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <FlatList
        ListHeaderComponent={() => (
          <Text style={styles.sectionTitle}>Ongoing Tasks</Text>
        )}
        data={aiHelpers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => {
                props.navigation.dispatch(
                  CommonActions.navigate({
                    name: 'Chat',
                    params: {
                      helperId: item.id,
                      assistantName: item.name,
                    },
                  })
                );
              }}
          >
            <Text style={styles.taskText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.profileContainer}  // Make the whole row clickable
            onPress={() => {
              props.navigation.navigate('Settings');  // Navigate to Settings on click
            }}
          >
            <View style={styles.profileInfo}>
              <Image
                source={require('../../assets/profile.jpg')}
                style={styles.profileImage}
                onError={() => console.log('Failed to load profile image')}
              />
              <Text style={styles.profileName}>{userName}</Text>
            </View>
            <Ionicons name="ellipsis-horizontal" size={24} color="black" />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  sectionTitle: {
    marginLeft: 16,
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  taskText: {
    fontSize: 16,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  profileName: {
    marginLeft: 12,
    fontSize: 16,
  },
});