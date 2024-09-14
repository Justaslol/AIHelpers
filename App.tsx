// App.tsx

import React from 'react';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import CustomDrawerContent from './src/components/CustomDrawerContent';

export type RootStackParamList = {
  Home: undefined;
  Chat: { helperId: string; assistantName: string };
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'AI Helpers',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              style={{ marginLeft: 15 }}
            >
              <Ionicons name="menu" size={28} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
  name="Chat"
  component={ChatScreen}
  options={({ navigation, route }) => ({
    title: route.params.assistantName,
    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 15 }}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
    ),
  })}
/>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="HomeDrawer" component={StackNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}