import { CustomButton } from "@/components/custom-button";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<
    {
      id: string;
      walletName: string;
      totalAmount: number;
      note?: string;
      date?: string;
    }[]
  >([]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/transactions");
      if (!res.ok) throw new Error("Error al obtener transacciones");

      const data = await res.json();

      // 🔄 Adaptar los campos al formato del backend
      const mapped = data.map((t: any) => ({
        id: t.id.toString(),
        walletName: t.wallet?.name || "Sin nombre",
        totalAmount: t.totalAmount,
        note: t.note,
        date: new Date(t.date).toLocaleDateString(),
      }));

      setTransactions(mapped);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudieron cargar las transacciones.");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Transacciones</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text style={globalStyles.subtitle}>{item.walletName}</Text>
            <Text style={globalStyles.text}>Monto: ${item.totalAmount}</Text>
            {item.note && (
              <Text style={globalStyles.text}>Nota: {item.note}</Text>
            )}
            {item.date && (
              <Text style={globalStyles.text}>Fecha: {item.date}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={globalStyles.text}>
            No hay transacciones registradas.
          </Text>
        }
      />

      <CustomButton title="Actualizar" onPress={fetchTransactions} />
    </View>
  );
}
