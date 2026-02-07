import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";



const API_URL = "https://backend-adyb.onrender.com";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Complete todos los campos");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.msg || "Credenciales inválidas");
        return;
      }

      // ✅ GUARDAMOS SESIÓN
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      // ✅ VAMOS AL DASHBOARD
      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };
   



  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 PetNice</Text>

      <TextInput
        placeholder="Correo"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#ccc"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {loading ? "Ingresando..." : "Entrar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#3D5B37",
  },
  title: {
    fontSize: 30,
    color: "#E8FFC8",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#FFFDEB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#A6C48A",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#1F2D17",
  },
});
