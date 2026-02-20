import { icons } from '@/constants/icons';
import { useGlobalContext } from '@/context/GlobalProvider';
import { getCurrentUser, signIn } from '@/services/appwrite';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
    const { setUser, setIsLoggedIn } = useGlobalContext();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsSubmitting(true);

        try {
            await signIn(form.email, form.password);

            const res = await getCurrentUser();
            if (res) {
                setUser(res);
                setIsLoggedIn(true);
            }

            router.replace('/');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full justify-center min-h-[85vh] px-6 my-6">
                    <Image
                        source={icons.logo}
                        resizeMode="contain"
                        className="w-[115px] h-[35px] mx-auto"
                    />

                    <Text className="text-2xl text-white text-semibold mt-10 font-bold mx-auto">
                        Log in to MovieApp
                    </Text>

                    <View className="mt-7 space-y-2">
                        <Text className="text-base text-gray-100 font-medium">Email</Text>
                        <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
                            <TextInput
                                className="flex-1 text-white font-semibold text-base"
                                value={form.email}
                                placeholder="Enter your email"
                                placeholderTextColor="#7b7b8b"
                                onChangeText={(e) => setForm({ ...form, email: e })}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View className="mt-7 space-y-2">
                        <Text className="text-base text-gray-100 font-medium">Password</Text>
                        <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
                            <TextInput
                                className="flex-1 text-white font-semibold text-base"
                                value={form.password}
                                placeholder="Enter your password"
                                placeholderTextColor="#7b7b8b"
                                onChangeText={(e) => setForm({ ...form, password: e })}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={submit}
                        activeOpacity={0.7}
                        className={`bg-light-100 rounded-xl min-h-[62px] justify-center items-center mt-7 ${isSubmitting ? 'opacity-50' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#030014" />
                        ) : (
                            <Text className="text-primary font-bold text-lg">Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-regular">
                            Don't have an account?
                        </Text>
                        <Link
                            href="/sign-up"
                            className="text-lg font-bold text-light-100"
                        >
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
