import { Image, StyleSheet, Platform, Button, Text, View, SafeAreaView } from 'react-native';
import { memo, useEffect, useRef, useState } from 'react';


export default function HomeScreen() {
  const [count, setCount] = useState(0);
  const prevCount = useRef(count);

  useEffect(() => {
    prevCount.current = count;
  }, [count]);

  useEffect(() => {
    console.log('useEffect này chạy mỗi lần component render');
  });
  useEffect(() => {
    console.log('useEffect chỉ chạy lần đầu tiên khi component render');
  }, []);
  useEffect(() => {
    console.log('useEffect khởi chạy khi count thay đổi giá trị');
  }, [count]);
  const handleIncrease = () => {
    setCount(count + 1);
  };
  console.log(
    'prevCount = ', prevCount.current, 'count = ', count
    );

  const [inforUser, setInforUser] = useState({
    name: 'Nguyen Van A',
    age: 20,
    
    });
  const updateInforUser = () => {
    setInforUser({    
      ...inforUser,
      age: 21,
      });  
    };
  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>

        <Text style={styles.textCount}>{count}</Text>
        <Text style={styles.textCount}>Name: {inforUser.name}   Age: {inforUser.age}</Text>

        <Button title="Tăng" onPress={handleIncrease} />
        <Button title="Tăng Age" onPress={updateInforUser} />

        <UseMemoCountScreen />
      </View>
    </SafeAreaView>

  );
}

function UseMemoCountScreen() {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  const handleIncrease = () => {
    setCount(prev => prev + 1);
  };

  const handleIncrease2 = () => {
    setCount2(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textCount}>
        {count} - {count2}
      </Text>

      <Button title="Tăng state 1" onPress={handleIncrease} />

      <View style={styles.separate} />

      <Button title="Tăng state 2" onPress={handleIncrease2} />

      <Content count={count} />
    </View>
  );
}

interface ContentProps {
  count: number;
}

export const Content = memo(({ count }: ContentProps) => {
  console.log('Re-render Content, count =', count);

  return (
    <View style={styles.container}>
      <Text style={styles.textCount}>Lớp học Đa Nền Tảng 2</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 10,
    marginTop: 40
  },
  textCount: {
    textAlign: 'center',
    fontSize: 20
  },
  separate: {
    height: 20,
  },
});
