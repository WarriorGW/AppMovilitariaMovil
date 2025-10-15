import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function AddScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Agregar Moneda</Text>

      <TextInput
        placeholder="Cantidad"
        keyboardType="numeric"
        style={globalStyles.input}
      />
      <TextInput
        placeholder="Tipo de Moneda (ej: MXN, USD)"
        style={globalStyles.input}
      />

      <TouchableOpacity style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}
