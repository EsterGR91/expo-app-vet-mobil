import { apiFetch } from "@/services/api";
import DateTimePicker from "@react-native-community/datetimepicker";
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
    View
} from "react-native";

export default function AppointmentsScreen() {
  const router = useRouter();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const [form, setForm] = useState({
    patient: "",
    scheduled_for: "",
    status: "PENDING",
    notes: "",
  });

  // ===============================
  // CARGAR DATOS
  // ===============================
  const loadData = async () => {
    try {
      const appointmentsData = await apiFetch("/api/appointments");
      const patientsData = await apiFetch("/api/patients");

      setAppointments(appointmentsData);
      setPatients(patientsData);
    } catch {
      Alert.alert("Error", "No se pudo cargar información");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ===============================
  // CALENDARIO SEGURO ANDROID
  // ===============================
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (event?.type === "set" && selectedDate) {
      setDate(selectedDate);

      setForm((prev) => ({
        ...prev,
        scheduled_for: selectedDate.toISOString(),
      }));
    }
  };

  // ===============================
  // FORMATEAR FECHA BONITA
  // ===============================
  const formatDate = (iso: string) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  // ===============================
  // GUARDAR
  // ===============================
  const handleSave = async () => {
    try {
      if (!form.patient || !form.scheduled_for) {
        Alert.alert("Error", "Complete los campos requeridos");
        return;
      }

      if (editingId) {
        await apiFetch(`/api/appointments/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/api/appointments", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setForm({
        patient: "",
        scheduled_for: "",
        status: "PENDING",
        notes: "",
      });

      setEditingId(null);
      loadData();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // ===============================
  // EDITAR
  // ===============================
  const handleEdit = (item: any) => {
    setEditingId(item._id);

    const parsedDate = new Date(item.scheduled_for);

    setDate(parsedDate);

    setForm({
      patient: item.patient?._id || "",
      scheduled_for: parsedDate.toISOString(),
      status: item.status,
      notes: item.notes || "",
    });
  };

  // ===============================
  // ELIMINAR
  // ===============================
  const handleDelete = async (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar cita?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await apiFetch(`/api/appointments/${id}`, {
            method: "DELETE",
          });
          loadData();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.backText}>← Volver al Dashboard</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📅 Gestión de Citas</Text>

      <View style={styles.card}>
        {/* PACIENTE */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.patient}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, patient: value }))
            }
          >
            <Picker.Item label="Seleccione paciente" value="" />
            {patients.map((p) => (
              <Picker.Item
                key={p._id}
                label={`${p.name} (${p.species})`}
                value={p._id}
              />
            ))}
          </Picker>
        </View>

        {/* FECHA */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >
          <Text>
            {form.scheduled_for
              ? formatDate(form.scheduled_for)
              : "Seleccionar fecha y hora"}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}

        {/* ESTADO */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={form.status}
            onValueChange={(value) =>
              setForm((prev) => ({ ...prev, status: value }))
            }
          >
            <Picker.Item label="Pendiente" value="PENDING" />
            <Picker.Item label="Completada" value="COMPLETED" />
            <Picker.Item label="Cancelada" value="CANCELLED" />
          </Picker>
        </View>

        {/* NOTAS */}
        <TextInput
          placeholder="Notas"
          style={styles.input}
          value={form.notes}
          onChangeText={(text) => setForm((prev) => ({ ...prev, notes: text }))}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>
            {editingId ? "Actualizar Cita" : "Registrar Cita"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      {appointments.map((item) => (
        <View key={item._id} style={styles.listCard}>
          <Text style={styles.name}>
            {item.patient?.name} — {item.status}
          </Text>

          <Text>{formatDate(item.scheduled_for)}</Text>

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
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D6E4C3",
  },

  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D6E4C3",
    overflow: "hidden",
  },

  button: {
    backgroundColor: "#A6C48A",
    padding: 14,
    borderRadius: 8,
    marginTop: 4,
  },

  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#1F2D17",
  },

  listCard: {
    backgroundColor: "#FFFDEB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
  },

  edit: {
    backgroundColor: "#4A8C4A",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },

  delete: {
    backgroundColor: "#C94A4A",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
