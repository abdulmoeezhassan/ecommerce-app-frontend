import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
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
      firstName: '',
      lastName: '',
      email: '',
      address: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(false);

  const getSingleUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const token = await AsyncStorage.getItem('accessToken');

      const response = await axios.get(
        `${API_BASE_URL}users/get-single-user/${userId}`
      );
      if (response.status !== 200) {
        throw new Error(
          response?.data?.message || 'Error during fetching data'
        );
      }

      const responseData = response.data.data;
      const firstName = responseData?.firstName;
      const lastName = responseData?.lastName;
      const address = responseData?.address;
      const email = responseData?.email;
      const profileImage = responseData?.imagePath || null;

      setValue('firstName', firstName);
      setValue('lastName', lastName);
      setValue('email', email);
      setValue('address', address);
      setImageUri(profileImage);
    } catch (error) {
      console.error('Error during fetching user data:', error.message);
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

      const responseData = await fetch(
        `${API_BASE_URL}users/update-user/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );
      const updatedUserData = await responseData.json();

      if (updatedUserData.status == 200) {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Profile update failed',
          text2:
            updatedUserData?.message || 'Error in updating profile',
        });
        throw new Error(
          updatedUserData?.message || 'Error during updating profile'
        );
      }

      await AsyncStorage.setItem('email', data.email);
      await AsyncStorage.setItem('accessToken', token);
      await AsyncStorage.setItem('user_id', userId);

      Toast.show({
        type: 'success',
        text1: 'Profile Update',
        text2: 'Profile updated successfully',
      });

      setLoading(false);
      router.push('/');
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Profile update failed',
        text2: error.message || 'Error in updating profile',
      });
      console.error('Error during profile update:', error.message);
    }
  };

  const uploadImages = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      },
      (response) => {
        if (
          !response.didCancel &&
          response.assets &&
          response.assets.length > 0
        ) {
          const selectedImage = response.assets[0];
          setImageUri(selectedImage.uri);
          uploadImage(selectedImage.uri);
        }
      }
    );
  };

  const uploadImage = async (uri) => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const token = await AsyncStorage.getItem('accessToken');

      const formData = new FormData();

      const fileToUpload = {
        uri: uri.uri,
        name: uri.fileName || 'image.jpg',
        type: uri.type || 'image/jpeg',
      };

      const blob = await (await fetch(fileToUpload.uri)).blob();
      formData.append('image', blob, fileToUpload.name);

      const response = await fetch(
        `${API_BASE_URL}users/update-image/${userId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || 'Failed to update profile picture'
        );
      }

      await getSingleUser();

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Profile picture updated successfully',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });

      return result;
    } catch (error) {
      console.error(
        'Upload failed:',
        error.response?.data || error.message
      );
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error.message || 'Failed to update profile picture',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              error || !imageUri
                ? require('@/assets/images/user-placeholder-img.png')
                : { uri: imageUri }
            }
            style={styles.profileImage}
            onError={() => setError(true)}
          />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={uploadImages}
          >
            <FontAwesome name="pencil" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="firstName"
            rules={{ required: 'First name is required' }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, errors.firstName && styles.inputError]}
                placeholder="First Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.firstName && (
            <Text style={styles.errorText}>
              {String(errors.firstName.message)}
            </Text>
          )}

          <Controller
            control={control}
            name="lastName"
            rules={{ required: 'Last name is required' }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, errors.lastName && styles.inputError]}
                placeholder="Last Name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.lastName && (
            <Text style={styles.errorText}>
              {String(errors.lastName.message)}
            </Text>
          )}

          <Controller
            control={control}
            name="address"
            rules={{ required: 'Address is required' }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input, errors.address && styles.inputError]}
                placeholder="Address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                multiline={true}
                numberOfLines={2}
              />
            )}
          />
          {errors.address && (
            <Text style={styles.errorText}>
              {String(errors.address.message)}
            </Text>
          )}

          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.email && styles.inputError,
                  { opacity: 0.5 }, // Add opacity to make it look disabled
                ]}
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                onBlur={onBlur}
                editable={false}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>
              {String(errors.email.message)}
            </Text>
          )}

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
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 100,
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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