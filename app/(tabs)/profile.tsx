import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { useGlobalContext } from '@/context/GlobalProvider'
import { getSavedMovies, signOut } from '@/services/appwrite'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  const [savedCount, setSavedCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchSavedCount = async () => {
      if (user?.$id) {
        try {
          const movies = await getSavedMovies(user.$id)
          setSavedCount(movies?.length || 0)
        } catch (error) {
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchSavedCount()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut()
      setUser(null)
      setIsLoggedIn(false)
      router.replace('/sign-in')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView className='bg-primary flex-1'>
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-6 mt-10">
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-3xl font-bold">Profile</Text>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-[#1C1C1C] px-4 py-2 rounded-full border border-gray-800"
            >
              <Text className="text-red-500 font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>

          <View className="items-center mt-12">
            <View className="relative">
              <View className="w-28 h-28 rounded-full bg-secondary justify-center items-center shadow-lg border-4 border-primary">
                <Text className="text-primary text-5xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="absolute bottom-1 right-1 bg-accent w-8 h-8 rounded-full border-2 border-primary justify-center items-center">
                <Image source={icons.person} className="size-4" tintColor="#000" />
              </View>
            </View>

            <Text className="text-white text-3xl font-bold mt-6">{user?.name}</Text>
            <Text className="text-gray-400 text-lg">{user?.email}</Text>
          </View>

          <View className="flex-row justify-center mt-12 mx-4 bg-[#151312]/80 p-8 rounded-[40px] border border-gray-800 backdrop-blur-md">
            <View className="items-center px-10">
              {loading ? (
                <ActivityIndicator color="#FF8F71" />
              ) : (
                <Text className="text-white text-4xl font-bold">{savedCount}</Text>
              )}
              <Text className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-semibold">Saved Movies</Text>
            </View>
          </View>

          <View className="mt-12">
            <Text className="text-white text-xl font-bold mb-4 px-2">Account Settings</Text>

            <TouchableOpacity className="flex-row items-center justify-between bg-[#1C1C1C] p-5 rounded-2xl mb-3 border border-gray-800">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-blue-500/20 rounded-xl justify-center items-center">
                  <Image source={icons.person} className="size-5" tintColor="#3b82f6" />
                </View>
                <Text className="text-white text-lg font-medium">Edit Profile</Text>
              </View>
              <Image source={icons.arrow} className="size-4" tintColor="#4b5563" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between bg-[#1C1C1C] p-5 rounded-2xl border border-gray-800">
              <View className="flex-row items-center gap-4">
                <View className="w-10 h-10 bg-yellow-500/20 rounded-xl justify-center items-center">
                  <Image source={icons.star} className="size-5" tintColor="#eab308" />
                </View>
                <Text className="text-white text-lg font-medium">Subscription</Text>
              </View>
              <Image source={icons.arrow} className="size-4" tintColor="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile