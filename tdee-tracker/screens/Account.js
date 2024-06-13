import {react, useContext} from "react";
import { View, Text } from "react-native";
import { Button } from "react-native";
import { AuthContext } from "../components/AuthProvider";
import { useNavigationContext } from "../components/NavigationContext";
import NavigationBar from "../components/NavigationBar";
import { useNavigation} from '@react-navigation/native';


const Account = ({ navigation }) => {
  const {logout} = useContext(AuthContext); 
  const { setActiveTab } = useNavigationContext()

  const nav = useNavigation();

  const handleLogout = () => {
    logout();
  }

  return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>    

    <Text>Account</Text>
      
      <Button title="Logout" onPress={handleLogout}/>
      <Button title="Upload MyFitnessPal Data" onPress={() => nav.navigate('Upload Data')}/>
    
      <NavigationBar />
  </View>

  );
}

export default Account;