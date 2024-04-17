import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useConnectionService } from '../services/ConnectionContext';

type AuthenticationProps = {
  navigation?: NavigationProp<ParamListBase>;

}

const Authentication = ({ navigation }: AuthenticationProps) => {

    const connectionService = useConnectionService();

    const [userId, setUserId] = useState('');
    const handleLoginPress = () => {
        connectionService.setCurrentUserId(userId);
        connectionService.connectUser(userId);
        navigation.navigate("Main", {
            screen: "SampleScreen",
        });
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextInput
                style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20, width: '80%' }}
                placeholder="Enter User ID"
                onChangeText={text => setUserId(text)} // Capture userId input
                value={userId} // Set the value of TextInput to the userId state
            />
            <TouchableOpacity style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }} onPress={handleLoginPress}>
                <Text style={{ fontSize: 25, color:'green' }}>Login</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Authentication

const styles = StyleSheet.create({})