import React, { useContext, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { AuthContext } from '../components/AuthProvider';
import { TextInput } from 'react-native-gesture-handler';



const Login = () => {
  const { login, register, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setError(null);
    try {
      login(email, password)
    } catch (err){
      if (err.code === 'auth/invalid-email')
        setError('Invalid Email')
      console.log('handle login error', err.code)
    }
  }

  const handleRegister = () => {
    setError(null);
    try {
      register(email, password)
    } catch (err){
        console.log('handle register error', err.code)
        setError(err.code)
    }
  }




  return(
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Login Screen</Text>
    {error && <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text>}
      
    <Button title='login' onPress={handleLogin}/>
      <Button title='register' onPress={handleRegister}/>
      <TextInput 
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 200 }}
      />
      <TextInput 
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        //secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, width: 200 }}
      />

    
    {isLoading && <ActivityIndicator style={{ marginTop: 20 }} />}

  </View>
  );
}

export default Login;