import { CustomButton } from "@/components/custom-button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function AddScreen() {
  const [wallets, setWallets] = useState<{ id: string; name: string }[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [entries, setEntries] = useState<
    { id: string; denom: string; qty: number }[]
  >([]);

  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 🟥 ERRORES
  const [errors, setErrors] = useState({
    wallet: false,
    entries: false,
    denomination: {} as Record<string, boolean>,
    quantity: {} as Record<string, boolean>,
  });

  const fetchWallets = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/wallets");
      if (!res.ok) throw new Error("Error al obtener wallets");

      const data = await res.json();
      setWallets(data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudieron cargar las wallets.");
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

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

  const handleSave = async () => {
    let valid = true;

    // Reset errores
    const newErrors = {
      wallet: false,
      entries: false,
      denomination: {},
      quantity: {},
    };

    if (!selectedWallet) {
      newErrors.wallet = true;
      valid = false;
    }

    if (entries.length === 0) {
      newErrors.entries = true;
      valid = false;
    }

    entries.forEach((e) => {
      if (!e.denom) {
        newErrors.denomination[e.id] = true;
        valid = false;
      }
      if (!e.qty || e.qty <= 0) {
        newErrors.quantity[e.id] = true;
        valid = false;
      }
    });

    setErrors(newErrors);

    if (!valid) return;

    // Mapa de valores
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

    const denominationsData = entries.map((e) => ({
      value: denomMap[e.denom],
      amount: e.qty,
    }));

    try {
      const res = await fetch("http://localhost:4000/api/wallets/add", {
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
        Alert.alert("Error", data.message || "Error al guardar.");
        return;
      }

      Alert.alert("Éxito", "Fondos agregados correctamente.");
      setEntries([]);
      setNote("");
      setDate(new Date());
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar al servidor.");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Agregar Moneda</Text>

      <Text style={globalStyles.text}>Seleccionar Wallet:</Text>

      {/* 🟥 Error visual */}
      {errors.wallet && (
        <Text style={{ color: "red", marginBottom: 5 }}>
          Selecciona una wallet.
        </Text>
      )}

      <FlatList
        data={wallets}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ alignItems: "center" }}
        style={{ maxHeight: 60 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              globalStyles.buttonSmall,
              {
                backgroundColor:
                  selectedWallet === item.id ? "#222" : "#4A6CF7",
                paddingHorizontal: 20,
                marginRight: 10,
                borderColor:
                  errors.wallet && selectedWallet !== item.id
                    ? "red"
                    : "transparent",
                borderWidth: 2,
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

      {errors.entries && (
        <Text style={{ color: "red" }}>Agrega al menos una denominación.</Text>
      )}

      {entries.map((item) => (
        <View
          key={item.id}
          style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}
        >
          <View style={{ flex: 1 }}>
            <Picker
              selectedValue={item.denom}
              onValueChange={(v) => updateEntry(item.id, "denom", v)}
              style={{
                height: 44,
                borderWidth: 2,
                borderColor: errors.denomination[item.id] ? "red" : "#ccc",
              }}
            >
              <Picker.Item label="Seleccionar" value="" />
              {Object.keys({
                "Moneda 1 MXN": 1,
                "Moneda 2 MXN": 2,
                "Moneda 5 MXN": 5,
                "Moneda 10 MXN": 10,
                "Billete 20 MXN": 20,
                "Billete 50 MXN": 50,
                "Billete 100 MXN": 100,
                "Billete 200 MXN": 200,
                "Billete 500 MXN": 500,
              }).map((d) => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>

            {errors.denomination[item.id] && (
              <Text style={{ color: "red", marginTop: 2 }}>
                Selecciona una denominación.
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Cantidad"
              keyboardType="numeric"
              value={item.qty.toString()}
              onChangeText={(v) => updateEntry(item.id, "qty", v)}
              style={[
                globalStyles.input,
                {
                  borderColor: errors.quantity[item.id] ? "red" : "#ccc",
                },
              ]}
            />

            {errors.quantity[item.id] && (
              <Text style={{ color: "red", marginTop: 2 }}>
                Ingresa una cantidad válida.
              </Text>
            )}
          </View>
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
          onChange={(_, d) => {
            setShowDatePicker(false);
            if (d) setDate(d);
          }}
        />
      )}

      <CustomButton title="Guardar" onPress={handleSave} />
    </View>
  );
}
