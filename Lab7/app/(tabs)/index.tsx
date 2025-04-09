import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig'; 

const AuthScreen = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
  });


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    
    return unsubscribe;
  }, [auth, initializing]);

  // Hàm đăng ký tài khoản mới với email và password
  const onSignUpWithPassword = async () => {
    if (!userInput.email || !userInput.password) {
      Alert.alert('Thông báo', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      // Sử dụng Firebase Authentication để tạo tài khoản mới
      await createUserWithEmailAndPassword(
        auth,
        userInput.email, 
        userInput.password
      );
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Lỗi', 'Email đã được sử dụng!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Lỗi', 'Email không hợp lệ!');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Lỗi', 'Mật khẩu quá yếu!');
      } else {
        Alert.alert('Lỗi', error.message);
      }
    }
  };

  // Hàm đăng nhập với email và password
  const onSignInWithPassword = async () => {
    if (!userInput.email || !userInput.password) {
      Alert.alert('Thông báo', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      // Sử dụng Firebase Authentication để đăng nhập
      await signInWithEmailAndPassword(
        auth,
        userInput.email, 
        userInput.password
      );
      Alert.alert('Thành công', 'Đăng nhập thành công!');
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        Alert.alert('Lỗi', 'Email không hợp lệ!');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        Alert.alert('Lỗi', 'Email hoặc mật khẩu không đúng!');
      } else {
        Alert.alert('Lỗi', error.message);
      }
    }
  };

  // Hàm đăng xuất
  const onSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Thành công', 'Đăng xuất thành công!');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  // Hiển thị màn hình loading khi đang khởi tạo
  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // Nếu user đã đăng nhập, hiển thị thông tin và nút đăng xuất
  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chào mừng</Text>
        <Text style={styles.userInfo}>Email: {user.email}</Text>
        <TouchableOpacity style={styles.buttonLogout} onPress={onSignOut}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Nếu user chưa đăng nhập, hiển thị màn hình đăng nhập/đăng ký
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập / Đăng ký</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={userInput.email}
          onChangeText={(text) => setUserInput({ ...userInput, email: text })}
          placeholder="Nhập email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mật khẩu:</Text>
        <TextInput
          style={styles.input}
          value={userInput.password}
          onChangeText={(text) => setUserInput({ ...userInput, password: text })}
          placeholder="Nhập mật khẩu"
          secureTextEntry
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onSignInWithPassword}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={onSignUpWithPassword}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  registerButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  buttonLogout: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
  }
});

export default AuthScreen;