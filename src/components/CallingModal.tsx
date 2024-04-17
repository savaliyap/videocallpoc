import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { MediaStream, RTCView } from 'react-native-webrtc';

type CallingModelProps ={
    onCancelCall: () => void;
    callingUserName: string
    navigation?: any,
    stream: MediaStream
}

const CallingModelModal = ({ callingUserName, onCancelCall, navigation, stream }: CallingModelProps) => {
  console.log(navigation, 'NAVIGATION');

  	useEffect(() => {
		console.log(stream);
		
	}, [stream])
  
	return (
		<View style={{flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
			{stream && <RTCView style={styles.video} streamURL={stream.toURL()} />}
			<View style={styles.callingUserName}>
				<Text style={{ color: 'white', fontSize: 35, fontWeight: '600', marginBottom: 10 }}>Calling User</Text>
				<Text style={{ color: 'white', fontSize: 20 }}>Calling</Text>
			</View>
			<View style={styles.cancelCall}>
				<View style={{ height: 100, width: '100%', marginBottom: 100, flexDirection: 'row', alignItems:'center', justifyContent: 'center' }}>

				<Pressable onPress={onCancelCall}>
					<View  style={{ width:80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', transform: [{ rotate: '180deg' }]  }}>
						<FontAwesome name="phone" size={40} color="white" />
					</View>
				</Pressable>
				</View>
			</View>
		</View>
	)
}

export default CallingModelModal

const styles = StyleSheet.create({
	video: { 
		width: '100%',
		height: '100%'
	},
	callingUserName: {
		height: '50%',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0
	},
	cancelCall: {
		height: '50%',
		justifyContent: 'flex-end',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0
	}
})