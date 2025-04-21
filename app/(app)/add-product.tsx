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
  FlatList,
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
//  const API_BASE_URL = "http://localhost:3000"
interface ImageAsset {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
  width?: number;
  height?: number;
}

export default function AddProduct() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const [supplierId, setSupplierId] = useState("");
  const navigate = useNavigation();
  
  // State for colors and their images
const [colorImages, setColorImages] = useState<Record<string, ImageAsset>>({});
  const [colors, setColors] = useState([]);
  const [currentColor, setCurrentColor] = useState("");

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
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

  // Function to add a color to the list
  const addColor = () => {
    if (!currentColor.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a color name",
      });
      return;
    }
    
    if (colors.includes(currentColor.trim())) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "This color is already added",
      });
      return;
    }
    
    const updatedColors = [...colors, currentColor.trim()];
    setColors(updatedColors);
    
    // Update the form color field
    const colorString = updatedColors.join(", ");
    control._formValues.color = colorString;
    trigger("color");
    
    setCurrentColor("");
  };

  // Function to remove a color from the list
  const removeColor = (colorToRemove) => {
    const updatedColors = colors.filter((color) => color !== colorToRemove);
    setColors(updatedColors);
    
    // Also remove the image associated with this color
    const updatedColorImages = { ...colorImages };
    delete updatedColorImages[colorToRemove];
    setColorImages(updatedColorImages);
    
    // Update the form color field
    const colorString = updatedColors.join(", ");
    control._formValues.color = colorString;
    trigger("color");
  };

  // Function to upload an image for a specific color
  const uploadImageForColor = (color) => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        selectionLimit: 1,
      },
      (response) => {
        if (!response.didCancel && response.assets && response.assets.length > 0) {
          setColorImages(prevState => ({
            ...prevState,
            [color]: response.assets[0]
          }));
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
  
      // Check if images are uploaded for all colors
      const missingImageColors = colors.filter(color => !colorImages[color]);
      if (missingImageColors.length > 0) {
        Toast.show({
          type: "error",
          text1: "Missing Images",
          text2: `Please upload images for: ${missingImageColors.join(", ")}`,
        });
        return;
      }
  
      setLoading(true);
      
      // Create a payload object
      const payload = {
        category: data.category,
        name: data.name,
        price: data.price,
        color: colors,
        quality: data.quality.split(",").map(item => item.trim()),
        size: data.size.split(",").map(item => item.trim()),
        supplierId: supplierId,
        colorImageData: {}
      };
      
      // Convert images to base64 and add to payload
      await Promise.all(
        Object.entries(colorImages).map(async ([color, imageData]) => {
          if (imageData && imageData.uri) {
            // Get the file extension
            const fileExtension = imageData.type ? 
              imageData.type.split('/')[1] : 'jpg';
            
            // Convert image to base64
            const response = await fetch(imageData.uri);
            const blob = await response.blob();
            
            return new Promise<void>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                // Add to payload with color as key
                payload.colorImageData[color] = {
                  data: reader.result.toString().split(',')[1], // Remove the data:image/jpeg;base64, prefix
                  name: `${color}_${Date.now()}.${fileExtension}`,
                  type: imageData.type || 'image/jpeg'
                };
                resolve();
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          }
        })
      );
  
      const response = await axios.post(
        `${API_BASE_URL}/api/products/create-product`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      setLoading(false);
  
      if (response.data) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Product added successfully!",
        });
      router.push('/supplier-products');
      }
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

        {/* Color input section */}
        <View style={styles.colorInputContainer}>
          <TextInput
            style={[
              styles.colorInput,
              focusedInput === "currentColor" ? styles.inputFocused : null,
            ]}
            placeholder="Enter a color"
            value={currentColor}
            onFocus={() => setFocusedInput("currentColor")}
            onBlur={() => setFocusedInput(null)}
            onChangeText={(text) => setCurrentColor(text)}
          />
          <TouchableOpacity style={styles.addColorButton} onPress={addColor}>
            <Text style={styles.addColorButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <Controller
          control={control}
          name="color"
          rules={{
            required: "At least one color is required",
            validate: value => colors.length > 0 || "Please add at least one color"
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.hiddenInput}>
              <TextInput 
                value={colors.join(", ")} 
                editable={false}
                style={{height: 0, width: 0}}
                onChangeText={(text) => {
                  onChange(text);
                }}
              />
            </View>
          )}
        />
        {errors.color && (
          <Text style={styles.errorText}>{errors.color.message}</Text>
        )}

        {/* Color chips and image upload section */}
        {colors.length > 0 && (
          <View style={styles.colorsContainer}>
            <Text style={styles.sectionTitle}>Selected Colors:</Text>
            <FlatList
              data={colors}
              horizontal={false}
              numColumns={1}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <View style={styles.colorItemContainer}>
                  <View style={styles.colorChipRow}>
                    <View style={[styles.colorChip, { backgroundColor: item.toLowerCase() }]} />
                    <Text style={styles.colorName}>{item}</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeColor(item)}
                    >
                      <Ionicons name="close-circle" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.imageUploadSection}>
                    {colorImages[item] ? (
                      <View style={styles.imageWithButton}>
                        <Image
                          source={{ uri: colorImages[item].uri }}
                          style={styles.uploadedImage}
                          resizeMode="contain"
                        />
                        <TouchableOpacity
                          style={styles.changeImageButton}
                          onPress={() => uploadImageForColor(item)}
                        >
                          <Text style={styles.changeImageText}>Change</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.uploadButton}
                        onPress={() => uploadImageForColor(item)}
                      >
                        <Ionicons name="cloud-upload-outline" size={18} color="white" />
                        <Text style={styles.uploadButtonSmallText}>Upload Image</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            />
          </View>
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
              placeholder="Qualities (comma separated, e.g. 100, 200, 300)"
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

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color="white"
            />
          ) : (
            <Text style={styles.buttonText}>
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
  colorInputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
  addColorButton: {
    backgroundColor: "black",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 8,
  },
  addColorButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  colorsContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  colorItemContainer: {
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
  },
  colorChipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  colorChip: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  colorName: {
    flex: 1,
    fontSize: 16,
  },
  removeButton: {
    padding: 5,
  },
  imageUploadSection: {
    alignItems: "flex-start",
  },
  uploadButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonSmallText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 14,
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imageWithButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeImageButton: {
    backgroundColor: "#555",
    padding: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  changeImageText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  hiddenInput: {
    height: 0,
    overflow: 'hidden',
  },
});