import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, Button, Image, ImageBackground, TouchableOpacity } from 'react-native'
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import Boton from "../components/Boton.js";

export default function CameraScreen({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [imageGaleria, setImageGaleria] = useState("");

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const savePicture = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image);
        alert("¡Foto guardada! 🎉");
        setImage(null);
        console.log("saved successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No tienes acceso a la cámara</Text>;
  }

  return (
    <View >
      <View >
        <Button
          onPress={() =>
            setFlash(
              flash === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
            )
          }
          icon="flash"
          color={flash === Camera.Constants.FlashMode.off ? "gray" : "#fff"}
        />
      </View>
      {!image ? (
        <Camera          
          type={type}
          ref={cameraRef}
          flashMode={flash}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            }}
          >
            <Button
              title="Presionar"              
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            />
          </View>
        </Camera>
      ) : (
        <Image source={{ uri: image }} />
      )}
      <View >
        {image ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 50,
            }}
          >
            <Button
              title="Volver a sacar"
              onPress={() => setImage(null)}
            />
            <Button title="Guardar" onPress={savePicture} />
          </View>
        ) : (
          <Button title="Sacar una foto" onPress={takePicture} />
        )}
      </View>
    </View>
  );
}