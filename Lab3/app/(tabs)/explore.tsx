import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList, ViewToken } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';

const data = Array(15)
  .fill(0)
  .map((_, index) => ({ id: index.toString() }));

interface ListItemProps {
  item: { id: string };
  viewableItems: Animated.SharedValue<ViewToken[]>;
}

const ListItem: React.FC<ListItemProps> = React.memo(({ item, viewableItems }) => {
  const rStyle = useAnimatedStyle(() => {
    const isVisible = viewableItems.value.some((viewable) => viewable.item.id === item.id && viewable.isViewable);

    return {
      opacity: withTiming(isVisible ? 1 : 0, { duration: 300 }),
      transform: [{ scale: withTiming(isVisible ? 1 : 0.6, { duration: 300 }) }],
    };
  });

  return <Animated.View style={[styles.item, rStyle]} />;
});

export default function TabTwoScreen() {
  const viewableItems = useSharedValue<ViewToken[]>([]);

  const onViewableItemsChanged = useCallback(({ viewableItems: vItems }: { viewableItems: ViewToken[] }) => {
    runOnJS(() => {
      viewableItems.value = vItems;
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item }) => <ListItem item={item} viewableItems={viewableItems} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    height: 80,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
});
