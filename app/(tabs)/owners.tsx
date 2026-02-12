import { apiFetch } from "@/services/api";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function OwnersScreen() {
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingOwner, setEditingOwner] = useState<any | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const loadOwners = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/api/owners");
      setOwners(data);
    } catch {
      Alert.alert("Error", "No se pudieron cargar propietarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, []);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setEditingOwner(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "Nombre y apellido son obligatorios");
      return;
    }

    try {
      if (editingOwner) {
        await apiFetch(`/api/owners/${editingOwner._id}`, {
          method: "PUT",
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
          }),
        });
      } else {
        await apiFetch("/api/owners", {
          method: "POST",
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
          }),
        });
      }

      resetForm();
      loadOwners();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const deleteOwner = async (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar propietario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            await apiFetch(`/api/owners/${id}`, {
              method: "DELETE",
            });
            loadOwners();
          } catch {
            Alert.alert("Error", "No se pudo eliminar");
          }
        },
      },
    ]);
  };

  const startEdit = (owner: any) => {
    setEditingOwner(owner);
    setFirstName(owner.first_name);
    setLastName(owner.last_name);
    setEmail(owner.email || "");
    setPhone(owner.phone || "");
    setShowForm(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Propietarios</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setShowForm(!showForm);
          setEditingOwner(null);
        }}
      >
        <Text style={styles.addText}>
          {showForm ? "Cancelar" : "+ Nuevo Propietario"}
        </Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.form}>
          <TextInput
            placeholder="Nombre"
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            placeholder="Apellido"
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            placeholder="Correo"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Teléfono"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity style={styles.save} onPress={handleSave}>
            <Text style={{ fontWeight: "bold" }}>
              {editingOwner ? "Actualizar" : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={owners}
        keyExtractor={(item) => item._id}
        refreshing={loading}
        onRefresh={loadOwners}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.first_name} {item.last_name}
            </Text>
            <Text>{item.email}</Text>
            <Text>{item.phone}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.edit}
                onPress={() => startEdit(item)}
              >
                <Text style={{ color: "#fff" }}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.delete}
                onPress={() => deleteOwner(item._id)}
              >
                <Text style={{ color: "#fff" }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#3D5B37",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E8FFC8",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#A6C48A",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  form: {
    backgroundColor: "#FFFDEB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  save: {
    backgroundColor: "#A6C48A",
    padding: 12,
    borderRadius: 8,
  },
  card: {
    backgroundColor: "#FFFDEB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
  edit: {
    backgroundColor: "#6BA368",
    padding: 8,
    borderRadius: 6,
  },
  delete: {
    backgroundColor: "#C94A4A",
    padding: 8,
    borderRadius: 6,
  },
});
