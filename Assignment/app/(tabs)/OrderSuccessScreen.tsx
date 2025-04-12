import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '../ApiService';

// Định nghĩa interfaces
interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  type?: string;
}

interface Order {
  id: string;
  userId: string;
  customerInfo: {
    fullName: string;
    email: string;
    address: string;
    phoneNumber: string;
  };
  items: OrderItem[];
  totalAmount: string;
  shippingFee: string;
  finalAmount: string;
  paymentMethod: string;
  status: string;
  orderDate: string;
}

export default function OrderSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const orderId = params.orderId as string;
  const API_URL = `${API_CONFIG.baseURL}`;

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      
      // Nếu có orderId từ params, lấy thông tin đơn hàng từ API
      if (orderId) {
        const response = await axios.get(`${API_URL}/orders/${orderId}`);
        setOrder(response.data);
      } else {
        // Nếu không có orderId, lấy thông tin người dùng và đơn hàng mới nhất
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          setError('Không tìm thấy thông tin người dùng');
          setLoading(false);
          return;
        }
        
        const ordersResponse = await axios.get(`${API_URL}/orders?userId=${userId}&_sort=orderDate&_order=desc&_limit=1`);
        if (ordersResponse.data && ordersResponse.data.length > 0) {
          setOrder(ordersResponse.data[0]);
        } else {
          setError('Không tìm thấy đơn hàng');
        }
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Có lỗi xảy ra khi tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const getExpectedDeliveryDate = () => {
    if (!order) return '';
    
    const orderDate = new Date(order.orderDate);
    const deliveryDate = new Date(orderDate);
    
    // Thêm 3-5 ngày cho giao hàng tiêu chuẩn
    if (order.shippingFee.includes('15')) {
      deliveryDate.setDate(orderDate.getDate() + 5);
      const endDate = new Date(orderDate);
      endDate.setDate(orderDate.getDate() + 7);
      return `(Dự kiến giao hàng ${deliveryDate.getDate()}-${endDate.getDate()}/${deliveryDate.getMonth() + 1})`;
    } else {
      // Thêm 2-4 ngày cho giao hàng nhanh
      deliveryDate.setDate(orderDate.getDate() + 4);
      const endDate = new Date(orderDate);
      endDate.setDate(orderDate.getDate() + 6);
      return `(Dự kiến giao hàng ${deliveryDate.getDate()}-${endDate.getDate()}/${deliveryDate.getMonth() + 1})`;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00843D" />
        <Text style={styles.loadingText}>Đang tải thông tin đơn hàng...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/(tabs)/main')}
        >
          <Text style={styles.homeButtonText}>Quay về Trang chủ</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy thông tin đơn hàng</Text>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/(tabs)/main')}
        >
          <Text style={styles.homeButtonText}>Quay về Trang chủ</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THÔNG BÁO</Text>
        <View style={styles.emptySpace}></View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>Bạn đã đặt hàng thành công</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{order.customerInfo.fullName}</Text>
            <Text style={styles.infoText}>{order.customerInfo.email}</Text>
            <Text style={styles.infoText}>{order.customerInfo.address}</Text>
            <Text style={styles.infoText}>{order.customerInfo.phoneNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {order.shippingFee.includes('15') 
                ? 'Giao hàng Nhanh - 15.000đ' 
                : 'Giao hàng COD - 20.000đ'}
            </Text>
            <Text style={styles.infoSubtext}>{getExpectedDeliveryDate()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>{order.paymentMethod}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng đã chọn</Text>
          {order.items.map((item, index) => (
            <View key={item.id || index} style={styles.orderItem}>
              <Image 
                source={{ uri: item.image }} 
                style={styles.productImage} 
                resizeMode="cover"
              />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  {item.price} x {item.quantity}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Đã thanh toán</Text>
          <Text style={styles.totalValue}>{order.finalAmount}</Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/(tabs)/main')}
        >
          <Text style={styles.homeButtonText}>Quay về Trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 30,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptySpace: {
    width: 20,
  },
  contentContainer: {
    flex: 1,
  },
  successMessageContainer: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  successMessage: {
    fontSize: 16,
    color: '#00843D',
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoContainer: {
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderItem: {
    flexDirection: 'row',
    marginTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 12,
    color: '#666',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00843D',
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  homeButton: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
    borderRadius: 4,
  },
  homeButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  }
});