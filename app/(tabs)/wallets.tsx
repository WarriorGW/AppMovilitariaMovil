import { CustomButton } from "@/components/custom-button";
import { FlatList, Text, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

const mockWallets = [
  { id: "1", name: "Pesos MXN", balance: 500 },
  { id: "2", name: "Dólares USD", balance: 120 },
];

export default function WalletsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Wallets</Text>

      <FlatList
        data={mockWallets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={globalStyles.card}>
            <Text style={globalStyles.subtitle}>{item.name}</Text>
            <Text style={globalStyles.text}>Balance: ${item.balance}</Text>
          </View>
        )}
      />

      <CustomButton title="Agregar Wallet" onPress={() => {}} />
    </View>
  );
}
