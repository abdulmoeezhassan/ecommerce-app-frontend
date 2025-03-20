import { useState, useRef, useEffect } from "react";
import {
  ImageBackground,
  View,
  Image,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { StyleSheet, Dimensions } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useLocalSearchParams, useNavigation } from "expo-router";
import userService from "@/services/user-service/user-service";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
const image = require("@/assets/images/sign-in.jpg");

export default function Otp() {
  const numberOfOtpFields = 4;
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: Object.fromEntries(
      Array.from({ length: numberOfOtpFields }, (_, i) => [`otp${i + 1}`, ""])
    ),
  });
  const [submittedData, setSubmittedData] = useState(null);
  const navigate = useNavigation();
  const inputRef = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const { otp } = useLocalSearchParams<{ otp: string }>();
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
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
      // Dimensions.removeEventListener('change', onChange);
    };
  }, []);

  const navigateToRoute = () => {
    if (otp === "forgot-password") {
      (navigate as any).navigate("forgot-password");
    } else {
      (navigate as any).navigate("sign-in");
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const email = await AsyncStorage.getItem("email");
      const otpData = {
        otp: data,
        email: email,
      };

      const response = await userService.verifyOtp(otpData);

      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();

        Toast.show({
          type: "error",
          text1: "OTP Verification Failed",
          text2: errorData?.message || "Error verifying OTP",
          position: "top",
          visibilityTime: 4000,
          autoHide: true,
        });

        throw new Error(errorData?.message || "Error verifying OTP");
      }

      const responseData = await response.json();
      console.log("OTP Verified successfully:", responseData);

      setSubmittedData(data);
      setLoading(false);

      Toast.show({
        type: "success",
        text1: "OTP Verified",
        text2: "Your account has been verified successfully!",
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });

      navigateToRoute();
    } catch (error) {
      setLoading(false);
      console.error("Error during OTP verification:", error.message);

      Toast.show({
        type: "error",
        text1: "OTP Verification Error",
        text2: error.message || "Something went wrong!",
        position: "top",
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };
  const handleSubmitOtp = (data) => {
    const otp = Array.from({ length: 4 })
      .map((_, index) => data[`otp${index + 1}`])
      .join("");

    onSubmit(otp);
  };

  const handleOtpChange = (index, text, onChange) => {
    onChange(text);
    if (text.length === 1 && index < 3) {
      inputRef.current[index + 1]?.focus();
    } else if (text.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground style={styles.backgroundImage} source={image} className="h-[70vh]" />
      {/* <Image
        style={styles.logo}
        source={require("../assets/images/react-logo.png")}
      /> */}
      <View style={[styles.formContainer, { height: formHeight }]}>
        <View className="flex flex-col">
          <Text className="pb-[10px]" style={[styles.headerText]}>
            Otp
          </Text>
          <Text className="text-center text-black text-[16px] mt-3 mb-[25px]">
            Please Enter Verification Code Sent to Your Email
          </Text>
        </View>
        <View style={styles.otpContainer}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Controller
              key={`otp-${index}`}
              control={control}
              name={`otp${index + 1}`}
              rules={{ required: `OTP field ${index + 1} is required` }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    errors[`otp${index + 2}`] && styles.inputError,
                    focusedIndex === index && styles.inputFocused,
                  ]}
                  className="focus:outline-none focus:border-gray-900"
                  value={value}
                  onChangeText={(text: any) => {
                    handleOtpChange(index, text, onChange);
                    trigger(`otp${index + 1}`);
                  }}
                  keyboardType="number-pad"
                  maxLength={1} // Limit input to one character per field
                  placeholder=""
                  ref={(el) => (inputRef.current[index] = el)}
                  onFocus={() => setFocusedIndex(index)}
                />
              )}
            />
          ))}
        </View>

      {Object.keys(errors).length > 0 && (
  <Text style={[styles.errorText]}>Invalid otp, Enter 4 digit otp</Text>
)}



        <TouchableOpacity style={styles.button} activeOpacity={1} onPress={handleSubmit(handleSubmitOtp)}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="white"
              style={[styles.buttonText]}
            />
          ) : (
            <Text style={[styles.buttonText]}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
      {/* 
      {Object.keys(errors).map((key) => (
        <Text key={key} style={[styles.errorText]}>
          {errors[key]?.message ? String(errors[key].message) : ""}
        </Text>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(handleSubmitOtp)}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={[styles.buttonText]}>Submit</Text>
        )}
      </TouchableOpacity> */}
    </View>
  );
}

const formHeight = Dimensions.get("window").height * 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  inputFocused: {
    borderColor: "darkgrey",
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    // marginBottom: 20,
    padding: 25,
  },
  otpContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    width: "12%",
    textAlign: "center",
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
});