import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { API_CONFIG } from '../ApiService'; // Đảm bảo đường dẫn phù hợp với dự án của bạn

const API_URL = API_CONFIG ? API_CONFIG.baseURL : 'http://192.168.16.124:3000';

// Define avatar options
const AVATAR_OPTIONS = [
    'https://anhcute.net/wp-content/uploads/2024/12/anh-dong-vat-anime-chibi-1.jpeg',
    'https://anhcute.net/wp-content/uploads/2024/12/anh-dong-vat-anime-cute-2.jpg',
    'https://anhcute.net/wp-content/uploads/2024/12/anh-dong-vat-anime-1.jpg',
    'https://anhcute.net/wp-content/uploads/2024/12/anh-dong-vat-hoat-hinh-1.jpg',
    'https://anhcute.net/wp-content/uploads/2024/12/anh-nen-dong-vat-anime-1.jpeg',
    'https://anhcute.net/wp-content/uploads/2024/12/anh-nen-dong-vat-cute-1.jpg',
];

// Định nghĩa key cho event bus
const PROFILE_UPDATED_EVENT = 'profile_updated';

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    avatar: '',
  });
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  useEffect(() => {
    fetchUserData();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert("Quyền bị từ chối", "Bạn cần cấp quyền Camera và Thư viện để sử dụng đầy đủ tính năng.");
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
        router.push('/login');
        return;
      }
      
      const response = await axios.get(`${API_URL}/users/${userId}`);
      const user = response.data;
      
      setUserData({
        id: user.id,
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        avatar: user.avatar || '', // Don't set default avatar here
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userData.fullName || !userData.email || !userData.phoneNumber) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin cần thiết');
      return;
    }
    
    try {
      setSaving(true);
      await axios.patch(`${API_URL}/users/${userData.id}`, {
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        avatar: userData.avatar
      });

      // Lưu trạng thái đã cập nhật vào AsyncStorage
      await AsyncStorage.setItem(PROFILE_UPDATED_EVENT, 'true');
      
      Alert.alert('Thành công', 'Thông tin đã được cập nhật');
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    try {
      // Request permission first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Vui lòng cấp quyền truy cập thư viện ảnh để chọn ảnh đại diện');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // In a real app, you would upload this to a server and get back a URL
        // For this example, we'll just use the local URI
        setUserData(prev => ({
          ...prev,
          avatar: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const openCamera = async () => {
    try {
      // Request camera permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Vui lòng cấp quyền sử dụng camera để chụp ảnh đại diện');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUserData(prev => ({
          ...prev,
          avatar: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Lỗi', 'Không thể chụp ảnh');
    }
  };

  const selectAvatar = (avatarUrl: any) => {
    setUserData(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
    setShowAvatarOptions(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00843D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CHỈNH SỬA THÔNG TIN</Text>
        <View style={styles.emptySpace}></View>
      </View>

      <ScrollView style={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => setShowAvatarOptions(true)}>
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.placeholderText}>
                  {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Thông tin sẽ được lưu cho lần mua kế tiếp.
          Bấm vào thông tin chi tiết để chỉnh sửa.
        </Text>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={userData.fullName}
              onChangeText={(text) => setUserData(prev => ({ ...prev, fullName: text }))}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={userData.email}
              onChangeText={(text) => setUserData(prev => ({ ...prev, email: text }))}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={userData.address}
              onChangeText={(text) => setUserData(prev => ({ ...prev, address: text }))}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={userData.phoneNumber}
              onChangeText={(text) => setUserData(prev => ({ ...prev, phoneNumber: text }))}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSaveProfile}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.saveButtonText}>LƯU THÔNG TIN</Text>
        )}
      </TouchableOpacity>

      {/* Avatar Selection Modal */}
      <Modal
        visible={showAvatarOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAvatarOptions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ảnh đại diện</Text>
            
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((avatar, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.avatarOption}
                  onPress={() => selectAvatar(avatar)}
                >
                  <Image source={{ uri: avatar }} style={styles.avatarOptionImage} />
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setShowAvatarOptions(false);
                openCamera();
              }}
            >
              <Text style={styles.actionButtonText}>📷 Chụp ảnh</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                setShowAvatarOptions(false);
                pickImage();
              }}
            >
              <Text style={styles.actionButtonText}>📂 Chọn ảnh từ thư viện</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowAvatarOptions(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 36,
    color: '#666',
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 32,
    marginBottom: 24,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    paddingVertical: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#00843D',
    padding: 16,
    alignItems: 'center',
    margin: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarOption: {
    width: '30%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  avatarOptionImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
});