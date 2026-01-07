import { Register } from "@/lib/database/user";
import { router } from "expo-router";
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";


export default function RegisterScreen() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

  const handleRegister = async () => {
    if (!email || !password ) return;
    setErrorMessage("");
    if (password !== confirmPassword) {
        setErrorMessage("Les mots de passe ne correspondent pas.");
        return;
    }
    try {
      const { user, message } = await Register(email, password);
      console.log(message);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error(error);
      setErrorMessage("Une erreur s'est produite lors de l'inscription.");
    }
  };


  return (
    <View>
      <Text>Register</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <TouchableOpacity onPress={ handleRegister }>
        <Text>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={ () => { router.replace("/(auth)/login") } }>
            <Text>Login</Text>
        </TouchableOpacity>
        {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
    </View>
  );
}