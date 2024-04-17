import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VideoCallAppUsingSocket from "../components/VideoCallAppUsingSocket";
import { useConnectionService } from "../services/ConnectionContext";
import React, { useState } from "react";
import IncomingCallModal from "../components/IncomingCallModal";
import { Modal, TouchableOpacity, Text } from "react-native";
import CallingModelModal from "../components/CallingModal";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import Authentication from "../screens/Authentication";
import SampleScreen from "../screens/SampleScreen";


export type MainNavigatorParams = {
	Login: {
		wasLoggedOut: boolean;
	};
	Main: undefined;
};

export type AppNavigationStackParamList = {
	SampleScreen: undefined
};

const AppNavigator = ({ navigation }: { navigation: NavigationProp<ParamListBase> }) => {
	const Stack = createNativeStackNavigator<AppNavigationStackParamList>();
    let userInfo = { id: 15802 };
	const [incomingCallModelVisible, setIncomingCallModelVisible] = useState(false);
	const [callingModelVisible, setCallingModelVisible] = useState(false);
	const [videoCallModelVisible, setVideoCallModelVisible] = useState(false);
	const [calleeName, setCalleeName] = useState('');
	const [callingName, setCallingName] = useState('')
	const connectionService = useConnectionService();
	connectionService.on('newCall', (data) => {
		console.log(data, 'NEW CALL DATA');
		
		setCalleeName(data.recipientName)
		setIncomingCallModelVisible(true);
	})

	connectionService.on('calling', async (chatUser) => {
		console.log(chatUser);
		
		setCallingName(`${chatUser.id.title} ${chatUser.id.firstName} ${chatUser.id.lastName}`)
		setCallingModelVisible(true);
		await connectionService.call(chatUser);
		
	});

	connectionService.on('callEnded', async () => {
		setVideoCallModelVisible(false);
	});

	connectionService.on('callCancelled', async () => {
		setIncomingCallModelVisible(false);
		setCalleeName('');
	});

	connectionService.on('callAnswered', async () => {
		setCallingModelVisible(false);
		setCalleeName('');
		setIncomingCallModelVisible(false);
		setVideoCallModelVisible(true);
		// navigation.navigate("Main", {
		// 	screen: "VideoCall",
		// 	params: {
		// 		localStream: connectionService.localStream,
		// 		remoteStream: connectionService.remoteStream
		// 	}
		// });
	});

	connectionService.on('callRejected', async () => {
		setCallingModelVisible(false);
		setCallingName('');
	})

	// if(userInfo) {
	// 	connectionService.connectUser(userInfo.id.toString());
	// }

	const callEnded = async () => {
		setVideoCallModelVisible(false);
		connectionService.hangupCall();
	}

	const acceptCall = async () => {
		await connectionService.acceptCall();
		setIncomingCallModelVisible(false);
		setVideoCallModelVisible(true);

		// navigation.navigate("Main", {
		// 	screen: "VideoCall",
		// 	params: {
		// 		localStream: connectionService.localStream,
		// 		remoteStream: connectionService.remoteStream
		// 	}
		// });
	}

	const rejectCall = async () => {
		setIncomingCallModelVisible(false);
		setCalleeName('');
		await connectionService.rejectCall();
	}

	const cancelCall = async () => {
		setCallingModelVisible(false);
		await connectionService.cancelCall();
	}

	return (
		<>
			<Stack.Navigator>
				<Stack.Screen name="SampleScreen"
					options={{
						headerShown: false
					}}
				component={SampleScreen} />
			</Stack.Navigator>
			<Modal animationType="slide" visible={incomingCallModelVisible} onRequestClose={() => {}}>
				<IncomingCallModal incomingCalleeName={calleeName}  onAccept={() => acceptCall()} onReject={() => rejectCall()}/>
			</Modal>
			<Modal animationType="slide" visible={callingModelVisible} onRequestClose={() => {}}>
				<CallingModelModal stream={connectionService.localStream} callingUserName={callingName} onCancelCall={() => cancelCall()} />
			</Modal>
			<Modal animationType="slide" visible={videoCallModelVisible} onRequestClose={() => {}}>
				<VideoCallAppUsingSocket  onHangUpCall={() => callEnded()}  />
			</Modal>
		</>
  );
};

export const MainNavigator = ({}) => {
	const Stack = createNativeStackNavigator<MainNavigatorParams>();
    
	return (
		    <Stack.Navigator initialRouteName="Login">
    			<Stack.Screen name="Login"
    				options={{
    				title: 'Login',
    				headerShown: false,
    				}}
    				component={Authentication} />
    			<Stack.Screen
    				name="Main"
    				options={{
    				title: 'Main',
    				headerShown: false,
    				}}
    				component={AppNavigator} />
    		</Stack.Navigator>
		// <>
        //     {/* <TouchableOpacity style={{ width: '100%', height: 200 }}>
        //         <Text style={{ fontSize: 25, color:'green' }}>Login2</Text>
        //     </TouchableOpacity> */}
		// </>
  );
};