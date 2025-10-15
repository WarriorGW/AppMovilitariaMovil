import { Text, TouchableOpacity } from "react-native";
import { globalStyles } from "../app/styles/globalStyles";

interface Props {
  title: string;
  onPress: () => void;
}

export const CustomButton = ({ title, onPress }: Props) => (
  <TouchableOpacity style={globalStyles.button} onPress={onPress}>
    <Text style={globalStyles.buttonText}>{title}</Text>
  </TouchableOpacity>
);
