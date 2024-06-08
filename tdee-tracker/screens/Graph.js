import {react, useContext} from "react";
import { View, Text } from "react-native";
import { Button } from "react-native";
import { AuthContext } from "../components/AuthProvider";
import NavigationBar from "../components/NavigationBar";

const Graph = () => {
  const {logout} = useContext(AuthContext); 

  const handleLogout = () => {
    logout();
  }

  return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>    

    <Text>Graph</Text>
      
      <Button title="Logout" onPress={handleLogout}/>
    
      <NavigationBar />
  </View>

  );
}

export default Graph;