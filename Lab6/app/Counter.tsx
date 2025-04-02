import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, multiply, reset } from "./counterSlice";
import { View, Button, Text } from "react-native";

const Counter = () => {
  const count = useSelector((state: any) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <View style={{marginTop: 50}}>
      <Text style={{textAlign: 'center',fontSize: 20}}>Giá trị đếm: {count}</Text>
      <Button title="Tăng" onPress={() => dispatch(increment())} />
      <Button title="Giảm" onPress={() => dispatch(decrement())} />
      <Button title="Nhân 2" onPress={() => dispatch(multiply(2))} />
      <Button title="Reset" onPress={() => dispatch(reset())} />
    </View>
  );
};

export default Counter;
