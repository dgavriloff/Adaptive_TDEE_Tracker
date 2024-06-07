import {react, useContext} from "react";
import { View, Text } from "react-native";
import { Button } from "react-native";
import { AuthContext } from "../../components/AuthProvider";


const Registration = ({route }) => {
  const {logout} = useContext(AuthContext); 

  const handleLogout = () => {
    logout();
  }

  return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>    

    <Text>Registration</Text>
      
      <Button title="Logout" onPress={handleLogout}/>
    

  </View>

  );
}

export default Registration;