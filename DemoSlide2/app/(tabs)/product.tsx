import { Text, View, Button, StyleSheet } from 'react-native';
import React, { useState, useCallback, memo } from 'react';

interface ContentProps {
  onIncrease: () => void;
}

export const UseCallBackScreen = () => {
  const [count, setCount] = useState(0);

  const handleIncrease1 = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textCount}>{count}</Text>

      <ContentUseCallBack onIncrease={handleIncrease1} />
    </View>
  );
};

const ContentUseCallBack: React.FC<ContentProps> = memo(({ onIncrease }) => {
  console.log('Component con re-render');

  return (
    <View>
      <Button title="Tăng count" onPress={onIncrease} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  textCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default UseCallBackScreen;
