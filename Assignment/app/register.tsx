import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { API_CONFIG } from './ApiService';

const RegistrationScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegistration = async () => {
    try {
      const response = await fetch('http://192.168.16.196:3000/users');
      const users = await response.json();
  
      // Kiểm tra xem email hoặc số điện thoại đã tồn tại chưa
      const existingUser = users.find((user:any) => user.email === email || user.phoneNumber === phone);
      if (existingUser) {
        setLoginError('Email hoặc số điện thoại đã tồn tại!');
        return;
      }
      if (!name || !email || !phone || !password) {
        setLoginError('Vui lòng điền đầy đủ thông tin.');
        return;
      }
    
      // Xóa lỗi nếu đã nhập đủ thông tin
      setLoginError('');
  
      // Tạo user mới với giỏ hàng mặc định (cart rỗng)
      const newUser = {
        id: Math.random().toString(16).slice(2), // Tạo ID ngẫu nhiên
        fullName: name,
        email,
        phoneNumber: phone,
        password,
        cart: [] 
      };
  
      const registerResponse = await fetch(`${API_CONFIG.baseURL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
  
      if (registerResponse.ok) {
        alert('Đăng ký thành công!');
        router.push('/login'); // Chuyển hướng đến trang đăng nhập
      } else {
        alert('Đăng ký thất bại, vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };
  

  const handleLogin = () => {
      // Navigate to Registration Screen
      router.push('/login')
    }; 
  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../assets/images/Ellipse 2.png')} 
        style={styles.backgroundImage} 
        resizeMode="cover"
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Đăng Ký</Text>
            <Text style={styles.subtitle}>Tạo tài khoản</Text>

            {/* Name Input */}
            <TextInput
              style={[styles.input, nameFocused && styles.inputFocused]}
              placeholder="Họ tên"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#888"
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              autoCapitalize="none"
            />

            {/* Email Input */}
            <TextInput
              style={[styles.input, emailFocused && styles.inputFocused]}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#888"
              keyboardType="email-address"
              onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
            />

            {/* Phone Input */}
            <TextInput
              style={[styles.input, phoneFocused && styles.inputFocused]}
              placeholder="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              onFocus={() => setPhoneFocused(true)}
              onBlur={() => setPhoneFocused(false)}
              autoCapitalize="none"
            />

            {/* Password Input */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                placeholder="Mật khẩu"
                secureTextEntry={!showPassword}
                style={[
                  styles.input,
                  styles.passwordInput,
                  passwordFocused && styles.inputFocused
                ]}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

            {/* Terms and Conditions */}
            <Text style={styles.termsText}>
              Để đăng ký tài khoản, bạn đồng ý với{' '}
              <Text style={styles.linkText}>Terms & Conditions</Text>{' '}
              and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>

            {/* Registration Button */}
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleRegistration}
            >
              <Text style={styles.registerButtonText}>Đăng Ký</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image 
                  source={require('@/assets/images/google.png')} 
                  style={styles.socialIcon} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image 
                  source={require('@/assets/images/fb.webp')} 
                  style={styles.socialIcon} 
                />
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Tôi đã có tài khoản </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: "30%",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 30,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  inputFocused: {
    borderColor: '#55dafd',
    borderWidth: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  passwordInput: {
    paddingRight: 40, 
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 15,
  },
  linkText: {
    color: '#22AA22',
  },
  registerButton: {
    backgroundColor: '#22AA22',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#888',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 30,
    padding: 10,
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#888',
  },
  loginLink: {
    color: '#22AA22',
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;