import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '../ApiService';

interface PaymentDetails {
  customerInfo: {
    fullName: string;
    email: string;
    address: string;
    phoneNumber: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  shippingFee: string;
  totalAmount: string;
  finalAmount: string;
}

export default function PaymentScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    customerInfo: {
      fullName: '',
      email: '',
      address: '',
      phoneNumber: '',
    },
    shippingMethod: 'standard',
    paymentMethod: 'card',
    shippingFee: '15.000đ',
    totalAmount: '0đ',
    finalAmount: '0đ'
  });

  // API endpoint
  const API_URL = `${API_CONFIG.baseURL}`;

  useEffect(() => {
    fetchUserInfo();
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems, shippingMethod]);

  useEffect(() => {
    const { fullName, email, address, phoneNumber } = paymentDetails.customerInfo;
    setIsFormComplete(
      Boolean(fullName) && Boolean(email) && Boolean(address) && Boolean(phoneNumber)
    );
  }, [paymentDetails.customerInfo]);

  const fetchUserInfo = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.get(`${API_URL}/users/${userId}`);
      const user = response.data;

      setPaymentDetails(prev => ({
        ...prev,
        customerInfo: {
          fullName: user.fullName || '',
          email: user.email || '',
          address: user.address || '',
          phoneNumber: user.phoneNumber || '',
        }
      }));
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const getUserId = async () => {
    return await AsyncStorage.getItem('userId');
    };

  const fetchCartItems = async () => {
    try {
        const userId = await getUserId();
        if (!userId) return;
        
        const response = await axios.get(`${API_URL}/users/${userId}`);
        setCartItems(response.data.cart || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      // Set empty cart on error
      setCartItems([]);
    }
    
  };

  const calculateTotalPrice = () => {
    const itemsTotal = cartItems.reduce((sum, item:any) => {
      const price = parseFloat(item.price.replace(/\./g, '').replace('đ', ''));
      return sum + (price * item.quantity);
    }, 0);
    
    setCartTotal(itemsTotal);
    
    const shippingFee = shippingMethod === 'standard' ? 15000 : 20000;
    const finalTotal = itemsTotal + shippingFee;
    
    setPaymentDetails(prev => ({
      ...prev,
      shippingFee: `${shippingFee.toLocaleString()}đ`,
      totalAmount: `${itemsTotal.toLocaleString()}đ`,
      finalAmount: `${finalTotal.toLocaleString()}đ`,
      shippingMethod: shippingMethod
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value
      }
    }));
  };

  const handleShippingMethodChange = (method: string) => {
    setShippingMethod(method);
    setPaymentDetails(prev => ({
      ...prev,
      shippingMethod: method,
      shippingFee: method === 'standard' ? '15.000đ' : '20.000đ'
    }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setPaymentDetails(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handlePlaceOrder = () => {
    const { fullName, email, address, phoneNumber } = paymentDetails.customerInfo;
    if (!fullName || !email || !address || !phoneNumber) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    // Show confirmation dialog instead of directly placing order
    setShowConfirmDialog(true);
  };
  
  // Add new function to actually place the order
  const confirmOrder = async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục');
        return;
      }
  
      // Create order object
      const order = {
        userId,
        customerInfo: paymentDetails.customerInfo,
        items: cartItems,
        totalAmount: paymentDetails.totalAmount,
        shippingFee: paymentDetails.shippingFee,
        finalAmount: paymentDetails.finalAmount,
        paymentMethod: paymentMethod === 'card' ? 'THE VISA/MASTERCARD' : 'THE ATM',
        status: 'Đang xử lý',
        orderDate: new Date().toISOString()
      };
  
      // Send order to server
      const response = await axios.post(`${API_URL}/orders`, order);
      const orderId = response.data.id || 'temp-id'; // Use the returned ID or a temporary one
  
      // Clear cart
      await axios.patch(`${API_URL}/users/${userId}`, { cart: [] });
  
      setShowConfirmDialog(false);
      Alert.alert('Thành công', 'Đặt hàng thành công!', [
        {
          text: 'OK',
          onPress: () => {
            router.push({
              pathname: '/(tabs)/OrderSuccessScreen',
              params: { orderId: orderId } 
            });
          }
        }
      ]);
    } catch (error) {
      console.error('Error placing order:', error);
      setShowConfirmDialog(false);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THANH TOÁN</Text>
        <View style={styles.emptySpace}></View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={paymentDetails.customerInfo.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={paymentDetails.customerInfo.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={paymentDetails.customerInfo.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={paymentDetails.customerInfo.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
          <TouchableOpacity 
            style={[styles.optionContainer, shippingMethod === 'standard' && styles.selectedOption]}
            onPress={() => handleShippingMethodChange('standard')}
          >
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Giao hàng Nhanh - 15.000đ</Text>
              <Text style={styles.optionSubtext}>Dự kiến giao hàng 5-7/9</Text>
            </View>
            {shippingMethod === 'standard' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionContainer, shippingMethod === 'cod' && styles.selectedOption]}
            onPress={() => handleShippingMethodChange('cod')}
          >
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Giao hàng COD - 20.000đ</Text>
              <Text style={styles.optionSubtext}>Dự kiến giao hàng 4-6/9</Text>
            </View>
            {shippingMethod === 'cod' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
          <TouchableOpacity 
            style={[styles.optionContainer, paymentMethod === 'card' && styles.selectedOption]}
            onPress={() => handlePaymentMethodChange('card')}
          >
            <Text style={styles.optionTitle}>Thẻ VISA/MASTERCARD</Text>
            {paymentMethod === 'card' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.optionContainer, paymentMethod === 'atm' && styles.selectedOption]}
            onPress={() => handlePaymentMethodChange('atm')}
          >
            <Text style={styles.optionTitle}>Thẻ ATM</Text>
            {paymentMethod === 'atm' && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{paymentDetails.totalAmount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>{paymentDetails.shippingFee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{paymentDetails.finalAmount}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[
            styles.checkoutButton, 
            isFormComplete ? styles.activeCheckoutButton : styles.inactiveCheckoutButton
        ]}
        onPress={handlePlaceOrder}
        >
        <Text style={styles.checkoutButtonText}>TIẾP TỤC</Text>
      </TouchableOpacity>
      {showConfirmDialog && (
  <View style={styles.overlayContainer}>
    <View style={styles.dialogContainer}>
      <Text style={styles.dialogTitle}>Xác nhận thanh toán?</Text>
      <View style={styles.dialogButtonContainer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={confirmOrder}
        >
          <Text style={styles.confirmButtonText}>Đồng ý</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => setShowConfirmDialog(false)}
        >
          <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)}
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
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    paddingVertical: 8,
    fontSize: 14,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f9f9f9',
  },
  activeCheckoutButton: {
    backgroundColor: '#00843D', 
  },
  inactiveCheckoutButton: {
    backgroundColor: '#888',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
  },
  optionSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  checkmark: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#888',
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  dialogTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dialogButtonContainer: {
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#00843D',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
  },
});