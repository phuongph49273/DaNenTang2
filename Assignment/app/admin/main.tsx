import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { router } from 'expo-router';
import { API_CONFIG } from '../ApiService';

// Define types for our data
interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  isAdmin?: boolean;
  cart?: CartItem[];
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface Plant {
  id: string;
  name: string;
  price: string;
  image: string;
  lightPreference: string;
  quantity: number;
}

interface Pot {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface Accessory {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface Combo {
  id: string;
  name: string;
  image: string;
  subtitle: string;
}

interface Order {
  id: string;
  userId: string;
  customerInfo: {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
  };
  items: OrderItem[];
  totalAmount: string;
  shippingFee: string;
  finalAmount: string;
  paymentMethod: string;
  status: string;
  orderDate: string;
}

interface OrderItem extends CartItem {
  type: 'plant' | 'pot' | 'accessory';
}

interface DataStats {
  totalUsers: number;
  totalPlants: number;
  totalPots: number;
  totalAccessories: number;
  totalCombos: number;
  totalOrders: number;
  totalRevenue: string;
}

// Your json-server URL
const API_URL = `${API_CONFIG.baseURL}`;

const AdminHomeScreen = () => {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [pots, setPots] = useState<Pot[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DataStats>({
    totalUsers: 0,
    totalPlants: 0,
    totalPots: 0,
    totalAccessories: 0,
    totalCombos: 0,
    totalOrders: 0,
    totalRevenue: '0đ',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [usersResponse, plantsResponse, potsResponse, accessoriesResponse, combosResponse, ordersResponse] = 
        await Promise.all([
          axios.get(`${API_URL}/users`),
          axios.get(`${API_URL}/plants`),
          axios.get(`${API_URL}/pots`),
          axios.get(`${API_URL}/accessories`),
          axios.get(`${API_URL}/combos`),
          axios.get(`${API_URL}/orders`)
        ]);
      
      // Store the raw data
      setUsers(usersResponse.data);
      setPlants(plantsResponse.data);
      setPots(potsResponse.data);
      setAccessories(accessoriesResponse.data);
      setCombos(combosResponse.data);
      setOrders(ordersResponse.data);
      
      // Calculate total revenue from orders
      let totalRevenue = 0;
      ordersResponse.data.forEach((order: Order) => {
        // Extract numeric value from price string (e.g. "1.040.000đ" -> 1040000)
        const amount = parseFloat(order.finalAmount.replace(/\./g, '').replace('đ', ''));
        totalRevenue += amount;
      });
      
      // Format total revenue as string with Vietnamese đồng format
      const formattedRevenue = totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
      
      // Update stats
      setStats({
        totalUsers: usersResponse.data.length,
        totalPlants: plantsResponse.data.length,
        totalPots: potsResponse.data.length,
        totalAccessories: accessoriesResponse.data.length,
        totalCombos: combosResponse.data.length,
        totalOrders: ordersResponse.data.length,
        totalRevenue: formattedRevenue,
      });
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data from the server. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to navigate to different screens
  const navigateTo = (screen: string) => {
    switch(screen) {
      case 'PlantsManagement':
        router.push('/admin/PlantsScreen');
        break;
      case 'PotsManagement':
        router.push('/admin/PotsScreen');
        break;
      case 'AccessoriesManagement':
        router.push('/admin/AccessoriesScreen');
        break;
      case 'CombosManagement':
        router.push('/admin/CombosScreen');
        break;
      case 'Customers':
        router.push('/admin/UsersScreen');
        break;
      case 'Orders':
        router.push('/admin/OrdersScreen');
        break;
      case 'Settings':
        router.push('/admin/SettingsScreen');
        break;
      default:
        console.log(`Navigating to ${screen}`);
    }
  };

  // Simple category card component
  const CategoryCard = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={onPress}
    >
      <Text style={styles.categoryTitle}>{title}</Text>
    </TouchableOpacity>
  );

  // Card for order and user management
  const StatsCard = ({ title, count, onPress }: { title: string; count: number; onPress: () => void }) => (
    <TouchableOpacity 
      style={styles.statsCard}
      onPress={onPress}
    >
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsCount}>{count} {title === 'Đơn hàng' ? 'đơn' : 'khách hàng'}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a9f58" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAllData}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f0f0f0" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trang chủ</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.categoryGrid}>
          <View style={styles.categoryRow}>
            <CategoryCard 
              title="Cây" 
              onPress={() => navigateTo('PlantsManagement')}
            />
            <CategoryCard 
              title="Chậu" 
              onPress={() => navigateTo('PotsManagement')}
            />
          </View>
          
          <View style={styles.categoryRow}>
            <CategoryCard 
              title="Phụ kiện" 
              onPress={() => navigateTo('AccessoriesManagement')}
            />
            <CategoryCard 
              title="Combo" 
              onPress={() => navigateTo('CombosManagement')}
            />
          </View>
        </View>
        
        <StatsCard 
          title="Đơn hàng" 
          count={stats.totalOrders} 
          onPress={() => navigateTo('Orders')}
        />
        
        <StatsCard 
          title="Khách hàng" 
          count={stats.totalUsers}
          onPress={() => navigateTo('Customers')}
        />
      </ScrollView>
      
      <View style={styles.tabBar}>
              <TouchableOpacity style={[styles.tabItem, styles.activeTabItem]} onPress={() => navigateTo('Home')}>
                <Icon name="home" size={20} color="#777" />
                <Text style={styles.tabItemText}>Trang chủ</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.tabItem} onPress={() => navigateTo('Orders')}>
                <Icon name="shopping-bag" size={20} color="#777" />
                <Text style={styles.tabItemText}>Đơn hàng</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.tabItem} onPress={() => navigateTo('Customers')}>
                <Icon name="users" size={20} color="#777" />
                <Text style={styles.tabItemText}>Khách hàng</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.tabItem}>
                <Icon name="settings" size={20} color="#4a9f58" onPress={() => navigateTo('Settings')}/>
                <Text style={styles.activeTabItemText}>Cài đặt</Text>
              </TouchableOpacity>
            </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
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
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4a9f58',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16, // Increased rounded corner
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoryGrid: {
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#f0f0f0',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16, // Increased rounded corner
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statsCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 16, // Increased rounded corner
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  statsCount: {
    fontSize: 16,
    color: '#333',
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    height: 50,
    borderTopLeftRadius: 20, // Added rounded corners to tab bar
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTabItem: {
    borderTopWidth: 2,
    borderTopColor: '#4a9f58',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#000',
    backgroundColor: '#fff',
  },
  tabItemText: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  activeTabItemText: {
    fontSize: 12,
    color: '#4a9f58',
    fontWeight: 'bold',
    marginTop: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#777',
  },
  activeTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default AdminHomeScreen;