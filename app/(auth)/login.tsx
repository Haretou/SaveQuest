import { Login } from "@/lib/database/user";
import { router } from "expo-router";
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";


export default function LoginScreen() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

  const handleLogin = async () => {
    if (!email || !password) return;
    setErrorMessage("");
    try {
        const { user, message } = await Login(email, password);
        console.log(message);
        router.replace("/(tabs)");
    } catch (error) {
        console.error(error);
        setErrorMessage("Une erreur s'est produite lors de la connexion.");
    }
  };
  

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity onPress={ handleLogin }>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => { router.replace("/(auth)/register") } }>
        <Text>Register</Text>
      </TouchableOpacity>
        {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
    </View>
  );
}