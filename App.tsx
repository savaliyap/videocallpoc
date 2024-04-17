import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ConnectionServiceContext } from './src/services/ConnectionContext';
import { useMemo } from 'react';
import { ConnectionService } from './src/services/ConnectionService';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator } from './src/navigation/router';

export default function App() {

  const connectionService = useMemo(() => new ConnectionService(), []);
  // const connectionService = new ConnectionService();
  connectionService.init();
	
	const ConnectionServiceProvider = ({ children }) => {
		return (
			<ConnectionServiceContext.Provider value={connectionService}>
				{children}
			</ConnectionServiceContext.Provider>
		);
	};

  return (
    <View style={styles.container}>

      {/* <Text>Open up App.tsx to start working on your app!</Text> */}
      <NavigationContainer>
        <ConnectionServiceProvider>

          <MainNavigator />
        </ConnectionServiceProvider>

      <StatusBar style="auto" />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
