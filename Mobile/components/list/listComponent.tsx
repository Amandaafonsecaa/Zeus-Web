import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";

// Definição do tipo de compra
type Compra = {
  _id: string;
  categoria: string;
  dataCompra: string;
  descricao: string;
  valor: number;
  image: string;
};

// Componente reutilizável
export default function ListaComponent() {
  const [history, setHistory] = useState<Compra[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://10.50.186.239:3000/compras");
      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const data: Compra[] = await response.json();
      console.log("Dados recebidos:", data);

      // Inverte a ordem dos dados
      setHistory(data.reverse());
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  };

  useEffect(() => {
    fetchData();
    console.log("Estado atual do history:", history);
  }, []);

  const renderItem = ({ item }: { item: Compra }) => {
    const lastChar = item._id.slice(-1);

    const isEven = !isNaN(Number(lastChar)) && Number(lastChar) % 2 === 0;
    const isOdd = !isNaN(Number(lastChar)) && Number(lastChar) % 2 !== 0;
    const isLetter = isNaN(Number(lastChar));

    const imageEven = isEven
      ? require("../../assets/images/Dog Bowl.png")
      : { uri: item.image };
    const imageOdd = isOdd
      ? require("../../assets/images/Dog Pooping.png")
      : { uri: item.image };
    const imageLetter = isLetter
      ? require("../../assets/images/Dog Paw.png")
      : { uri: item.image };

    return (
      <View style={styles.item}>
        {isEven && <Image source={imageEven} style={styles.icon} />}
        {isOdd && <Image source={imageOdd} style={styles.icon} />}
        {isLetter && <Image source={imageLetter} style={styles.icon} />}

        <View style={styles.info}>
          <Text style={styles.name}>{item.categoria}</Text>
          <Text style={styles.date}>{item.dataCompra.slice(0, 10)}</Text>
        </View>

        <Text style={styles.price}>- R$ {item.valor.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum dado disponível</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
    minHeight: 500,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#777",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius: 10,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    color: "#777",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CC0F0F",
  },
});
