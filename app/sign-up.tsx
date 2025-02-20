import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function Signup() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [submittedData, setSubmittedData] = useState(null);

  const onSubmit = (data) => {
    // Simulate form submission
    console.log("Submitted Data:", data);
    setSubmittedData(data);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {/* Form Girdileri */}
        <Controller
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              style={styles.input}
              placeholder="Your Name"
            />
          )}
          name="name"
          rules={{ required: "You must enter your name" }}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <Controller
          control={control}
          render={({ field }) => (
            <TextInput {...field} style={styles.input} placeholder="Email" />
          )}
          name="email"
          rules={{
            required: "You must enter your email",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email address",
            },
          }}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* Submit Butonu */}
        <Button title="Submit" onPress={handleSubmit(onSubmit)} />

        {/* Gönderilen Veriler */}
        {submittedData && (
          <View>
            <Text>Submitted Data:</Text>
            <Text>Name: {submittedData.name}</Text>
            <Text>Email: {submittedData.email}</Text>
          </View>
        )}
      </View>
      <View className="flex-1 justify-center items-center bg-gray-200">
        <Text className="text-xl text-blue-500">Hello, NativeWind!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
