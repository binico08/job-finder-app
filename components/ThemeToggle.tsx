import React from 'react';
import { View, Switch, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme.background === '#1E1E1E';

  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center',
      paddingHorizontal: 10,
    }}>
      <Text style={{ 
        marginRight: 8, 
        fontSize: 16, 
        fontWeight: '500', 
        color: theme.text 
      }}>
        {isDarkMode ? 'Dark' : 'Light'}
      </Text>
      <Switch 
        value={isDarkMode} 
        onValueChange={toggleTheme}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
      />
    </View>
  );
};