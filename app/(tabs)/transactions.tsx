import { CustomButton } from "@/components/custom-button";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<
    {
      id: string;
      type: string;
      amount: number;
      currency: string;
      note?: string;
      date?: string;
    }[]
  >([]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/transactions");
      if (!res.ok) throw new Error("Error al obtener transacciones");

      const data = await res.json();
      setTransactions(data);
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
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text style={globalStyles.subtitle}>{item.type}</Text>
            <Text style={globalStyles.text}>
              {item.amount} {item.currency}
            </Text>
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
