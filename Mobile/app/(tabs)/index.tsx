import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import ListaCompras from "../../components/list/listComponent";
import Header from "../../components/Header/header";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Defina o tipo das rotas
type RootStackParamList = {
  index: undefined;
  Adicionar: undefined;
  Lista: undefined;
};

// Definição do tipo de Compra
type Compra = {
  _id: string;
  categoria: string;
  dataCompra: string;
  descricao: string;
  valor: number;
};

const Index = () => {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Lista">>();
  const [refreshing, setRefreshing] = useState(false);
  const [weeklySpending, setWeeklySpending] = useState<number | null>(null);

  // Função para buscar os gastos da semana
  const fetchWeeklySpending = async () => {
    try {
      const response = await fetch("http://10.50.186.239:3000/compras");
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const data: Compra[] = await response.json();

      const hoje = new Date();
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(hoje.getDate() - 7);

      const weeklyPurchases = data.filter((compra) => {
        const dataCompra = new Date(compra.dataCompra);
        return dataCompra >= seteDiasAtras && dataCompra <= hoje;
      });

      const total = weeklyPurchases.reduce(
        (sum, compra) => sum + compra.valor,
        0
      );

      setWeeklySpending(total);
    } catch (error) {
      console.error("Erro ao buscar gastos da semana:", error);
    } finally {
      setRefreshing(false); // Finaliza o refresh
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeeklySpending();
  };

  useEffect(() => {
    fetchWeeklySpending();
  }, []);

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.headerspace}>
        <Header />
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ backgroundColor: "#f4f4f4" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            style={styles.refreshControl}
          />
        }
      >
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("Lista")}>
            <Text style={styles.h2}> Relatório de gastos &gt; </Text>
          </TouchableOpacity>

          <Text style={styles.price}>
            {weeklySpending !== null
              ? `R$ ${weeklySpending.toFixed(2)}`
              : "Carregando..."}
          </Text>

          <Text style={styles.p}>Essa semana</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate("Lista")}>
            <Text style={styles.h2}>Compras recentes &gt; </Text>
          </TouchableOpacity>
        </View>
        <View>
          <ListaCompras />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  refreshControl: {
    backgroundColor: "#f4f4f4",
  },
  headerspace: {
    backgroundColor: "#f4f4f4",
  },
  safearea: {
    flex: 1,
    backgroundColor: "#2D7B8A",
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
  },
  h2: {
    fontSize: 20,
    fontWeight: "200",
    paddingBottom: 25,
  },
  p: {
    fontSize: 12,
    fontWeight: "200",
    paddingBottom: 25,
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
  },
});
