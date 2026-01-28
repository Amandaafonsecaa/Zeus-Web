import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Image,
} from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Header from "../../components/Header/header";

// Definindo um tipo para o período
type Periodo = "diario" | "semanal" | "mensal";

// Definindo a interface para uma compra
interface Compra {
  _id: string;
  categoria: string;
  descricao: string;
  dataCompra: string;
  valor: number;
  loja?: string;
  image: string;
}

// Lista de categorias com ícones correspondentes
const categoriasComIcones = [
  { nome: "ração", icone: require("../../assets/images/Dog Bowl.png") },
  { nome: "saúde", icone: require("../../assets/images/Dog Paw.png") },
  { nome: "lazer", icone: require("../../assets/images/Dog Pooping.png") },
  { nome: "roupas", icone: require("../../assets/images/Dog Pee.png") },
  { nome: "outros", icone: require("../../assets/images/bone.png") },
];

const Gráficos = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [gastosPorCategoria, setGastosPorCategoria] = useState<{
    [key: string]: number;
  }>({});

  // Função para buscar as compras do backend
  const fetchCompras = async () => {
    try {
      const response = await fetch("http://10.50.186.239:3000/compras");
      const data: Compra[] = await response.json();
      console.log("Compras recebidas:", data);
      setCompras(data);
    } catch (error) {
      console.error("Erro ao buscar compras:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Função para calcular os gastos com base no período
  const calcularGastos = (periodo: Periodo) => {
    const hoje = new Date();
    let dataInicio;

    switch (periodo) {
      case "diario":
        dataInicio = new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          hoje.getDate()
        );
        break;
      case "semanal":
        dataInicio = new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          hoje.getDate() - hoje.getDay()
        );
        break;
      case "mensal":
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        break;
      default:
        dataInicio = new Date(0); // Data mínima (caso padrão)
    }

    const comprasFiltradas = compras.filter((compra) => {
      const dataCompra = new Date(compra.dataCompra);
      return dataCompra >= dataInicio && dataCompra <= hoje;
    });

    const total = comprasFiltradas.reduce(
      (acc, compra) => acc + compra.valor,
      0
    );
    setTotalGastos(total);

    const gastosPorCategoria = comprasFiltradas.reduce((acc, compra) => {
      if (!acc[compra.categoria]) {
        acc[compra.categoria] = 0;
      }
      acc[compra.categoria] += compra.valor;
      return acc;
    }, {} as { [key: string]: number });

    console.log("Gastos por categoria:", gastosPorCategoria);
    setGastosPorCategoria(gastosPorCategoria);
  };

  // Função para lidar com o refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCompras();
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  useEffect(() => {
    const periodos: Periodo[] = ["diario", "semanal", "mensal"];
    calcularGastos(periodos[selectedIndex]);
  }, [selectedIndex, compras]);

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.headerspace}>
        <Header />
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ backgroundColor: "#f4f4f4" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SegmentedControl
          values={["Diário", "Semanal", "Mensal"]}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
        <Text style={styles.totalGastos}>R$ {totalGastos.toFixed(2)}</Text>
        <View>
          <Text style={styles.h2}>Detalhes</Text>
          <View style={styles.gridContainer}>
            {categoriasComIcones.map((categoria) => (
              <View key={categoria.nome} style={styles.categoriaContainer}>
                <Image source={categoria.icone} style={styles.icone} />
                <Text style={styles.categoriaTexto}>{categoria.nome}</Text>
                <Text style={styles.precoTexto}>
                  {" "}
                  R$ {gastosPorCategoria[categoria.nome]?.toFixed(2) || "0.00"}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Gráficos;

const styles = StyleSheet.create({
  gridContainer: {
    paddingTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  icone: {
    width: 28,
    height: 28,
  },
  h2: {
    fontSize: 20,
    fontWeight: "200",
    paddingTop: 50,
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
  totalGastos: {
    fontSize: 36,
    fontWeight: "600", // Use string para valores como "600"
    marginTop: 20,
    textAlign: "left",
  },
  categoriaContainer: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#939393",
    borderRadius: 16,
    padding: 10,
    marginVertical: 5,
    width: 168,
    height: 114,
    paddingLeft: 25,
  },
  categoriaTexto: {
    fontSize: 18,
    marginTop: 6,
    color: "#333", // Cor do texto
    fontWeight: 600,
  },
  precoTexto: {
    marginTop: 6,
  },
});
