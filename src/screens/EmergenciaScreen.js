import { View, Text, SafeAreaView, StyleSheet, Linking, Alert, Platform, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react';
import { Accelerometer} from 'expo-sensors';
import { Vibration } from 'react-native';
import DataService from '../services/DataService';
import ModalMensaje from '../components/ModalMensaje'
import MessageConstants from '../constants/MessageConstants'

let dataService = new DataService();
export default function EmergenciaScreen() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  
  const [subscription, setSubscription] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [telefono, setTelefono] = useState();
  const [image, setImage] = useState(null);

  const _slow = () => Accelerometer.setUpdateInterval(1000);
  const _fast = () => Accelerometer.setUpdateInterval(16);

  const llamarNumero = ({texto}) => {
    const phoneNumber = texto;
    Linking.openURL(`tel:${phoneNumber}`)
  }

  const chequearNumero = async () => {
    if ((await dataService.obtenerDatos()).telefono) {
      datos = dataService.obtenerDatos();
      llamarNumero(datos.telefono);
    } else {
      setMensajeModal(MessageConstants.MSG_TELEFONO_UNDEFINED);
      setModalVisible(true);
    }
    Vibration.vibrate();
  };

  const _subscribe = () => {
    let auxiliarX;
    setSubscription(Accelerometer.addListener(async (accelerometerData) => {
      auxiliarX = x;
      if (accelerometerData.x < auxiliarX) {
        if ((auxiliarX - accelerometerData.x) > 0.5) {
          chequearNumbero();
        }
      } else {
        if ((accelerometerData.x - auxiliarX) > 0.5) {
          if ((auxiliarX - accelerometerData.x) > 0.5) {
            chequearNumbero();
          }
        }
      }
      setData(accelerometerData);
    }));
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  let loadBackground = async () => {
    if (JSON.parse(await dataService.obtenerBackground())) {
      let backgroundImage = JSON.parse(await dataService.obtenerBackground());
      setImage(backgroundImage.uri);
    }
  }

  let loadTelefono = async () => {
    let datos = await dataService.obtenerDatos();
    if(datos.telefono){
      setTelefono(datos.telefono)
    }    
  }

  useEffect(() => {
    loadBackground();
    loadTelefono();
    _subscribe();
    _slow();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Accelerometer: (in gs where 1g = 9.81 m/s^2)</Text>
      <Text style={styles.text}>x: {x}</Text>
      <Text style={styles.text}>y: {y}</Text>
      <Text style={styles.text}>z: {z}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={subscription ? _unsubscribe : _subscribe} style={styles.button}>
          <Text>{subscription ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_slow} style={[styles.button, styles.middleButton]}>
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
});