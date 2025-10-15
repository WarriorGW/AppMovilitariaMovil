import { CustomButton } from "@/components/custom-button";
import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Configuración</Text>
      <Text style={globalStyles.text}>Modo oscuro</Text>
      <Switch value={darkMode} onValueChange={setDarkMode} />

      <CustomButton title="Cambiar idioma" onPress={() => {}} />
    </View>
  );
}
