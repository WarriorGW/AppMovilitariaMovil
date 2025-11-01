import { CustomButton } from "@/components/custom-button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";

const mockWallets = [
  { id: "1", name: "Personal" },
  { id: "2", name: "Trabajo" },
  { id: "3", name: "Maquinas" },
  { id: "4", name: "Dólares USD" },
  { id: "5", name: "Dólares USD" },
];

const denominations = [
  "Moneda 1 MXN",
  "Moneda 2 MXN",
  "Moneda 5 MXN",
  "Moneda 10 MXN",
  "Billete 20 MXN",
  "Billete 50 MXN",
  "Billete 100 MXN",
  "Billete 200 MXN",
  "Billete 500 MXN",
];

export default function AddScreen() {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [entries, setEntries] = useState<
    { id: string; denom: string; qty: number }[]
  >([]);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addEntry = () => {
    setEntries([...entries, { id: Date.now().toString(), denom: "", qty: 0 }]);
  };

  const updateEntry = (id: string, field: "denom" | "qty", value: string) => {
    setEntries((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: field === "qty" ? Number(value) : value }
          : item
      )
    );
  };

  // 💾 Guardar e integrar con backend
  const handleSave = async () => {
    if (!selectedWallet) {
      Alert.alert("Error", "Selecciona una wallet antes de guardar.");
      return;
    }

    if (entries.length === 0) {
      Alert.alert("Error", "Agrega al menos una denominación.");
      return;
    }

    // Convertir denominaciones tipo texto → valor numérico
    const denomMap: Record<string, number> = {
      "Moneda 1 MXN": 1,
      "Moneda 2 MXN": 2,
      "Moneda 5 MXN": 5,
      "Moneda 10 MXN": 10,
      "Billete 20 MXN": 20,
      "Billete 50 MXN": 50,
      "Billete 100 MXN": 100,
      "Billete 200 MXN": 200,
      "Billete 500 MXN": 500,
    };

    const denominationsData = entries
      .filter((e) => e.denom && e.qty > 0)
      .map((e) => ({
        value: denomMap[e.denom],
        amount: e.qty,
      }));

    if (denominationsData.length === 0) {
      Alert.alert(
        "Error",
        "Verifica que todas las denominaciones sean válidas."
      );
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/wallet/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletId: selectedWallet,
          denominations: denominationsData,
          note,
          date: date.toISOString().split("T")[0],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Error al guardar los datos.");
        return;
      }

      Alert.alert("Éxito", "Fondos agregados correctamente.");
      // Limpieza de campos
      setEntries([]);
      setNote("");
      setDate(new Date());
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Agregar Moneda</Text>

      <Text style={globalStyles.text}>Seleccionar Wallet:</Text>
      <FlatList
        data={mockWallets}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ alignItems: "center" }}
        style={{ maxHeight: 60 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              globalStyles.buttonSmall,
              {
                backgroundColor:
                  selectedWallet === item.id ? "#333" : "#4A6CF7",
                paddingHorizontal: 20,
                marginRight: 10,
              },
            ]}
            onPress={() => setSelectedWallet(item.id)}
          >
            <Text style={globalStyles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={[globalStyles.text, { marginTop: 20 }]}>
        Denominaciones:
      </Text>
      {entries.map((item) => (
        <View
          key={item.id}
          style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}
        >
          <Picker
            selectedValue={item.denom}
            onValueChange={(v) => updateEntry(item.id, "denom", v)}
            style={{ height: 44 }}
          >
            <Picker.Item label="Seleccionar" value="" />
            {denominations.map((d) => (
              <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>
          <TextInput
            placeholder="Cantidad"
            keyboardType="numeric"
            value={item.qty.toString()}
            onChangeText={(v) => updateEntry(item.id, "qty", v)}
            style={[globalStyles.input, { flex: 1 }]}
          />
        </View>
      ))}
      <CustomButton title="Agregar otra denominación" onPress={addEntry} />

      <TextInput
        placeholder="Nota (opcional)"
        value={note}
        onChangeText={setNote}
        style={[globalStyles.input, { marginTop: 20 }]}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={[globalStyles.text, { marginTop: 10 }]}>
          Fecha: {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <CustomButton title="Guardar" onPress={handleSave} />
    </View>
  );
}
