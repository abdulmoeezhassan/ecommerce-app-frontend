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
  import { useState, useEffect } from "react";
  import { useNavigation } from "expo-router";
  import Otp from "./otp";
  import { router } from "expo-router";
  import Toast from 'react-native-toast-message';
  import AsyncStorage from "@react-native-async-storage/async-storage";
  // import userService from "../services/user-service";
  const image = require("@/assets/images/auth-bg.png");
  
  export default function ForgotPassword() {
    const { signIn } = useSession();
    const {
      control,
      handleSubmit,
      trigger,
      formState: { errors },
    } = useForm({ mode: "onBlur", reValidateMode: "onBlur", defaultValues: {
      email: "",
    } });
    const [submittedData, setSubmittedData] = useState(null);
    const [isShowOtp, setShowOtp] = useState(false);
    const [focusedInput, setFocusedInput] = useState("");
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
      const subscription = Dimensions.addEventListener("change", onChange);
  
      // Cleanup listener on unmount
      return () => {
        subscription?.remove();
      };
    }, []);
  
    const onSubmit = async (data) => {
      try {
        setLoading(true);
         AsyncStorage.setItem("email", data.email);
        // const response = await userService.sendOtp(data);
  
        const response  = await fetch(`http://localhost:3000/api/auth/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          setLoading(false);
          const errorData = await response.json();
    
          Toast.show({
            type: 'error',
            text1: 'OTP Send Failed',
            text2: errorData?.message || 'Error during sending OTP',
            position: 'top',
            visibilityTime: 4000,
            autoHide: true,
          });
    
          throw new Error(errorData?.message || "Error during sending OTP");
        }
    
        const responseData = await response.json();
        console.log("OTP sent successfully:", responseData);
    
        setSubmittedData(data);
        setLoading(false);
    
        Toast.show({
          type: 'success',
          text1: 'OTP Sent Successfully',
          text2: 'Check your email for the OTP code.',
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
        });
    
          router.push({
            pathname: "/otp",
            params: {
              otp: "forgot-password",
            },
          });
      } catch (error) {
        setLoading(false);
        console.error("Error during OTP request:", error.message);
    
        Toast.show({
          type: 'error',
          text1: 'OTP Error',
          text2: error.message || 'Something went wrong!',
          position: 'top',
          visibilityTime: 4000,
          autoHide: true,
        });
      }
    };
    
    return (
    //   <Otp navigateTo="forgot-password" />
    // ) : (
      <View style={styles.container}>
        <ImageBackground style={styles.backgroundImage} source={image} className="h-[70vh]"/>
        {/* <Image
          style={styles.logo}
          source={require("../assets/images/react-logo.png")}
        /> */}
  
        <View style={[styles.formContainer, { height: formHeight }]}>
          <Text style={[styles.headerText]}>
            Please Enter Your Email To Receive Verification Code
          </Text>
  
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
            }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextInput
                style={[styles.input,
                  focusedInput === "email" && styles.inputFocused,
                  errors.email && styles.inputError]}
                placeholder="Enter email"
                value={value}
                className="focus:outline-none focus:border-gray-900"
                onChange={() => setFocusedInput("email")}
                onChangeText={(text) => {
                  onChange(text);
                  trigger("email"); 
                }}
                onBlur={onBlur}
              />
            )}
          />
          {errors.email && (
            <Text style={[styles.errorText]}>{String(errors.email.message)}</Text>
          )}
  
          <Text style={styles.text}>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text style={{ textDecorationLine: "underline" }}>
                Back To Sign In
              </Text>
            </TouchableOpacity>
          </Text>
  
          <TouchableOpacity style={styles.button} activeOpacity={1} onPress={handleSubmit(onSubmit)}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color="white"
                style={[styles.buttonText]}
              />
            ) : (
              <Text style={[styles.buttonText]}>Send OTP</Text>
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
      marginBottom: 20,
      padding: 30,
      paddingLeft: 10,
      paddingRight: 10,
    },
    text: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      paddingTop: 5,
      paddingBottom: 10,
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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