import { CustomButton } from "@/components/custom-button";
import { FlatList, Text, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

const mockTransactions = [
  { id: "1", type: "Ingreso", amount: 200, currency: "MXN" },
  { id: "2", type: "Egreso", amount: 50, currency: "USD" },
];

export default function TransactionsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Transacciones</Text>

      <FlatList
        data={mockTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text style={globalStyles.subtitle}>{item.type}</Text>
            <Text style={globalStyles.text}>
              {item.amount} {item.currency}
            </Text>
          </View>
        )}
      />
      <CustomButton title="Filtrar" onPress={() => {}} />
    </View>
  );
}
