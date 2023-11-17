import { View, Text, StyleSheet, SafeAreaView, TextInput, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react';
import DataService from '../services/DataService'
import ModalMensaje from '../components/ModalMensaje'
import MessageConstants from '../constants/MessageConstants'
import BotonReutilizable from '../components/BotonReutilizable'
import Menu from '../components/Menu'

let dataService = new DataService();

export default function ConfiguracionScreen({ navigation }) {

  const [telefonoEmergencia, setTelefonoEmergencia] = useState();
  const [urlVideo, setUrlVideo] = useState();
  const [urlMusicaFavorita, setUrlMusicaFavorita] = useState();
  const [uriImagenFondo, setUriImagnFondo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [image, setImage] = useState(null);

  let handleSubmit = async () => {
    if (telefonoEmergencia && urlVideo && urlMusicaFavorita && uriImagenFondo) {
      if (await dataService.almacenarDatos(telefonoEmergencia, urlVideo, urlMusicaFavorita, uriImagenFondo)) {
        setMensajeModal(MessageConstants.MSG_DATOS_GUARDADOS);
        setSuccess(true)
      } else {
        setMensajeModal(MessageConstants.MSG_GUARDADO_FALLIDO);
        setSuccess(false)
      }
    } else {
      setMensajeModal(MessageConstants.MSG_CAMPOS_INCOMPLETOS);
      setSuccess(false)
    }
    setModalVisible(true)
  }

  let loadBackground = async () => {
    if (JSON.parse(await dataService.obtenerBackground())) {
      let backgroundImage = JSON.parse(await dataService.obtenerBackground());
      setImage(backgroundImage.uri);
    }
  }

  useEffect(() => {
    loadBackground();
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <ImageBackground source={{ uri: image }} style={styles.image}>
        <Text style={[styles.textLabel]}>Número Telefónico</Text>
        <TextInput
          editable
          style={styles.input}
          placeholder="Ingrese un número de teléfono de emergencia"
          keyboardType="numeric"
          onChangeText={input => setTelefonoEmergencia(input)}
        />
        <Text style={[styles.textLabel]}>URL Video</Text>
        <TextInput
          editable
          style={styles.input}
          value={urlVideo}
          placeholder="Ingrese una url de un video"
          onChangeText={input => setUrlVideo(input)}
        />
        <Text style={[styles.textLabel]}>URL Musica Favorita</Text>
        <TextInput
          editable
          style={styles.input}
          value={urlMusicaFavorita}
          placeholder="Ingrese una url de una cancion"
          onChangeText={input => setUrlMusicaFavorita(input)}
        />
        <Text style={[styles.textLabel]}>URI Imagen de Fondo</Text>
        <TextInput
          editable
          style={styles.input}
          value={uriImagenFondo}
          placeholder="Ingrese una uri de una imágen"
          onChangeText={input => setUriImagnFondo(input)}
        />
        <BotonReutilizable onPress={handleSubmit} titulo='GUARDAR' style={styles.button} />
      </ImageBackground>
      <ModalMensaje mensaje={mensajeModal} modalVisible={modalVisible} setModalVisible={setModalVisible} success={success} />
      <Menu navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#fff'
  },
  button: {
    marginTop: 20,
    width: 300,
    height: 60,
    backgroundColor: 'black',
    borderRadius: 10
  },
  input: {
    height: 40,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  textLabel: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginTop: 5,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});