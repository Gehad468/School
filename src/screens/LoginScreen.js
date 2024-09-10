import {  View, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Dialog, Portal, Provider } from 'react-native-paper';

import mainStyles from '../../mainStyle';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCHOOL_API_BASE_URL } from '@env';

const LoginScreen = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [isLogin, setIsLogin] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const url = `${SCHOOL_API_BASE_URL}/users/login`;

    async function loginUser(userCredentials) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCredentials),
        });

        const data = await response.json();
        return { response, data };
    }

    const showDialog = (message) => {
        setDialogMessage(message);
        setDialogVisible(true);
    };

    const hideDialog = () => setDialogVisible(false);

    const handleLogin = async () => {
        if (form.username === '' || form.password === '') {
            showDialog('Please fill in all the fields.');
            return;
        }

        setIsLogin(true);
        try {
            const userCredentials = {
                username: form.username,
                password: form.password,
                name: 'string',
            };

            const { response, data } = await loginUser(userCredentials);
            if (response.ok) {
                await AsyncStorage.setItem('userToken', data.items.token);
                await AsyncStorage.setItem('userInfo', JSON.stringify(data.items));
                showDialog(`Login Successful! Welcome ${data.items.firstName || 'User'}`);
                navigation.navigate('Home');
            } else if (response.status === 403) {
                showDialog('Login Failed: Invalid username or password.');
            } else {
                showDialog(`Error: Status Code ${response.status}`);
            }
        } catch (error) {
            console.error('Network error:', error.message);
            showDialog(`Error: ${error.message}`);
        } finally {
            setIsLogin(false);
        }
    };

    return (
        <Provider>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                    <View style={mainStyles.mainContainer}>
                        <View style={mainStyles.logoContainer}>
                            <Image
                                source={require('../../assets/favicon.png')}
                                style={{ height: 200 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text variant="titleLarge">Login to School</Text>

                        <TextInput
                            label="Username"
                            mode="outlined"
                            placeholder="Enter username "
                            value={form.username}
                            onChangeText={(e) => setForm({ ...form, username: e })}
                            style={{ marginBottom: 10 }}
                        />

                        <TextInput
                            label="Password"
                            mode="outlined"
                            placeholder="Enter password"
                            value={form.password}
                            onChangeText={(e) => setForm({ ...form, password: e })}
                            secureTextEntry={!showPassword}
                            right={
                                <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowPassword(!showPassword)}
                                    
                                    color={showPassword? "#665999" : "#663399"}
                                />
                            }
                            style={{ marginBottom: 10 }}
                        />

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            loading={isLogin}
                            disabled={isLogin}
                            style={{ marginTop: 30 }}
                        >
                            Sign in
                        </Button>
                    </View>
                </ScrollView>
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                        <Dialog.Title>Alert</Dialog.Title>
                        <Dialog.Content>
                            <Text>{dialogMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        </Provider>
    );
};

export default LoginScreen;
