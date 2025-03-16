import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Image,
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
  import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import axios from "axios";

const image = require("@/assets/images/auth-bg.png");
const API_BASE_URL = "http://localhost:3000/api/";

export default function Signup() {
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors, touchedFields },
  } = useForm({ mode: "onBlur", reValidateMode: "onBlur",  defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
    address: '', 
  }});
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(false);

  const toggleLoading = () => {
    setLoading(!loading);
  };

  const getSingleUser = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const token = await AsyncStorage.getItem("accessToken");

      const response = await axios.get(`${API_BASE_URL}users/get-single-user/${userId}`);
      if (response.status !== 200) {
        throw new Error(response?.data?.message || "Error during fetching data");
      }

      const responseData = response.data.data;
      const firstName = responseData?.firstName;
      const lastName = responseData?.lastName;
      const address = responseData?.address;
      const email = responseData?.email;
      const profileImage = responseData?.imagePath || null;

      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("email", email);
      setValue("address", address);
      setImageUri(profileImage);
    } catch (error) {
      console.error("Error during fetching user data:", error.message);
    }
  };

  useEffect(() => {
    getSingleUser();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("user_id");
      const token = await AsyncStorage.getItem("accessToken");

      const responseData = await fetch(`${API_BASE_URL}users/update-user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const updatedUserData = await responseData.json();

      if (updatedUserData.status == 200) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Profile update failed",
          text2:  updatedUserData?.message || "Error in updating profile",
        });
        throw new Error(
          updatedUserData?.message  || "Error during updating profile"
        );
      }

      await AsyncStorage.setItem("email", data.email);
      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("user_id", userId);

      Toast.show({
        type: "success",
        text1: "Profile Update",
        text2: "Profile updated successfully",
      });

      setLoading(false);
      router.push("/");
      // await userService.getSingleUser(userId, token);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Profile update failed",
        text2: error.message || "Error in updating profile",
      });
      console.error("Error during profile update:", error.message);
    }
  };

  const uploadImages = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        selectionLimit: 1,
      },
      (response) => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          setImageUri(selectedImage.uri);
          uploadImage(selectedImage.uri);
        }
      }
    );
  };
  
  const uploadImage = async (uri) => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const token = await AsyncStorage.getItem("accessToken");
      
      const formData = new FormData();
      
      const fileToUpload = {
        uri: uri.uri,
        name: uri.fileName || 'image.jpg',
        type: uri.type || 'image/jpeg'
      };
      
      const blob = await (await fetch(fileToUpload.uri)).blob();
      formData.append('image', blob, fileToUpload.name);
          
      const response = await fetch(`${API_BASE_URL}/users/update-image/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile picture");
      }
      
      await getSingleUser();
      
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Profile picture updated successfully",
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });
      
      return result;
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: error.message || "Failed to update profile picture",
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            error || !imageUri
              ? require("@/assets/images/user-placeholder-img.png")
              : { uri: imageUri }
          }
          style={styles.profileImage}
          onError={() => setError(true)}
        />
        <TouchableOpacity
          style={styles.editIcon}
          className="rounded-full"
          onPress={uploadImages}
        >
          <FontAwesome name="pencil" size={18} color="white" />
        </TouchableOpacity>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="firstName"
          rules={{ required: "First name is required" }}
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
          <Text style={[styles.errorText]}>
            {String(errors.firstName.message)}
          </Text>
        )}

        <Controller
          control={control}
          name="lastName"
          rules={{ required: "Last name is required" }}
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
          <Text style={[styles.errorText]}>
            {String(errors.lastName.message)}
          </Text>
        )}

      <Controller
          control={control}
          name="address"
          rules={{ required: "Address is required" }}
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
        {errors.address && (
          <Text style={[styles.errorText]}>
            {String(errors.address.message)}
          </Text>
        )}

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={[
                styles.input,
                errors.email && styles.inputError,
                { opacity: 0.5 }, // Add opacity to make it look blurred
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
          <Text style={[styles.errorText]}>
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
            <Text style={[styles.buttonText]}>Update</Text>
          )}
        </TouchableOpacity>
      </View>
      {/* </ImageBackground> */}
    </View>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Complete Your Profile</Text>
          
          {/* Profile Image */}
          <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
            <Image
              source={profileImage ? { uri: profileImage } : require('@/assets/images/default-avatar.png')}
              defaultSource={require('@/assets/images/default-avatar.png')}
              style={styles.profileImage}
            />
            <View style={styles.uploadIconContainer}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          
          {/* Full Name */}
          <Controller
            control={control}
            name="fullName"
            rules={{
              required: "Required",
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "fullName" && styles.inputFocused,
                    errors.fullName && styles.inputError,
                  ]}
                  placeholder=""
                  value={value}
                  onBlur={onBlur}
                  onFocus={() => setFocusedInput("fullName")}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
          
          {/* Gender */}
          <Controller
            control={control}
            name="gender"
            rules={{
              required: "Required",
            }}
            render={({ field: { onChange, value } }) => (
              <View>
                <Text style={styles.label}>Gender</Text>
                <TouchableOpacity 
                  style={[
                    styles.input, 
                    styles.genderInput,
                    errors.gender && styles.inputError
                  ]} 
                  onPress={() => setGenderModalVisible(true)}
                >
                  <Text style={value ? styles.inputText : styles.placeholderText}>
                    {value || ""}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color="#777" />
                </TouchableOpacity>
                
                {/* Gender Selection Modal */}
                <Modal
                  transparent={true}
                  visible={genderModalVisible}
                  animationType="slide"
                  onRequestClose={() => setGenderModalVisible(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Select Gender</Text>
                      {genderOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.optionItem}
                          onPress={() => {
                            onChange(option);
                            setGenderModalVisible(false);
                          }}
                        >
                          <Text style={[
                            styles.optionText,
                            value === option && styles.selectedOption
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setGenderModalVisible(false)}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          />
          
          {/* Address */}
          <Controller
            control={control}
            name="address"
            rules={{
              required: "Required",
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "address" && styles.inputFocused,
                    errors.address && styles.inputError,
                  ]}
                  placeholder=""
                  value={value}
                  onBlur={onBlur}
                  onFocus={() => setFocusedInput("address")}
                  onChangeText={onChange}
                  multiline={true}
                  numberOfLines={2}
                />
              </View>
            )}
          />
          
          {/* Mobile Number */}
          <Controller
            control={control}
            name="mobileNumber"
            rules={{
              required: "Required",
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "mobileNumber" && styles.inputFocused,
                    errors.mobileNumber && styles.inputError,
                  ]}
                  placeholder=""
                  value={value}
                  onBlur={onBlur}
                  onFocus={() => setFocusedInput("mobileNumber")}
                  keyboardType="phone-pad"
                  onChangeText={onChange}
                />
              </View>
            )}
          />
          
          {/* City */}
          <Controller
            control={control}
            name="city"
            rules={{
              required: "Required",
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "city" && styles.inputFocused,
                    errors.city && styles.inputError,
                  ]}
                  placeholder=""
                  value={value}
                  onBlur={onBlur}
                  onFocus={() => setFocusedInput("city")}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
          
          {/* Country */}
          <Controller
            control={control}
            name="country"
            rules={{
              required: "Required",
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  style={[
                    styles.input,
                    focusedInput === "country" && styles.inputFocused,
                    errors.country && styles.inputError,
                  ]}
                  placeholder=""
                  value={value}
                  onBlur={onBlur}
                  onFocus={() => setFocusedInput("country")}
                  onChangeText={onChange}
                />
              </View>
            )}
          />
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8} 
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Complete Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const formHeight = Dimensions.get("window").height * 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    overflowY: "auto",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 70,
    elevation: 10,
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    // marginBottom: 20,
    padding: 20,
    paddingTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  inputContainer: {
    position: "relative",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  imageContainer: {
    position: "relative",
    width: 200,
    height: 200,
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "24%",
    marginTop: 20,
    marginBottom: 20,
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 30,
    backgroundColor: "black",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
  },
});
