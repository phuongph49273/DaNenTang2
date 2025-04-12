import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { API_CONFIG } from '../ApiService';

// Define TypeScript interfaces for data structure
interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  type?: string;
}

interface CustomerInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface Order {
  id: string;
  userId: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  totalAmount: string;
  shippingFee: string;
  finalAmount: string;
  paymentMethod: string;
  status: string;
  orderDate: string;
}

interface GroupedOrders {
  [date: string]: Order[];
}

const OrderHistoryScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      const response = await fetch(`${API_CONFIG.baseURL}/orders?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Order[] = await response.json();
      
      // Sort orders by date (newest first)
      const sortedOrders = data.sort((a, b) => 
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Format: Thứ ..., dd/mm/yyyy
    const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    
    return `${dayOfWeek}, ${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Đã hoàn thành':
        return '#10b981'; // green
      case 'Đang xử lý':
        return '#3b82f6'; // blue
      case 'Đã huỷ đơn hàng':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'Đã hoàn thành':
        return 'Đặt hàng thành công';
      case 'Đang xử lý':
        return 'Đang xử lý';
      case 'Đã huỷ đơn hàng':
        return 'Đã huỷ đơn hàng';
      default:
        return status;
    }
  };

  // Group orders by date
  const groupOrdersByDate = (): GroupedOrders => {
    return orders.reduce((groups: GroupedOrders, order) => {
      const dateKey = new Date(order.orderDate).toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
      return groups;
    }, {});
  };

  // Convert grouped orders to a format suitable for FlatList
  const prepareData = () => {
    const groupedOrders = groupOrdersByDate();
    const data = Object.entries(groupedOrders).map(([date, orders]) => ({
      date,
      formattedDate: formatDate(date),
      orders
    }));

    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderRow}>
          {item.items.length > 0 && (
            <Image 
              source={{ uri: item.items[0].image }} 
              style={styles.productImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.orderDetails}>
            <View style={styles.orderHeaderRow}>
              <Text style={[
                styles.orderStatus, 
                { color: getStatusColor(item.status) }
              ]}>
                {getStatusText(item.status)}
              </Text>
              <Text style={styles.productCount}>{item.items.length > 1 ? `${item.items.length} sản phẩm` : '1 sản phẩm'}</Text>
            </View>
            <Text style={styles.productName}>{item.items[0].name}</Text>
            <Text style={styles.lightText}>{item.items[0].type === 'plant' ? 'Ưa bóng' : ''}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDateHeader = ({ item }: { item: { date: string, formattedDate: string, orders: Order[] } }) => (
    <View style={styles.dateHeader}>
      <Text style={styles.dateText}>{item.formattedDate}</Text>
    </View>
  );

  const renderOrdersForDate = ({ item }: { item: { date: string, formattedDate: string, orders: Order[] } }) => (
    <View>
      {renderDateHeader({ item })}
      <FlatList
        data={item.orders}
        keyExtractor={(order) => order.id}
        renderItem={renderOrderItem}
        scrollEnabled={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>CHỈNH SỬA THÔNG TIN</Text>
            <View style={styles.emptySpace}></View>
        </View>

      {/* Orders list */}
      <FlatList
        data={prepareData()}
        keyExtractor={(item) => item.date}
        renderItem={renderOrdersForDate}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  listContainer: {
    paddingBottom: 20,
  },
  dateHeader: {
    backgroundColor: 'white',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 4,
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
  },
  orderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderStatus: {
    fontWeight: '500',
    fontSize: 14,
  },
  productCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  lightText: {
    fontSize: 12,
    color: '#6b7280',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
});

export default OrderHistoryScreen;