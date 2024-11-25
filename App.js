import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import UserPage from "./components/UserPage";

export default function App() {
  const Stack = createNativeStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UserPage">
        <Stack.Screen
          name="UserPage"
          component={UserPage}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
