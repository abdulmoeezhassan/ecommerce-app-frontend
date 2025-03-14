import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Platform,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Dimensions } from "react-native";
import * as ImagePicker from 'expo-image-picker';

export default function CompleteProfile() {
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      fullName: "",
      gender: "",
      address: "",
      mobileNumber: "",
      city: "",
      country: "",
    },
  });
  
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  const pickImage = async () => {
    // Request permissions first
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload an image!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const genderOptions = ["Male", "Female", "Other"];

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Add profile image to data
      const completeData = {
        ...data,
        profileImage: profileImage
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Profile completed:", completeData);
      
      // Save to AsyncStorage example
      await AsyncStorage.setItem('userProfile', JSON.stringify(completeData));
      
      setLoading(false);
      
      Toast.show({
        type: "success",
        text1: "Profile Completed",
        position: "top",
        visibilityTime: 3000,
        autoHide: true,
      });
      
      // Navigate to next screen
      // navigation.navigate('Home');
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile:", error.message);
      
      Toast.show({
        type: "error",
        text1: "Update Failed",
        position: "top",
        visibilityTime: 3000,
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
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    overflowY: 'auto'
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    textAlign: "center",
  },
  backButton: {
    padding: 5,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadIconContainer: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#333",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  genderInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    fontSize: 16,
    color: "#aaa",
  },
  inputFocused: {
    borderBottomColor: "#333",
  },
  inputError: {
    borderBottomColor: "red",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
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
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  selectedOption: {
    color: "#000",
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
});