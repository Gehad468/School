import { usePushNotification } from './src/components/PushNotification';
import AppNavigator from './src/navigation/AppNavigator';
import { View, Text } from'react-native';


const App = () => {
  const {expoPushToken,notification}=usePushNotification();
  const data= JSON.stringify(notification,undefined,2);

  return (
   <AppNavigator /> 
  // <Text>expoPushToken: {expoPushToken?.data??""}</Text>
 
  );
};

export default App;