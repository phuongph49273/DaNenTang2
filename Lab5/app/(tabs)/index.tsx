import { configureStore } from "@reduxjs/toolkit";
import { Text, View } from "react-native";

export const store = configureStore({
  reducer: {}
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispath = typeof store.dispatch;

export default function HomeScreen() {
  return (
    <View>
      <Text>Welcome to the Home Screen</Text>
    </View>
  );
}