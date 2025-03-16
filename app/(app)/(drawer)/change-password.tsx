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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import axios from "axios";

const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app";

export default function ChangePassword() {
  const {
    control,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors, touchedFields },
  } = useForm({ mode: "onBlur", reValidateMode: "onBlur" });
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");

  const getSingleUser = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");
      const token = await AsyncStorage.getItem("accessToken");

      const response = await axios.get(`${API_BASE_URL}/api/users/get-single-user/${userId}`);

      if (response.status !== 200) {
        const errorData = response.data;
        throw new Error(errorData?.message || "Error during fetching data");
      }

      const responseData = response.data;
      const profileImage = responseData?.data[0]?.imagePath || null;

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

      if (data.password !== data.confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Profile updating failed",
          text2: "Password and Confirm Password must match",
          position: "top",
          visibilityTime: 4000,
          autoHide: true,
        });
        setLoading(false);
        return;
      }

      const userId = await AsyncStorage.getItem("user_id");
      const token = await AsyncStorage.getItem("accessToken");

      const responseData = await axios.put(`${API_BASE_URL}users/update-password/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (responseData.status !== 200) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Profile update failed",
          text2: responseData?.data?.message || "Error in updating profile",
        });
        throw new Error(
          responseData?.data?.message || "Error during updating profile"
        );
      }

      await AsyncStorage.setItem("accessToken", token);
      await AsyncStorage.setItem("user_id", userId);

      Toast.show({
        type: "success",
        text1: "Password Update",
        text2: "Password updated successfully",
      });

      setLoading(false);
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
      </View>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: touchedFields.password ? "Password is required" : false,
            minLength: touchedFields.password
              ? {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                }
              : undefined,
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                autoComplete="off"
                textContentType="oneTimeCode"
                className="focus:outline-none focus:border-gray-900"
                placeholder="Password"
                value={value || ""}
                onChangeText={(text) => {
                  onChange(text);
                  trigger("password");
                }}
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onFocus={() => setFocusedInput("password")}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && touchedFields.password && (
          <Text style={[styles.errorText]}>
            {String(errors.password.message)}
          </Text>
        )}

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Confirm password is required",
            minLength: {
              value: 6,
              message: "Confirm password must be at least 6 characters long",
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                className="focus:outline-none focus:border-gray-900"
                placeholder="Confirm Password"
                value={value}
                onChangeText={(text) => {
                  onChange(text);
                  trigger("confirmPassword");
                }}
                secureTextEntry={!showConfirmPassword}
                onBlur={onBlur}
                onFocus={() => setFocusedInput("confirmPassword")}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.confirmPassword && touchedFields.confirmPassword && (
          <Text style={[styles.errorText]}>
            {String(errors.confirmPassword.message)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    overflowY: "auto",
  },
  formContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 70,
    elevation: 10,
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
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
  },
});
