import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/"); // 👈 tu login es index
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 VET APP</Text>
      <Text style={styles.subtitle}>Panel Principal</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/appointments")}
      >
        <Text style={styles.buttonText}>📅 Gestión de Citas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/patients")}
      >
        <Text style={styles.buttonText}>🐶 Pacientes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/owners")}
      >
        <Text style={styles.buttonText}>👤 Dueños</Text>
      </TouchableOpacity>

      {/* 🔴 BOTÓN CERRAR SESIÓN */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3D5B37",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E8FFC8",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#CFE8A9",
    textAlign: "center",
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#A6C48A",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#1F2D17",
  },

  logoutButton: {
    backgroundColor: "#C94A4A",
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
  },

  logoutText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
});
