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
  import { useNavigation } from "expo-router";
  import userService from "@/services/user-service/user-service";
  import Toast from "react-native-toast-message";
  import Ionicons from "react-native-vector-icons/Ionicons";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  const image = require("@/assets/images/sign-in.jpg");
  
  export default function ForgotPassword() {
    const { signIn } = useSession();
    const {
      control,
      handleSubmit,
      formState: { errors },
      trigger,
    } = useForm({
      mode: "onBlur",
      reValidateMode: "onBlur",
      defaultValues: {
        password: "",
        confirmPassword: "",
      },
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [screenHeight, setScreenHeight] = useState(
      Dimensions.get("window").height
    );
    const navigate = useNavigation();
    const formHeight = screenHeight * 0.7;
    const [loading, setLoading] = useState(false);
  
    const toggleLoading = () => {
      setLoading(!loading);
    };
  
    useEffect(() => {
      // Create listener for screen size changes
      const onChange = () => {
        setScreenHeight(Dimensions.get("window").height);
      };
  
      // Add listener
      Dimensions.addEventListener("change", onChange);
  
      // Cleanup listener on unmount
      return () => {
        //   Dimensions.removeEventListener('change', onChange);
      };
    }, []);
  
    const onSubmit = async (data) => {
      try {
        setLoading(true);
        const email = await AsyncStorage.getItem("email");
        let forgotPassword = {
          password: data.password,
          email,
        };
  
        if (data.password !== data.confirmPassword) {
          Toast.show({
            type: "error",
            text1: "Password Mismatch",
            text2: "Password and Confirm Password must match",
            position: "top",
            visibilityTime: 4000,
            autoHide: true,
          });
  
          setLoading(false);
          return;
        }
  
        const response = await userService.resetPassword(forgotPassword);
  
        if (!response.ok) {
          setLoading(false);
          const errorData = await response.json();
  
          Toast.show({
            type: "error",
            text1: "Password Reset Failed",
            text2: errorData?.message || "Error resetting password",
            position: "top",
            visibilityTime: 4000,
            autoHide: true,
          });
  
          throw new Error(errorData?.message || "Error in reset password");
        }
  
        const responseData = await response.json();
        console.log("Password updated successfully:", responseData);
  
        setSubmittedData(data);
        setLoading(false);
  
        Toast.show({
          type: "success",
          text1: "Password Updated",
          text2: "Your password has been reset successfully!",
          position: "top",
          visibilityTime: 4000,
          autoHide: true,
        });
  
        (navigate as any).navigate("sign-in");
      } catch (error) {
        setLoading(false);
        console.error("Error during reset password:", error.message);
  
        Toast.show({
          type: "error",
          text1: "Reset Password Error",
          text2: error.message || "Something went wrong!",
          position: "top",
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    };
    return (
      <View style={styles.container} className="overflow-y-auto">
        <ImageBackground style={styles.backgroundImage} source={image} className="h-[70vh]" />
        {/* <Image
          style={styles.logo}
          source={require("../assets/images/react-logo.png")}
        /> */}
  
        <View style={[styles.formContainer, { height: formHeight }]}>
          <View className="flex flex-col">
            <Text className="pb-[10px]" style={[styles.headerText]}>
              Reset Password
            </Text>
          </View>
          <Text className="text-black text-[16px] mt-3 mb-[10px]">
              Please Enter Your New Password
            </Text>
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
                  // onFocus={() => setFocusedInput("password")}
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
                    errors.confirmPassword && styles.inputError,
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
                color="white"
                className="flex items-center justify-center"
              />
            ) : (
              <Text
                style={[styles.buttonText]}
                className="flex items-center justify-center"
              >
                Reset Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const formHeight = Dimensions.get("window").height * 0.6;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
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
      marginBottom: 30,
      alignSelf: "center",
    },
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
      // marginBottom: 20,
      padding: 25,
    },
    text: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 20,
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
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 16,
    },
    inputContainer: {
      position: "relative",
      marginBottom: 0,
    },
    eyeIcon: {
      position: "absolute",
      right: 10,
      top: "50%",
      transform: [{ translateY: -20 }],
    },
  });