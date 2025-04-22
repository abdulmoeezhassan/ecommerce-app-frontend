import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import axios from 'axios';

const API_BASE_URL = 'https://ecommerce-app-backend-indol.vercel.app/api/';

export default function ProfileScreen() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      mobileNumber: '',
      cnic: '',
      businessName: '',
      website: '',
      businessCategory: '',
      address: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const getSingleUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const response = await axios.get(`${API_BASE_URL}users/get-single-user/${userId}`);
      if (response.status !== 200) {
        throw new Error(response?.data?.message || 'Error during fetching data');
      }

      const user = response.data.data;

      setValue('mobileNumber', user?.mobileNumber || '');
      setValue('cnic', user?.cnic || '');
      setValue('businessName', user?.businessName || '');
      setValue('website', user?.website || '');
      setValue('businessCategory', user?.businessCategory || '');
        setValue('address', user?.address || '');
    } catch (error) {
      console.error('Error fetching user:', error.message);
    }
  };

  useEffect(() => {
    getSingleUser();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('user_id');
      const token = await AsyncStorage.getItem('accessToken');

      const response = await fetch(`${API_BASE_URL}users/update-user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Error updating profile');
      }

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Profile updated successfully',
      });

      setLoading(false);
      router.push('/');
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Something went wrong',
      });
      console.error('Update error:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complete Business Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
        <Controller
            control={control}
            name="businessName"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={styles.input}
                placeholder="Business Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="website"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={styles.input}
                placeholder="Website"
                keyboardType="url"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="businessCategory"
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={styles.input}
                placeholder="Business Category"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name="mobileNumber"
            rules={{ required: 'mobileNumber is required' }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, errors.mobileNumber && styles.inputError]}
                placeholder="mobileNumber"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.mobileNumber && <Text style={styles.errorText}>{errors.mobileNumber.message}</Text>}

          <Controller
            control={control}
            name="cnic"
            rules={{ required: 'CNIC is required' }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, errors.cnic && styles.inputError]}
                placeholder="CNIC"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.cnic && <Text style={styles.errorText}>{errors.cnic.message}</Text>}

       
<Controller
            control={control}
            name="address"
            rules={{ required: 'address is required' }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                placeholder="Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Update</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
