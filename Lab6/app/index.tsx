import React from "react";
import { View, Text, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, multiply, reset } from "./counterSlice";

const Counter = () => {
  const count = useSelector((state:any) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Giá trị đếm: {count}</Text>
      <Button title="Tăng" onPress={() => dispatch(increment())} />
      <Button title="Giảm" onPress={() => dispatch(decrement())} />
      <Button title="Nhân 2" onPress={() => dispatch(multiply(2))} />
      <Button title="Reset" onPress={() => dispatch(reset())} />
    </View>
  );
};

export default Counter;