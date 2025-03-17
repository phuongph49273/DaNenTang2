import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { useState, useMemo, createContext } from 'react';

export const ThemeContext = createContext('light');

export default function UseMemoScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState<{ name: string; price: number }[]>([]);

  const handleSubmit = () => {
    if (name.trim() && price.trim()) {
      setProducts([...products, { name, price: Number(price) }]);
      setName('');
      setPrice('');
    }
  };

  const total = useMemo(() => {
    console.log('Tính toán lại tổng giá...');
    return products.reduce((acc, prod) => acc + prod.price, 0);
  }, [products]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Thêm" onPress={handleSubmit} />
      <Text style={styles.sumPrice}>Tổng giá: {total}</Text>

      {products.map((product, index) => (
        <Text key={index}>
          {product.name} - {product.price}
        </Text>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 40,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  sumPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
