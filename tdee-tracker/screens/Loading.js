import {react, useContext} from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { AuthContext } from "../components/AuthProvider";


const Loading = () => {

  return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

export default Loading;