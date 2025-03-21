import { Image, StyleSheet, Platform, View, Button } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSharedValue } from 'react-native-reanimated';

export default function HomeScreen() {
  const translateY = useSharedValue<number>(0);

  const handlePress = () => {
    translateY.value += 20;
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(translateY.value * 2) }],
  }));

  return (
    <View style={styles.container}>
        <Button onPress={handlePress} title="Move" />
        <Animated.View style={[styles.box, animatedStyles]} />
        
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: 'pink',
    borderRadius: 20,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
