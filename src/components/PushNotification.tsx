import { useState, useEffect, useRef } from "react";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import { Platform } from "react-native";
import { SCHOOL_API_BASE_URL } from "@env";

export interface PushNotificationState {
  notification?: Notifications.Notification;
  expoPushToken?: string; 
}

const saveDeviceToken = async (userId, deviceToken) => {
  const url = `${SCHOOL_API_BASE_URL}/pushDeviceReg`;
  const token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInNjb3BlcyI6IjMsNCwxMSwxMyw2LDgsNywxLDIiLCJpYXQiOjE3Mjc0OTkyNTIsImV4cCI6MTczMDA5MTI1Mn0.3ylvWLFEArNCmMjxoYRcOCpR_AldVKg9DGEt81mZYY8'; // Make sure this token is correct and not expired

  const data = {
    id: 1,
    externalUserRef: userId, 
    deviceToken: deviceToken,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseBody = await response.json();
    
    if (!response.ok) {
      console.error('Failed to register device token:', response.status, responseBody);
      throw new Error(`API error: ${response.status}`);
    }

    console.log('Device token saved successfully:', responseBody);
  } catch (error) {
    console.error('Error saving device token:', error.message, error);
  }
};

export const usePushNotification = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification | undefined>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert("Failed to get push token for push notifications!");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })).data;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return token;
    } else {
      console.log("Must use a physical device for Push Notifications");
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token);
      if (token) {
        saveDeviceToken('232332323', token); 
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification responded:", response);
    });

    return () => {
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return { expoPushToken, notification };
};
