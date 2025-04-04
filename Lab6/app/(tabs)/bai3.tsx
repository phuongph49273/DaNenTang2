import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignupMutation } from '../api';
// Định nghĩa interface cho dữ liệu form

interface FormData {
  name: string;
  age: string;
  email: string;
  password: string;
  gender: string;
}

const Explore = () => {
  // State cho dữ liệu form
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    email: '',
    password: '',
    gender: 'male',
  });

  // State cho lỗi validation
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [signup, { isLoading, isError, error }] = useSignupMutation();
  // Hàm xử lý thay đổi giá trị input
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Xóa lỗi khi người dùng nhập lại
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Hàm validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Không được để trống tên';
    }

    // Validate age
    if (!formData.age.trim()) {
      newErrors.age = 'Không được để trống tuổi';
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = 'Tuổi phải nhập là số và lớn hơn 0';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Không được để trống email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nhập đúng form email';
    }

    // Validate password
    if (!formData.password.trim()) {
      newErrors.password = 'Không được để trống mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải từ 6 kí tự trở lên';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý submit form
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const result = await signup(formData).unwrap();
        console.log('Signup success:', result);
        Alert.alert(
          'Success',
          'Đã gửi biểu mẫu thành công!',
          [{ text: 'OK' }]
        );


        setFormData({
          name: '',
          age: '',
          email: '',
          password: '',
          gender: 'male',
        });
      } catch (err) {
        console.error('Error during signup:', err);
        Alert.alert(
          'Error',
          'Failed to register. Please try again later.',
          [{ text: 'OK' }]
        );
      }
    }
    else {
      Alert.alert(
        'Error',
        'Vui lòng điền chính xác tất cả các trường bắt buộc!',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Form Builder Basic Demo</Text>

          <View style={styles.row}>
            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>Name<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder="Enter name"
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            <View style={styles.inputGroupHalf}>
              <Text style={styles.label}>User's Age<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={[styles.input, errors.age ? styles.inputError : null]}
                value={formData.age}
                onChangeText={(value) => handleChange('age', value)}
                placeholder="Enter age"
                keyboardType="numeric"
              />
              {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password<Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.password ? styles.inputError : null]}
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              placeholder="Enter password"
              secureTextEntry
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender<Text style={styles.required}>*</Text></Text>
            <View style={[styles.pickerContainer, Platform.OS === 'ios' ? styles.iosPicker : {}]}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleChange('gender', value)}
                style={styles.picker}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  inputGroupHalf: {
    width: '48%',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
    fontWeight: '500',
  },
  required: {
    color: 'red',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  iosPicker: {
    marginTop: 8,
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#00bcd4',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Explore;