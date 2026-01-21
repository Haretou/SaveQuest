import { Register } from "@/lib/database/user";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function RegisterScreen() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

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
    <View style={styles.main}>
      <View style={styles.card}>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Veuillez remplir les champs ci-dessous pour créer votre compte</Text>

        <View style={styles.container}>

          <View>

            <Text>Email</Text>
          <TextInput style={styles.textinput} placeholder="" value={email} onChangeText={setEmail} />
          <View style={styles.passwordTitle}>
            <Text>Password</Text>
            <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
              <Text style={styles.showPasswordText}>{showPassword ? 'Masquer' : 'Afficher'}</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={styles.textinput} placeholder="" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />

          </View>

          <View style={styles.buttonsContainer}>

            <TouchableOpacity style={styles.loginButton} onPress={ handleRegister }>
              <Text style={styles.loginText}>Créer un compte</Text>
            </TouchableOpacity>

            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}

          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Vous avez déjà un compte ?</Text>
            <TouchableOpacity style={styles.registerButton} onPress={ () => { router.replace("/(auth)/login") } }><Text style={[styles.registerText, styles.underline]}>Se connecter</Text></TouchableOpacity>
          </View>


        </View>



      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  main: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  card: {
    width: '80%',
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.xl,
    // alignItems: 'center',
    // justifyContent: 'center',
    borderRadius: theme.radius.sm,
    borderWidth: 0.7,
    borderColor: '#00000030',
    padding: theme.spacing.lg,
    boxShadow: '0px 0px 4px #00000020',
  },
  title: {
    fontSize: theme.fonts.size.md,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fonts.size.sm,
    marginBottom: theme.spacing.lg,
  },

  container: {
    justifyContent: 'space-between',
    gap: theme.spacing.xl,
  },

  passwordTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  forgotPasswordButton: {
    padding: 0,
    margin: 0,
    height: 'auto',
  },
  forgotPassword: {
    color: theme.colors.text,
    fontSize: theme.fonts.size.sm,
  },
  showPasswordText: {
    color: theme.colors.text,
    fontSize: theme.fonts.size.sm,
    marginLeft: theme.spacing.xs,
  },
  textinput: {
    borderWidth: 1,
    borderColor: '#00000030',
    borderRadius: theme.radius.xs,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },

  buttonsContainer: {
    gap: theme.spacing.sm,
  },

  loginButton: {
    width: '100%',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.radius.xs,
  },
  loginText: {
    color: '#FFFFFF',
  },

  googleLoginButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.radius.xs,
    borderWidth: 1,
    borderColor: '#00000030',
  },

  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  registerText: {
    fontSize: theme.fonts.size.sm,
    alignItems: 'center',
  },

  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.xs,
  },

  underline: {
    textDecorationLine: 'underline',
  }
});