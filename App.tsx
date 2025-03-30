import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './context/ThemeContext';
import { SavedJobsProvider } from './context/SavedJobsContext';
import JobFinderScreen from './screens/JobFinderScreen';
import SavedJobsScreen from './screens/SavedJobsScreen';
import { Ionicons } from '@expo/vector-icons';
import { ThemeToggle } from './components/ThemeToggle';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <SavedJobsProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  let iconName;
                  if (route.name === 'Jobs') {
                    iconName = 'briefcase-outline';
                  } else if (route.name === 'Saved') {
                    iconName = 'bookmark-outline';
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                headerShown: true,
                headerRight: () => <ThemeToggle />,
              })}
            >
              <Tab.Screen 
                name="Jobs" 
                component={JobFinderScreen} 
                options={{
                  title: 'Job Finder',
                }}
              />
              <Tab.Screen 
                name="Saved" 
                component={SavedJobsScreen} 
                options={{
                  title: 'Saved Jobs',
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </SavedJobsProvider>
    </ThemeProvider>
  );
}