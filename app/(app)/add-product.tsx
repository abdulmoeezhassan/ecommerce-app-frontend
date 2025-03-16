import {
  ImageBackground,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { StyleSheet, Dimensions } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const API_BASE_URL = "https://ecommerce-app-backend-indol.vercel.app";

export default function AddProduct() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState(null);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const [supplierId, setSupplierId] = useState("");
  const navigate = useNavigation();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      category: "",
      name: "",
      price: "",
      color: "",
      quality: "",
      size: "",
    },
  });

  useEffect(() => {
    const getSupplierIdFromStorage = async () => {
      try {
        const storedSupplierId = await AsyncStorage.getItem("user_id");
        if (storedSupplierId) {
          setSupplierId(storedSupplierId);
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Supplier ID not found. Please login again.",
          });
        }
      } catch (error) {
        console.error("Error retrieving supplierId:", error);
      }
    };

    getSupplierIdFromStorage();
  }, []);

  const uploadImages = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        selectionLimit: 1,
      },
      (response) => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          setSelectedImages(response.assets[0]); // Store only the first image
        }
      }
    );
  };


  useEffect(() => {
    const onChange = () => setScreenHeight(Dimensions.get("window").height);
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  const onSubmit = async (data) => {
    try {
      const supplierId = await AsyncStorage.getItem("user_id");
      if (!supplierId) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Supplier ID not found. Please login again.",
        });
        return;
      }
  
      setLoading(true);
      const formData = new FormData();
      
      formData.append("category", data.category);
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("color", JSON.stringify(data.color.split(",").map(item => item.trim())));
      formData.append("quality", JSON.stringify(data.quality.split(",").map(item => item.trim())));
      formData.append("size", JSON.stringify(data.size.split(",").map(item => item.trim())));
      formData.append("supplierId", supplierId);
      
      if (selectedImages) {
        const fileToUpload = {
          uri: selectedImages.uri,
          name: selectedImages.fileName || 'image.jpg',
          type: selectedImages.type || 'image/jpeg'
        };
        
        const blob = await (await fetch(fileToUpload.uri)).blob();
        formData.append('image', blob, fileToUpload.name);
        
      }
      
      
      const response = await axios.post(
        `${API_BASE_URL}/api/products/create-product`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          transformRequest: (data) => data, 
        }
      );
      
      setLoading(false);
      
      if (response.data) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product added successfully!",
        });
      }
      router.push('/supplier-products');
      window.location.reload();
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || error.message || "Something went wrong!",
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.headerText}>Add Product</Text>

        <Controller
  control={control}
  name="category"
  rules={{ required: "Category is required" }}
  render={({ field: { onChange, value } }) => (
    <View>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => {
          onChange(itemValue);
          trigger("category");
        }}
        style={[styles.input, errors.category && styles.inputError]}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="T-Shirt" value="tshirt" />
        <Picker.Item label="Hoodies" value="hoodies" />
        <Picker.Item label="Jacket" value="jacket" />
      </Picker>
      {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}
    </View>
  )}
/>
        {errors.category && (
          <Text style={styles.errorText}>{errors.category.message}</Text>
        )}

        <Controller
          control={control}
          name="name"
          rules={{
            required: "Name is required",
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={[
                styles.input,
                errors.name && styles.inputError,
                focusedInput === "name" ? styles.inputFocused : null,
              ]}
              placeholder="Name"
              className="focus:outline-none focus:border-gray-900 mt-2"
              value={value}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(text) => {
                onChange(text);
                trigger("name");
              }}
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}

        <Controller
          control={control}
          name="price"
          rules={{
            required: "Price is required",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Please enter a valid price",
            },
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={[
                styles.input,
                errors.price && styles.inputError,
                focusedInput === "price" ? styles.inputFocused : null,
              ]}
              placeholder="Price"
              keyboardType="numeric"
              className="focus:outline-none focus:border-gray-900 mt-2"
              value={value}
              onFocus={() => setFocusedInput("price")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(text) => {
                onChange(text);
                trigger("price");
              }}
            />
          )}
        />
        {errors.price && (
          <Text style={styles.errorText}>{errors.price.message}</Text>
        )}

        <Controller
          control={control}
          name="color"
          rules={{
            required: "Color is required",
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={[
                styles.input,
                errors.color && styles.inputError,
                focusedInput === "color" ? styles.inputFocused : null,
              ]}
              placeholder="Colors (comma separated, e.g. Red, Blue, Green)"
              className="focus:outline-none focus:border-gray-900 mt-2"
              value={value}
              onFocus={() => setFocusedInput("color")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(text) => {
                onChange(text);
                trigger("color");
              }}
            />
          )}
        />
        {errors.color && (
          <Text style={styles.errorText}>{errors.color.message}</Text>
        )}

        <Controller
          control={control}
          name="quality"
          rules={{
            required: "Quality is required",
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={[
                styles.input,
                errors.quality && styles.inputError,
                focusedInput === "quality" ? styles.inputFocused : null,
              ]}
              placeholder="Qualities (comma separated, e.g. Premium, Standard)"
              className="focus:outline-none focus:border-gray-900 mt-2"
              value={value}
              onFocus={() => setFocusedInput("quality")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(text) => {
                onChange(text);
                trigger("quality");
              }}
            />
          )}
        />
        {errors.quality && (
          <Text style={styles.errorText}>{errors.quality.message}</Text>
        )}

        <Controller
          control={control}
          name="size"
          rules={{
            required: "Size is required",
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              style={[
                styles.input,
                errors.size && styles.inputError,
                focusedInput === "size" ? styles.inputFocused : null,
              ]}
              placeholder="Sizes (comma separated, e.g. S, M, L, XL)"
              className="focus:outline-none focus:border-gray-900 mt-2"
              value={value}
              onFocus={() => setFocusedInput("size")}
              onBlur={() => setFocusedInput(null)}
              onChangeText={(text) => {
                onChange(text);
                trigger("size");
              }}
            />
          )}
        />
        {errors.size && (
          <Text style={styles.errorText}>{errors.size.message}</Text>
        )}

        {selectedImages && (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: selectedImages.uri }}
              style={styles.uploadedImage}
            />
          </View>
        )}

        <TouchableOpacity style={styles.uploadButton} onPress={uploadImages}>
          <Ionicons name="cloud-upload-outline" size={24} color="white" />
          <Text style={styles.uploadButtonText}>Upload Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleSubmit(onSubmit)}
          className="mt-4 flex items-center justify-center"
          disabled={loading}
        >
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
              Add Product
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  formContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    padding: 25,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1.5,
  },
  inputFocused: {
    borderColor: "black",
    borderWidth: 1.5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    paddingLeft: 5,
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  uploadButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 5,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    justifyContent: "center",
  },
});