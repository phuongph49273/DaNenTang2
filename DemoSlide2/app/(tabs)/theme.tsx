import { Text, View, Button, StyleSheet } from 'react-native';
import React, { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext('light');

export function UseContextScreen() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={theme}>
      <View style={styles.container}>
        <Text style={styles.title}>UseContextScreen</Text>
        <Button title="Đổi theme" onPress={toggleTheme} color={theme === 'light' ? '#007bff' : '#f0ad4e'} />
        <Paragraph />
      </View>
    </ThemeContext.Provider>
  );
}

function Paragraph() {
  const theme = useContext(ThemeContext);

  return (
    <View style={[styles.paragraphContainer, { backgroundColor: theme === 'light' ? 'white' : 'gray' }]}> 
      <Text style={[styles.paragraphText, { color: theme === 'light' ? 'black' : 'white' }]}> 
        Lớp học React Native là một lớp học tuyệt vời, với những kiến thức cực kỳ dễ học và tràn đầy yêu thương.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create ({
  container: {
    marginTop: 50,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraphContainer: {
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    width: '90%',
  },
  paragraphText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UseContextScreen;
