import { CustomButton } from "@/components/custom-button";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { globalStyles } from "../styles/globalStyles";

export default function IndexScreen() {
  const navigation = useNavigation();
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactions, setTransactions] = useState<
    { totalAmount: number; date: string }[]
  >([]);

  const fetchData = async () => {
    try {
      // 🔹 Obtener wallets
      const resWallets = await fetch("http://localhost:4000/api/wallets");
      const walletsData = await resWallets.json();
      const balanceSum = walletsData.reduce(
        (acc: any, w: any) => acc + w.balance,
        0
      );
      setTotalBalance(balanceSum);

      // 🔹 Obtener transacciones
      const resTx = await fetch("http://localhost:4000/api/transactions");
      const txData = await resTx.json();
      const mappedTx = txData.map((t: any) => ({
        totalAmount: t.totalAmount,
        date: new Date(t.date).toLocaleDateString(),
      }));
      setTransactions(mappedTx);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo cargar información del dashboard.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Preparar datos para la gráfica (últimas 7 transacciones)
  const chartData = {
    labels: transactions.slice(-7).map((t) => t.date),
    datasets: [
      {
        data: transactions.slice(-7).map((t) => t.totalAmount),
        color: (opacity = 1) => `rgba(74, 108, 247, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Dashboard</Text>
      <Text style={[globalStyles.text, { marginVertical: 10 }]}>
        Balance total: ${totalBalance.toFixed(2)}
      </Text>
      <Text style={globalStyles.text}>
        Total de transacciones: {transactions.length}
      </Text>

      {transactions.length > 0 && (
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(74, 108, 247, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "4", strokeWidth: "2", stroke: "#4A6CF7" },
          }}
          style={{ marginVertical: 20, borderRadius: 16 }}
        />
      )}

      <CustomButton
        title="Ver Transacciones"
        onPress={() => navigation.navigate("transactions")}
      />
      <CustomButton
        title="Ir a Wallets"
        onPress={() => navigation.navigate("wallets")}
      />
    </View>
  );
}
