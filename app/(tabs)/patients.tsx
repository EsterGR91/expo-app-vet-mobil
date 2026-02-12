import { apiFetch } from "@/services/api";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function PatientsScreen() {
  const router = useRouter();

  const [patients, setPatients] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    owner: "",
  });

  const loadData = async () => {
    try {
      const patientsData = await apiFetch("/api/patients");
      const ownersData = await apiFetch("/api/owners");

      setPatients(patientsData);
      setOwners(ownersData);
    } catch {
      Alert.alert("Error", "No se pudo cargar información");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      if (!form.owner) {
        Alert.alert("Error", "Seleccione un propietario");
        return;
      }

      if (editingId) {
        await apiFetch(`/api/patients/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/api/patients", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setForm({ name: "", species: "", breed: "", owner: "" });
      setEditingId(null);
      loadData();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      species: item.species,
      breed: item.breed || "",
      owner: item.owner?._id || "",
    });
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar paciente?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await apiFetch(`/api/patients/${id}`, { method: "DELETE" });
          loadData();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* BOTÓN VOLVER */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.backText}>← Volver al Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.title}>🐾 Gestión de Pacientes</Text>

      {/* FORMULARIO */}
      <View style={styles.card}>
        <TextInput
          placeholder="Nombre"
          style={styles.input}
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />

        <TextInput
          placeholder="Especie"
          style={styles.input}
          value={form.species}
          onChangeText={(text) => setForm({ ...form, species: text })}
        />

        <TextInput
          placeholder="Raza"
          style={styles.input}
          value={form.breed}
          onChangeText={(text) => setForm({ ...form, breed: text })}
        />

        {/* DROPDOWN PROPIETARIOS */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.owner}
            onValueChange={(value) => setForm({ ...form, owner: value })}
          >
            <Picker.Item label="Seleccione un propietario" value="" />
            {owners.map((owner) => (
              <Picker.Item
                key={owner._id}
                label={`${owner.first_name} ${owner.last_name}`}
                value={owner._id}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {editingId ? "Actualizar Paciente" : "Registrar Paciente"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      {patients.map((item) => (
        <View key={item._id} style={styles.listCard}>
          <Text style={styles.name}>
            {item.name} ({item.species})
          </Text>

          <Text>
            Propietario: {item.owner?.first_name} {item.owner?.last_name}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.edit}
              onPress={() => handleEdit(item)}
            >
              <Text style={{ color: "#fff" }}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.delete}
              onPress={() => handleDelete(item._id)}
            >
              <Text style={{ color: "#fff" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#3D5B37",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E8FFC8",
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: "#E8FFC8",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#FFFDEB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#A6C48A",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  listCard: {
    backgroundColor: "#FFFDEB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
  },
  edit: {
    backgroundColor: "#4A8C4A",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  delete: {
    backgroundColor: "#C94A4A",
    padding: 8,
    borderRadius: 6,
  },
});
