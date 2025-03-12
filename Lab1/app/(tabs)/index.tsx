import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';

// Header Custom Component
interface HeaderProps {
  renderLeft?: () => JSX.Element;
  renderCenter?: () => JSX.Element;
  renderRight?: () => JSX.Element;
}

const Header: React.FC<HeaderProps> = ({ renderLeft, renderCenter, renderRight }) => {
  return (
    <View style={headerStyles.header}>
      <View style={headerStyles.side}>{renderLeft && renderLeft()}</View>
      <View style={headerStyles.center}>{renderCenter && renderCenter()}</View>
      <View style={headerStyles.side}>{renderRight && renderRight()}</View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#eee',
    width: '100%',
    marginTop: 10
  },
  backButton: {
    padding: 10, 
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15, 
  },
  side: { flex: 1, alignItems: 'center' },
  center: { flex: 3, alignItems: 'center' },
});

export default function HomeScreen() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Header
          renderLeft={() => (
            <TouchableOpacity style={headerStyles.backButton} onPress={() => console.log('Back pressed')}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          )}
          renderCenter={() => <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Header</Text>}
          renderRight={() => (
            <Image
              source={{ uri: "https://e7.pngegg.com/pngimages/358/473/png-clipart-computer-icons-user-profile-person-child-heroes.png" }}
              style={headerStyles.userImage}
            />
          )}
        />
        <Header
          renderLeft={() => (
            <TouchableOpacity style={headerStyles.backButton} onPress={() => console.log('Back pressed')}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          )}
          renderCenter={() => <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Trang chủ</Text>}
        />
        <Header
          renderLeft={() => (
            <TouchableOpacity style={headerStyles.backButton} onPress={() => console.log('Back pressed')}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  
});