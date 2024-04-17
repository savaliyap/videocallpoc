import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ParamListBase, NavigationProp } from '@react-navigation/native';
import { MediaStream, RTCView } from 'react-native-webrtc';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { ConnectionService } from '../services/ConnectionService';
import { useConnectionService } from '../services/ConnectionContext';

// type VideoCallScreenRouteProp = RouteProp<ParamListBase, 'VideoCall'> & {
// 	params: {
// 	  localStream: MediaStream;
// 	  remoteStream: MediaStream
// 	};
//   };
  
  type VideoCallProps = {
	navigation?: NavigationProp<ParamListBase>;
	onHangUpCall: () => void
  }

const VideoCallAppUsingSocket = ({ onHangUpCall }: VideoCallProps) => {
	const connectionService = useConnectionService();
	console.log(connectionService.remoteUserId, connectionService.currentUserId, 'FROM CALL\n\n ');
	const [videoAvailable, setVideoAvailable] = useState(true);
	const [audioAvailable, setAudioAvailable] = useState(true);

	
	const flipCamera = async () => {
		connectionService.localStream.getVideoTracks().forEach(track => {
			track._switchCamera();
		})
	}

	const videoAvailableToggle = async () => {
		setVideoAvailable(value => !value);
		connectionService.localStream.getVideoTracks().forEach(track => {
			track.enabled = !track.enabled;
		})
	}

	const audioAvailableToggle = async () => {
		setAudioAvailable(value => !value);
		connectionService.localStream.getAudioTracks().forEach(track => {
			track.enabled = !track.enabled;
		})
	}

	const hangUpCall = async () => {
		await connectionService.hangupCall();
		onHangUpCall();
	}
	return (
		<View style={{ flex: 1 }}>
			{/* {connectionService.remoteStream && <RTCView style={styles.localVideo} streamURL={connectionService.remoteStream.toURL()} />} */}
			{connectionService.remoteStream && <RTCView style={{ flex: 1 }} streamURL={connectionService.remoteStream.toURL()} />}
			{connectionService.localStream && <RTCView style={styles.localVideo} streamURL={connectionService.localStream.toURL()}/>}
			{/* {connectionService.localStream && <RTCView style={{ flex: 1 }} streamURL={connectionService.localStream.toURL()}/>} */}

			<View style={styles.callActionsContainer}>
				<Pressable onPress={flipCamera} disabled={!videoAvailable}>
					<View style={{ width:60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
						<FontAwesome6 name="camera-rotate" size={30} color={videoAvailable ? 'white' : '#d3d3d3'} />
					</View>
				</Pressable>
				<Pressable onPress={videoAvailableToggle}>
					<View style={{ width:60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128, 128, 128, 0.5)'  }}>
						{videoAvailable && <FontAwesome6 name="video-slash" size={30} color="white" />}
						{!videoAvailable && <FontAwesome6 name="video" size={30} color="white" />}
					</View>
				</Pressable>
				<Pressable onPress={audioAvailableToggle} disabled={!videoAvailable}>
					<View style={{ width:60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(128, 128, 128, 0.5)'}}>
						{audioAvailable && <FontAwesome name="microphone-slash" size={30} color="white" />}
						{!audioAvailable && <FontAwesome name="microphone" size={30} color="white" />}
					</View>
				</Pressable>
				<Pressable onPress={hangUpCall}>
					<View style={{ width:60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', transform: [{ rotate: '135deg' }]  }}>
						<FontAwesome name="phone" size={30} color="white" />
					</View>
				</Pressable>
			</View>
		</View>
	)
}

export default VideoCallAppUsingSocket

const styles = StyleSheet.create({
	localVideo: {
		borderRadius: 10,
		borderWidth: 1,
		borderColor: 'black',
		position: 'absolute',
		bottom: 20,
		right: 20,
		height: '50%',
		width: '30%',
	},
	callActionsContainer: {
		flexDirection: 'row',
		position: 'absolute',
		width: '100%',
		height: 100,
		bottom: 50,
		alignItems: 'center',
		justifyContent: 'space-evenly'
	}
})