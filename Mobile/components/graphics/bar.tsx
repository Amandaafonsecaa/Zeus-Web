import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

// Definindo a interface para os dados
interface DadoGrafico {
  mes: string;
  gasto: number;
}

const Graficos = () => {
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [data, setData] = useState<DadoGrafico[]>([]); // Estado para armazenar os dados do backend
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros

  // Função para buscar dados do backend
  const fetchData = async () => {
    try {
      // Simulando uma requisição HTTP para o backend
      const response = await fetch("http://192.168.18.12:3000/compras"); // Substitua pela URL do seu backend
      const json = await response.json();
      setData(json); // Armazena os dados no estado
      setLoading(false); // Finaliza o carregamento
    } catch (err: any) {
      // Tipando o erro como 'any' para evitar problemas com 'unknown'
      setError(err.message); // Armazena o erro
      setLoading(false); // Finaliza o carregamento
    }
  };

  // useEffect para buscar os dados quando o componente for montado
  useEffect(() => {
    fetchData();
  }, []);

  // Se estiver carregando, exibe um indicador de carregamento
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Se houver um erro, exibe uma mensagem de erro
  if (error) {
    return <Text style={styles.error}>Erro: {error}</Text>;
  }

  // Se os dados forem recebidos com sucesso, renderiza o gráfico
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Relatório de Gastos Mensais</Text>
      <BarChart
        data={{
          labels: data.map((item) => item.mes), // Rótulos do eixo X (meses)
          datasets: [
            {
              data: data.map((item) => item.gasto), // Valores do eixo Y (gastos)
            },
          ],
        }}
        width={Dimensions.get("window").width - 40} // Largura do gráfico
        height={220} // Altura do gráfico
        yAxisLabel="R$" // Rótulo do eixo Y
        yAxisSuffix="" // Sufixo do eixo Y (opcional)
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.grafico}
      />
    </View>
  );
};

export default Graficos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  grafico: {
    borderRadius: 16,
  },
});
