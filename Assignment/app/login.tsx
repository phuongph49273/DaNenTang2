import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { API_CONFIG } from './ApiService';

export default function DangNhap() {
  const [isRemembered, setIsRemembered] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

  interface User {
    id: number;
    email: string;
    phoneNumber: string;
    password: string;
  }

  useEffect(() => {
    loadLoginInfo();
  }, []);

  const loadLoginInfo = async () => {
    const savedEmailOrPhone = await AsyncStorage.getItem('savedEmailOrPhone');
    if (savedEmailOrPhone) {
      if (/^\d+$/.test(savedEmailOrPhone)) {
        setPhoneNumber(savedEmailOrPhone);
      } else {
        setEmail(savedEmailOrPhone);
      }
      setIsRemembered(true);
    }
  };

  const saveLoginInfo = async () => {
    if (isRemembered) {
      await AsyncStorage.setItem('savedEmailOrPhone', email || phoneNumber);
    } else {
      await AsyncStorage.removeItem('savedEmailOrPhone');
    }
  };

  const handleLogin = async () => {
    if (!email && !phoneNumber) {
      setLoginError('Vui lòng nhập email hoặc số điện thoại');
      return;
    }
    if (!password) {
      setLoginError('Vui lòng nhập mật khẩu');
      return;
    }

    setLoginError('');
    setIsLoading(true);

    if (email === 'admin@gmail.com' && password === '123456') {
      alert('Đăng nhập thành công với quyền Admin!');
      await saveLoginInfo();
      await AsyncStorage.setItem('userRole', 'admin');
      router.replace('/admin/main');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/users`);
      const users: User[] = await response.json();
      const foundUser = users.find(
        (user: User) =>
          (user.email === email || String(user.phoneNumber) === String(phoneNumber)) &&
          user.password === password
      );

      if (foundUser) {
        alert('Đăng nhập thành công!');
        await saveLoginInfo();
        await AsyncStorage.setItem('userId', String(foundUser.id));
        console.log(foundUser.id);
        router.replace('/main');
      } else {
        setLoginError('Thông tin đăng nhập không chính xác, vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setLoginError('Có lỗi xảy ra, vui lòng thử lại!');
    }

    setIsLoading(false);
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Ellipse 1.png')}
        style={styles.topImage}
        resizeMode="cover"
      />

      <View style={styles.loginContainer}>
        <Text style={styles.welcomeText}>Chào mừng bạn</Text>
        <Text style={styles.loginSubtext}>Đăng Nhập Tài Khoản</Text>

        <TextInput
          placeholder="Nhập email hoặc số điện thoại"
          style={[styles.input, emailFocused && styles.inputFocused]}
          value={email || phoneNumber} 
          onChangeText={(text) => {
            if (/^\d+$/.test(text)) {
              setPhoneNumber(text); 
              setEmail('');         
            } else {
              setEmail(text);       
              setPhoneNumber('');   
            }
          }}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          keyboardType="default"
          autoCapitalize="none"
        />
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

        
        <View style={styles.forgotPasswordContainer}>
            <View style={styles.rememberContainer}>
            <Checkbox
                value={isRemembered}
                onValueChange={setIsRemembered}
                color={isRemembered ? '#22AA22' : undefined}
            />
                <TouchableOpacity 
                    onPress={() => setIsRemembered(!isRemembered)}
                >
                    <Text style={styles.rememberText}>Nhớ tài khoản</Text>
                </TouchableOpacity>
            </View>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Hoặc</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialLoginContainer}>
          <TouchableOpacity>
            <Image
              source={require('../assets/images/google.png')}
              style={styles.socialLogo}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../assets/images/fb.webp')}
              style={styles.socialLogo}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Bạn không có tài khoản </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.createAccountText}>Tạo tài khoản</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topImage: {
    width: '100%',
    height: '40%',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 44,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginSubtext: {
    textAlign: 'center',
    color: 'black',
    marginBottom: 20,
    fontSize: 20,
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
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
    color: 'black',
  },
  forgotPasswordText: {
    color: 'green',
    fontWeight: 'bold',
  },
  
  loginButton: {
    backgroundColor: '#007537',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#cccccc', 
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: 'gray',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  socialLogo: {
    width: 40,
    height: 40,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: 'gray',
  },
  createAccountText: {
    color: 'green',
    fontWeight: 'bold',
  },
});