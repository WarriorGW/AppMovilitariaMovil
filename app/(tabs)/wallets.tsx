import { CustomButton } from "@/components/custom-button";
import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Text, TextInput, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function WalletsScreen() {
  const [wallets, setWallets] = useState<
    { id: string; name: string; balance: number }[]
  >([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBalance, setNewBalance] = useState("");

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

  const handleAddWallet = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "El nombre de la wallet es obligatorio");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          balance: Number(newBalance) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setWallets((prev) => [...prev, data.wallet]);
      setModalVisible(false);
      setNewName("");
      setNewBalance("");
      Alert.alert("Éxito", data.message);
    } catch (err: any) {
      Alert.alert("Error", err.message || "No se pudo crear la wallet");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Wallets</Text>

      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text style={globalStyles.subtitle}>{item.name}</Text>
            <Text style={globalStyles.text}>Balance: ${item.balance}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={globalStyles.text}>No hay wallets registradas.</Text>
        }
      />

      <CustomButton
        title="Agregar Wallet"
        onPress={() => setModalVisible(true)}
      />

      {/* Modal para nueva wallet */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={globalStyles.title}>Nueva Wallet</Text>
            <TextInput
              placeholder="Nombre"
              value={newName}
              onChangeText={setNewName}
              style={[globalStyles.input, { marginBottom: 10 }]}
            />
            <TextInput
              placeholder="Balance inicial"
              keyboardType="numeric"
              value={newBalance}
              onChangeText={setNewBalance}
              style={[globalStyles.input, { marginBottom: 20 }]}
            />

            <CustomButton title="Guardar" onPress={handleAddWallet} />
            <CustomButton
              title="Cancelar"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
