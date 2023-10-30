import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmergenciaScreen from './src/screens/EmergenciaScreen'
import ConfiguracionScreen from './src/screens/ConfiguracionScreen'


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ConfiguracionScreen"
        screenOptions={{
          orientation: 'portrait',
          headerShown: false,
          animation: 'none', 
        }}>        
        <Stack.Screen
          name="EmergenciaScreen"
          component={Home}
          options={{title: 'EmergenciaScreen'}}
        />
        <Stack.Screen name="ConfiguracionScreen" component={ConfiguracionScreen} />
        <Stack.Screen name="EmergenciaScreen" component={EmergenciaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}