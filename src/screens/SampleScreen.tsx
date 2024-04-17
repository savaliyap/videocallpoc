import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useConnectionService } from '../services/ConnectionContext'

const SampleScreen = () => {

    const connectionService = useConnectionService();

    const [remoteUserId, setRemoteUserId] = useState('');
    
    const handleCallPress = () => {
        connectionService.emit('calling', { id: { id: +(remoteUserId) } })
    }


    return (
        <View style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
            <TextInput
                style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20, width: '80%' }}
                placeholder="Enter Remote ID"
                onChangeText={text => setRemoteUserId(text)} // Capture userId input
                value={remoteUserId} // Set the value of TextInput to the userId state
            />
            <TouchableOpacity onPress={handleCallPress}>
                <Text>Call {remoteUserId}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SampleScreen

const styles = StyleSheet.create({})