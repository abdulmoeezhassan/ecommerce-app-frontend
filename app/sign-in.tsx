import {
  ImageBackground,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StyleSheet, Dimensions } from "react-native";
import { useSession } from "../components/ctx";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import userService from "@/services/user-service/user-service";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";

const image = require("@/assets/images/auth-bg.png");

export default function SignIn() {
  const { signIn } = useSession();
  const [focusedInput, setFocusedInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const navigate = useNavigation();
  const formHeight = screenHeight * 0.7;

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    const onChange = () => setScreenHeight(Dimensions.get("window").height);
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await userService.Login(data);

      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: errorData?.message || "Error during login",
        });
        throw new Error(errorData?.message || "Error during login");
      }

      const responseData = await response.json();
      console.log("Login successful:", responseData);
      await AsyncStorage.setItem("email", responseData?.user?.email);
      await AsyncStorage.setItem(
        "accessToken",
        responseData?.user?.accessToken
      );
      await AsyncStorage.setItem("user_id", responseData?.user?._id);
      await AsyncStorage.setItem("role", responseData?.user?.role);

      signIn();
      setLoading(false);

      if (responseData?.user?.role === "Supplier") {
        router.push("/(app)/(drawer)/(supplier-tabs)" as any);
      } else if (responseData?.user?.role === "Admin") {
        router.replace("/(app)/(drawer)/(admin-tabs)" as any);
      } else {
        router.replace("/(app)/(drawer)/(tabs)" as any);
      }

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${responseData?.user?.email}!`,
      });
    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error.message);
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: error.message || "Something went wrong!",
      });
    }
  };

  return (
    <View style={styles.container} className="overflow-y-auto h-[100vh]">
      <ImageBackground style={styles.backgroundImage} source={image} className="h-[70vh]" />
      {/* <Image
        style={styles.logo}
        source={require("../assets/images/react-logo.png")}
      /> */}

      <View style={[styles.formContainer, { height: formHeight }]}>
        <Text style={styles.headerText}>Login</Text>

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
              onFocus={() => setFocusedInput(true)}
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

        <View className="mt-4">
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    errors.password && styles.inputError,
                    // focusedInput === "password" && styles.inputFocused,
                  ]}
                  className="focus:outline-none focus:border-gray-900"
                  placeholder="Password"
                  value={value}
                  secureTextEntry={!showPassword}
                  autoCorrect={false}
                  onBlur={onBlur}
                  // onFocus={() => setFocusedInput("password")}
                  onChangeText={(text) => {
                    onChange(text);
                    trigger("password");
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
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
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        <Text onPress={() => (navigate as any).navigate("send-otp")} className="flex justify-end mt-4 ml-auto">
          <Text style={styles.forgotText}>
            Forgot your password?
          </Text>
        </Text>

        <TouchableOpacity style={styles.button} activeOpacity={1} onPress={handleSubmit(onSubmit)} className="mt-4 flex items-center justify-center">
          {loading ? (
            <ActivityIndicator
              className="flex items-center justify-center"
              size="small"
              color="white"
            />
          ) : (
            <Text
              className="flex items-center justify-center"
              style={styles.buttonText}
            >
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.text}>
          Don't have an account?
          <Text
            onPress={() => (navigate as any).navigate("sign-up")}
            style={styles.signUpText}
          >
            {" "}
            Sign Up
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", overflowY: 'auto' },
  backgroundImage: { flex: 1, resizeMode: "cover", width: "100%" },
  logo: { width: 100, height: 100, marginBottom: 30, alignSelf: "center" },
  formContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 70,
    elevation: 10,
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    padding: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  passwordInput: { flex: 1, padding: 10 },
  eyeIcon: { position: "absolute", right: 10 },
  inputError: { borderColor: "red" },
  inputFocused: { borderColor: "darkgrey" },
  errorText: { color: "red", fontSize: 12, marginTop: 10 },
  button: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  forgotText: {
    textAlign: "right",
    textDecorationLine: "underline",
  },
  text: { textAlign: "center", marginTop: 20 },
  signUpText: { color: "black", textDecorationLine: "underline" },
});