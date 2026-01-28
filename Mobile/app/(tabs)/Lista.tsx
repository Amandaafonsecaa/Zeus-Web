import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons"; // Ícones
import Header from "../../components/Header/header";
import { SelectList } from "react-native-dropdown-select-list";

//schema atualizado
type Compra = {
  _id: string;
  categoria: string;
  descricao: string;
  valor: number;
  loja: string;
  dataCompra: string;
  image: string;
};

//pega informação do back
export default function Lista() {
  const categorias = ["ração", "saúde", "lazer", "roupas", "outros"];

  const [history, setHistory] = useState<Compra[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Compra | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("http://10.50.186.239:3000/compras");
      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      const data: Compra[] = await response.json();
      setHistory(data.reverse()); // Inverte a ordem para mostrar os mais recentes primeiro
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reload automático quando não há compras
  useEffect(() => {
    if (history.length === 0) {
      const reloadTimeout = setTimeout(() => {
        fetchData(); // Tenta buscar os dados novamente
      }, 5000); // 5000ms = 5 segundos

      // Limpa o timeout se o componente for desmontado
      return () => clearTimeout(reloadTimeout);
    }
  }, [history]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Função para deletar uma compra
  const handleDelete = async (id: string) => {
    Alert.alert("Confirmação", "Tem certeza que deseja excluir esta compra?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            const response = await fetch(
              `http://192.168.0.111:3000/compras/${id}`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) {
              throw new Error("Erro ao excluir compra");
            }

            setHistory(history.filter((item) => item._id !== id));
            Alert.alert("Sucesso", "Compra excluída com sucesso!");
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir a compra");
          }
        },
      },
    ]);
  };

  // Função para editar
  const handleEdit = (item: Compra) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  // Função para salvar as alterações
  const handleSave = async () => {
    if (selectedItem) {
      try {
        const response = await fetch(
          `http://10.50.186.239:3000/compras/${selectedItem._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(selectedItem),
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao atualizar a compra");
        }

        // Atualiza a lista localmente
        setHistory((prevHistory) =>
          prevHistory.map((item) =>
            item._id === selectedItem._id ? selectedItem : item
          )
        );

        setModalVisible(false); // Fecha o modal
        Alert.alert("Sucesso", "Compra atualizada com sucesso!");
      } catch (error) {
        Alert.alert("Erro", "Não foi possível atualizar a compra");
      }
    }
  };

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

        <Image source={{ uri: item.image }} style={styles.icon} />

        <View style={styles.info}>
          <Text style={styles.name}>{item.categoria}</Text>
          <Text style={styles.description}>{item.descricao}</Text>
          <Text style={styles.store}>Loja: {item.loja}</Text>
          <Text style={styles.date}>{formatDate(item.dataCompra)}</Text>
        </View>

        <Text style={styles.price}>R$ {item.valor.toFixed(2)}</Text>

        {/* Botões de editar e excluir */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.button}
          >
            <FontAwesome name="pencil" size={15} color="#2D7B8A" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item._id)}
            style={styles.button}
          >
            <AntDesign name="delete" size={15} color="#CC0F0F" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.safearea}>
        <View style={styles.headerspace}>
          <Header />
        </View>
        <View style={styles.container}>
          <Text style={styles.emptyText}>Nenhuma compra encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.headerspace}>
        <Header />
      </View>
      <View style={styles.container}>
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>

      {/* Modal de Edição */}
      {selectedItem && (
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Item</Text>

              {/* Categoria */}
              <Text style={styles.label}>Categoria</Text>
              <View style={styles.selectDropdownContainer}>
                <SelectList
                  setSelected={(val: string) => {
                    // Atualiza a categoria no selectedItem
                    setSelectedItem({ ...selectedItem, categoria: val });
                  }}
                  data={categorias}
                  save="value"
                  defaultOption={{
                    key: selectedItem.categoria,
                    value: selectedItem.categoria,
                  }} // Define o valor inicial
                />
              </View>

              {/* Descrição */}
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={styles.input}
                value={selectedItem.descricao}
                onChangeText={(text) =>
                  setSelectedItem({ ...selectedItem, descricao: text })
                }
                placeholder="Descrição"
              />

              {/* Valor */}
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={styles.input}
                value={selectedItem.valor.toString()}
                onChangeText={(text) =>
                  setSelectedItem({
                    ...selectedItem,
                    valor: parseFloat(text) || 0,
                  })
                }
                placeholder="Valor"
                keyboardType="numeric"
              />

              {/* Loja */}
              <Text style={styles.label}>Loja</Text>
              <TextInput
                style={styles.input}
                value={selectedItem.loja}
                onChangeText={(text) =>
                  setSelectedItem({ ...selectedItem, loja: text })
                }
                placeholder="Loja"
              />

              {/* Botões */}
              <View style={styles.centralizar}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={handleSave} // Chama a função handleSave
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centralizar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#111727",
    width: 160,
    marginBottom: 10,
    height: 42,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  buttonText: {
    color: "#f4f4f4",
  },
  selectDropdownContainer: {
    marginBottom: 16,
  },
  headerspace: {
    backgroundColor: "#f4f4f4",
  },
  safearea: {
    flex: 1,
    backgroundColor: "#2D7B8A",
    borderEndEndRadius: 26,
    borderEndStartRadius: 26,
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 20,
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
    borderRadius: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  store: {
    fontSize: 14,
    color: "#888",
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
  actions: {
    display: "flex",
    alignItems: "center",
  },
  button: {
    padding: 8,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});
