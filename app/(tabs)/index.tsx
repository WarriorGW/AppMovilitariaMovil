import { CustomButton } from "@/components/custom-button";
import { Text, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function IndexScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Dashboard</Text>
      <Text style={globalStyles.text}>Balance total: $0.00</Text>

      <CustomButton title="Ver Transacciones" onPress={() => {}} />
      <CustomButton title="Ir a Wallets" onPress={() => {}} />
    </View>
  );
}
