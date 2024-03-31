import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import placeholder from "./assets/images.svg";
import axios from "axios";
import * as FileSystem from "expo-file-system";

export default function Home({ navigation }) {
  const [uri, setFile] = useState(null);
  const [error, setError] = useState(null);
  console.log("Reload");
  const [imageBase64, setImageBase64] = useState(null);
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        `Sorry, we need camera  
             roll permission to upload images.`
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.cancelled) {
        const convertImageToBase64 = async (uri) => {
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
            });
            setImageBase64(base64);
            const headers = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            };

            const payload = {
              model: "gpt-4-vision-preview",
              messages: [
                {
                  role: "user",
                  content: [
                    {
                      type: "text",
                      text: "A image with the design of application is given to you you should convert it to html and css code in one file YOU SHOULD ONLY GIVE THE CODE AND NOTHING ELSE yOU SHOULD GIVE THE WHOLE CODE AND NOT ONE PART THE WHOLE CODE SHOULD BE GIVEN AND DO NOT GIVE ANY OTHER TEXT!",
                    },
                    {
                      type: "image_url",
                      image_url: {
                        url: `data:image/jpeg;base64,${base64}`,
                      },
                    },
                  ],
                },
              ],
            };

            axios
              .post("https://api.openai.com/v1/chat/completions", payload, {
                headers,
              })
              .then((response) => {
                console.log(
                  "Response:",
                  response.data.choices[0].message.content
                );
                navigation.navigate("Preview", {
                  code: response.data.choices[0].message.content,
                });
              })
              .catch((error) => {
                console.error("Error:", error.response.data || error.message);
                // Handle the error appropriately
              });
          } catch (error) {
            console.error("Error converting image to base64:", error);
          }
        };
        convertImageToBase64(result.assets[0].uri);
        const fetchFile = async (uri) => {
          try {
            const data = new FormData();
            const response = await fetch(uri);
            data.append("file", response);
            axios
              .post("http://localhost:5000/imgUpload", data, {
                method: "post",
              })
              .catch((err) => {
                console.log(err);
              });
            console.log(response);
          } catch (error) {
            console.error("Error fetching file:", error);
            throw error;
          }
        };
        fetchFile(result.assets[0].uri);
        setFile(result.assets[0].uri);
        setError(null);
        console.log(result.assets[0]);
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <Image source={placeholder} />
        <Text>Upload your image and convert to html code</Text>
      </View>
      <Button onPress={pickImage} style={styles.btn} title="Upload Image" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    margin: 20,
  },
  preview: {
    width: "100%",
    height: "50%",
    marginBottom: 100,
    marginTop: 100,
    display: "flex",
    flexDirection: "column",
    borderColor: "darkgray",
    borderWidth: 2.5,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
