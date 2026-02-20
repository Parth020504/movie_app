import { icons } from '@/constants/icons'
import { useGlobalContext } from '@/context/GlobalProvider'
import { removeSavedMovie, saveMovie } from '@/services/appwrite'
import { Link } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'

const MovieCard = ({ id, poster_path, title, vote_average, release_date, savedDocId, onRefresh }: Movie & { onRefresh?: () => void }) => {
    const { user } = useGlobalContext()
    const [isProcessing, setIsProcessing] = useState(false)

    const handleAction = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to do this')
            return
        }

        setIsProcessing(true)
        try {
            if (savedDocId) {
                // 🔹 Removal logic
                await removeSavedMovie(savedDocId)
                Alert.alert('Success', 'Movie removed from saved list!')
                if (onRefresh) onRefresh() // 🔹 Refresh the list instantly
            } else {
                // 🔹 Save logic
                await saveMovie(user.$id, { id, poster_path, title, vote_average, release_date } as Movie)
                Alert.alert('Success', 'Movie added to saved list!')
            }
        } catch (error: any) {
            if (error.code === 409) {
                Alert.alert('Info', 'Movie is already saved')
            } else {
                Alert.alert('Error', `Failed to ${savedDocId ? 'remove' : 'save'} movie`)
            }
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <View className='w-[30%] relative'>
            <Link href={`/movies/${id}`} asChild>
                <TouchableOpacity>
                    <Image
                        source={{
                            uri: poster_path
                                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                                : 'https://placehold.co/600x400/1a1a1a/FFFFFF.png',
                        }}
                        className='w-full h-52 rounded-2xl'
                        resizeMode='cover'
                    />

                    <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>
                        {title}
                    </Text>

                    <View className='flex-row items-center justify-start gap-x-1'>
                        <Image source={icons.star} className='size-4' />
                        <Text className='text-xs text-white font-bold uppercase'>
                            {Math.round(vote_average / 2)}
                        </Text>
                    </View>

                    <View className='flex-row items-center justify-between'>
                        <Text className='text-xs text-light-300 font-medium mt-1'>
                            {release_date?.split('-')[0]}
                        </Text>
                        <Text className='text-xs font-medium text-light-300 uppercase'>
                            Movie
                        </Text>
                    </View>
                </TouchableOpacity>
            </Link>

            <TouchableOpacity
                onPress={handleAction}
                className='absolute top-2 right-2 bg-black/60 p-2 rounded-lg'
                disabled={isProcessing}
            >
                <Image
                    source={icons.save}
                    className='size-4'
                    tintColor={isProcessing ? '#FF8F71' : (savedDocId ? '#FF4B4B' : '#fff')}
                />
            </TouchableOpacity>
        </View>
    )
}

export default MovieCard
