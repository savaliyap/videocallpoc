import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FontAwesome from "react-native-vector-icons/FontAwesome";

type IncomingModelProps ={
    onAccept: () => void;
    onReject: () => void;
    incomingCalleeName: string
    navigation?: any
}

const IncomingCallModal = ({ incomingCalleeName, onAccept, onReject, navigation }: IncomingModelProps) => {
  console.log(navigation, 'NAVIGATION');
  
	return (
		<View style={{flex: 1, backgroundColor: 'black'}}>
			<View style={{ height: '50%', justifyContent: 'center', alignItems: 'center' }}>
				<Text style={{ color: 'white', fontSize: 35, fontWeight: '600', marginBottom: 10 }}>Incoming Call</Text>
				<Text style={{ color: 'white', fontSize: 20 }}>Incoming call</Text>
			</View>
			<View style={{ height: '50%', justifyContent: 'flex-end', alignItems: 'center' }}>
				<View style={{ height: 100, width: '100%', marginBottom: 100, flexDirection: 'row', alignItems:'center', justifyContent: 'space-around' }}>
				<Pressable onPress={onAccept}>
					<View style={{ width:80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
						<FontAwesome name="phone" size={40} color="white" />
					</View>
				</Pressable>
				<Pressable onPress={onReject}>
					<View  style={{ width:80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', transform: [{ rotate: '135deg' }]  }}>
						<FontAwesome name="phone" size={40} color="white" />
					</View>
				</Pressable>
				</View>
			</View>
		</View>
	)
}

export default IncomingCallModal

const styles = StyleSheet.create({})