import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../ApiService';

import axios from 'axios';
import { router } from 'expo-router';

type RootStackParamList = {
  login: undefined;
  Profile: undefined; 
};

type User = {
  id: string;
  fullName: string;
  email: string;
  address: string;
  phoneNumber: string;
  avatar: string;
};

// Định nghĩa key cho event bus (cần giống với key trong EditProfileScreen)
const PROFILE_UPDATED_EVENT = 'profile_updated';

export default function Profile() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Profile'>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();
  const [user, setUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Dùng để kích hoạt việc làm mới

  // Sử dụng useFocusEffect để kiểm tra khi màn hình được focus lại
  useFocusEffect(
    React.useCallback(() => {
      checkForUpdates();
      return () => {
        // clean up nếu có
      };
    }, [])
  );
  

  // Kiểm tra khi màn hình được tập trung
  useFocusEffect(
    React.useCallback(() => {
      checkForUpdates();
      return () => {
        // Clean up nếu cần
      };
    }, [])
  );

  // Kiểm tra xem có cập nhật nào không khi màn hình được focus
  const checkForUpdates = async () => {
    try {
      const isUpdated = await AsyncStorage.getItem(PROFILE_UPDATED_EVENT);
      
      if (isUpdated === 'true') {
        // Nếu có cập nhật, tải lại dữ liệu người dùng
        fetchUserProfile();
        // Xóa flag cập nhật
        await AsyncStorage.removeItem(PROFILE_UPDATED_EVENT);
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [refreshKey]);

  const fetchUserProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const response = await axios.get(`${API_CONFIG.baseURL}/users/${userId}`);
      const userData = response.data;
      
      setUser({
        id: userData.id,
        fullName: userData.fullName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.fullName.replace(' ', '+')}`,
      });
    } catch (error) {
      console.error('Lỗi tải thông tin người dùng:', error);
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'login' }],
    });
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Đang tải thông tin...</Text>
      </View>
    );
  }

  const handleMenuPress = (option: string) => {
    switch(option) {
      case 'general':
        break;
      case 'edit_info':
        router.push('/(tabs)/EditInfo')
        break;
      case 'gardening':
        Alert.alert('Cẩm nang trồng cây', 'Chức năng đang được phát triển');
        break;
      case 'transaction_history':
        router.push('/(tabs)/OrderHistoryScreen')
        break;
      case 'qa':
        Alert.alert('Q&A', 'Chức năng đang được phát triển');
        break;
      case 'privacy_security':
        Alert.alert('Bảo mật và điều khoản', 'Chức năng đang được phát triển');
        break;
      case 'terms_conditions':
        Alert.alert('Điều khoản và điều kiện', 'Chức năng đang được phát triển');
        break;
      case 'privacy':
        Alert.alert('Chính sách quyền riêng tư', 'Chức năng đang được phát triển');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.Textheader}>PROFILE</Text>
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: `${user.avatar}` }} 
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('general')}>
          <Text style={styles.TextItem}>Chung</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem1} onPress={() => handleMenuPress('edit_info')}>
          <Text>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem1} onPress={() => handleMenuPress('gardening')}>
          <Text>Cẩm nang trồng cây</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem1} onPress={() => handleMenuPress('transaction_history')}>
          <Text>Lịch sử giao dịch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem1} onPress={() => handleMenuPress('qa')}>
          <Text >Q&A</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('privacy_security')}>
          <Text style={styles.TextItem}>Bảo mật và Điều khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem1} onPress={() => handleMenuPress('terms_conditions')}> 
          <Text>Điều khoản và điều kiện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem1} onPress={() => handleMenuPress('privacy')}>
          <Text>Chính sách quyền riêng tư</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutMenuItem]} 
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  Textheader: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 5,
    borderRadius: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: 'white',
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItem1: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoutMenuItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold',
  },
  TextItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
});