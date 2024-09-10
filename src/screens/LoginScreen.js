import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native';
import FormField from '../components/FormField';
import CustomButton from '../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import mainStyles from '../../mainStyle';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SCHOOL_API_BASE_URL } from '@env';

const LoginScreen = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [isLogin, setIsLogin] = useState(false);
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

    const handleLogin = async () => {
        if (form.username === '' || form.password === '') {
            Alert.alert('Error', 'Please fill in all the fields');
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
                Alert.alert('Login Successful', `Welcome ${data.items.firstName || 'User'}!`);
                navigation.navigate('Home');
            } else if (response.status === 403) {
                Alert.alert('Login Failed', 'Invalid username or password.');
            } else {
                Alert.alert('Error', `Status Code: ${response.status}`);
            }
        } catch (error) {
            console.error('Network error:', error.message);
            Alert.alert('Error', `Error: ${error.message}`);
        } finally {
            setIsLogin(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
                <View style={mainStyles.mainContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={require('../../assets/favicon.png')} style={{ height: 200 }} resizeMode='contain' />
                    </View>
                    <Text style={mainStyles.mainTitle}>Login to School</Text>
                    <FormField
                        title="Username"
                        placeholder="Enter your username here"
                        value={form.username}
                        handleCheckText={(e) => setForm({ ...form, username: e })}
                        otherStyles={{ marginBottom: 7 }}
                    />
                    <FormField
                        title="Password"
                        placeholder="Enter your password here"
                        value={form.password}
                        handleCheckText={(e) => setForm({ ...form, password: e })}
                        otherStyles={{ marginBottom: 7 }}
                        secureTextEntry={true}
                    />
                    <CustomButton
                        title="Sign in"
                        handlePress={handleLogin}  
                        style={{ marginBottom: 10 }}
                        isLoading={isLogin}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        flexDirection: 'row',
        paddingBottom: 30,
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        color: '#e1dec8',
        marginBottom: 20,
    },
    signUpText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#fff',
    },
    signUpLink: {
        textDecorationLine: 'none',
        color: '#d5cb75',
    },
});

export default LoginScreen;
