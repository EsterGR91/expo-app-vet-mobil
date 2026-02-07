import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👋 Bienvenida</Text>

      <Text style={styles.subtitle}>
        {user ? user.full_name : "Usuario autenticado"}
      </Text>

    <TouchableOpacity
  style={styles.logout}
  onPress={async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("/");
  }}
>
  <Text style={styles.logoutText}>Cerrar sesión</Text>
</TouchableOpacity>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3D5B37",
  },
  title: {
    fontSize: 26,
    color: "#E8FFC8",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    marginTop: 8,
  },
  logout: {
    marginTop: 20,
    backgroundColor: "#C94A4A",
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
