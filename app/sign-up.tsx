import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Image,
  ImageBackground,
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import userService from "@/services/user-service/user-service";
import { Dimensions } from "react-native";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const image = require("@/assets/images/sign-in.jpg");
export default function Signup() {
  const {
    control,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "User",
    },
  });
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigation();
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleLoading = () => {
    setLoading(!loading);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (data.password !== data.confirmPassword) {
        Toast.show({
          type: "error",
          text1: "Signup Failed",
          text2: "Password and Confirm Password must match",
          position: "top",
          visibilityTime: 4000,
          autoHide: true,
        });
        setLoading(false);
        return;
      }

      const response = await userService.signUp(data);

      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();

        Toast.show({
          type: "error",
          text1: "Signup Error",
          text2: errorData?.message || "Error during signup",
          position: "top",
          visibilityTime: 4000,
          autoHide: true,
        });

        throw new Error(errorData?.message || "Error during signup");
      }

      const responseData = await response.json();
      await AsyncStorage.setItem("email", responseData?.user?.email);
      await AsyncStorage.setItem(
        "accessToken",
        responseData?.user?.accessToken
      );
      await AsyncStorage.setItem("user_id", responseData?.user?._id);

      console.log("Signup successful:", responseData);

      setSubmittedData(data);
      setLoading(false);

      Toast.show({
        type: "success",
        text1: "Signup Successful",
        text2: "Please verify your email",
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });

      (navigate as any).navigate("otp");
    } catch (error) {
      setLoading(false);
      console.error("Error during signup:", error.message);

      Toast.show({
        type: "error",
        text1: "Signup Error",
        text2: error.message || "Something went wrong!",
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  return (
    <View style={styles.container} className="h-[100vh] overflow-y-auto">
      <ImageBackground style={styles.backgroundImage} source={image} className="h-[70vh]">
        {/* <Image
          style={styles.logo}
          source={require("../assets/images/react-logo.png")}
        /> */}

        <View style={styles.formContainer}>
          <Text style={[styles.headerText]}>Sign Up</Text>

          <Controller
            control={control}
            name="firstName"
            rules={{
              required: "First name is required",
              minLength: {
                value: 1,
                message: "First name is required",
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[
                  // focusedInput === "firstName" && styles.inputFocused,
                  styles.input,
                  errors.firstName && styles.inputError,
                ]}
                placeholder="First Name"
                value={value}
                onBlur={onBlur}
                className="focus:outline-none focus:border-gray-900"
                // onChangeText={onChange}
                onChange={() => setFocusedInput("firstName")}
                onChangeText={(text) => {
                  onChange(text);
                  trigger("firstName");
                }}
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
            rules={{
              required: "Last name is required",
              minLength: {
                value: 1,
                message: "Last name is required",
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[
                  styles.input,
                  // focusedInput === "lastName" && styles.inputFocused,
                  errors.lastName && styles.inputError,
                ]}
                placeholder="Last Name"
                value={value}
                className="focus:outline-none focus:border-gray-900"
                onChange={() => setFocusedInput("lastName")}
                onChangeText={(text) => {
                  onChange(text);
                  trigger("lastName");
                }}
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
                focusedInput && styles.inputFocused,
              ]}
              placeholder="Email"
              className="focus:outline-none focus:border-gray-900"
              value={value}
              keyboardType="email-address"
              autoCorrect={false}
              onBlur={onBlur}
              onFocus={() => setFocusedInput("email")}
              onChangeText={(text) => {
                onChange(text);
                trigger("email");
              }}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

          <Controller
            control={control}
            name="role"
            rules={{ required: "Role is required" }}
            defaultValue="User"
            render={({ field: { onChange, value } }) => (
              <View>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                  className="focus:outline-none focus:border-gray-900"
                  style={[styles.dropdown, errors.role && styles.inputError]}
                >
                  <Picker.Item label="User" value="User" />
                  <Picker.Item label="Seller" value="Seller" />
                </Picker>
              </View>
            )}
          />
          {errors.role && (
            <Text style={styles.errorText}>{String(errors.role.message)}</Text>
          )}


          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    // focusedInput === "password" && styles.inputFocused,
                    errors.password && styles.inputError,
                  ]}
                  className="focus:outline-none focus:border-gray-900"
                  placeholder="Password"
                  value={value}
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
          {errors.password && (
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
                  style={[
                    styles.input,
                    focusedInput === "confirmPassword" && styles.inputFocused,
                    // errors.confirmPassword && styles.inputError,
                  ]}
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
          {errors.confirmPassword && (
            <Text style={[styles.errorText]}>
              {String(errors.confirmPassword.message)}
            </Text>
          )}

          <TouchableOpacity style={styles.button} activeOpacity={1} onPress={handleSubmit(onSubmit)}>
            {loading ? (
              <ActivityIndicator
                size="small"
                className="flex items-center justify-center"
                color="white"
              />
            ) : (
              <Text
                style={[styles.buttonText]}
                className="flex items-center justify-center"
              >
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.text]}>
            Already have an account?{" "}
            <Text onPress={() => (navigate as any).navigate("sign-in")}>
              <Text style={{ textDecorationLine: "underline" }}>Log in</Text>
            </Text>
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
const formHeight = Dimensions.get("window").height * 0.6;
const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: formHeight,
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 30,
    marginBottom: 30,
  },
  inputContainer: {
    position: "relative",
  },
  formContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 70,
    elevation: 10,
    maxHeight: "75%",
    // overflowY: "auto",
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    padding: 16,
  },
  text: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 7,
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
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputFocused: {
    borderColor: "darkgrey",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 4,
    padding: 8,
  },
});