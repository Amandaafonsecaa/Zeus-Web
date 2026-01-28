import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Header from "../../components/Header/header";
import { SelectList } from "react-native-dropdown-select-list";

const AdicionarCompra = () => {
  const navigation = useNavigation();

  // Definição das categorias disponíveis
  const categorias = ["ração", "saúde", "lazer", "roupas", "outros"];

  // Estados do formulário
  const [categoria, setCategoria] = useState(categorias[0]); // Valor inicial garantido
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [loja, setLoja] = useState("");
  const [dataCompra, setDataCompra] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeData = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataCompra(selectedDate);
    }
  };

  const handleAdicionar = async () => {
    if (!categoria || !descricao || !valor || !loja) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      console.log("Enviando requisição");
      var body = JSON.stringify({
        categoria,
        descricao,
        valor: parseFloat(valor), // Valor convertido corretamente
        dataCompra: dataCompra.toISOString(),
        loja, // Agora loja é o campo correto
      });
      console.log(body);
      const response = await fetch("http://10.50.186.239:3000/compras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      console.log("Data no formato ISO: ", dataCompra.toISOString());

      console.log("Status da resposta:", response.status);

      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }

      console.log("Compra adicionada com sucesso!");

      setDescricao("");
      setValor("");
      setLoja("");
      setDataCompra(new Date());

      console.log("Campos resetados!");

      Alert.alert("Sucesso", "Compra adicionada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Erro ao adicionar compra:", error);
      Alert.alert("Erro", "Não foi possível adicionar a compra.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safearea}>
          <View style={styles.headerspace}>
            <Header />
          </View>
          <View style={styles.container}>
            {/* SelectDropdown de Categoria */}
            <Text style={styles.label}>Categoria</Text>
            <View style={styles.selectDropdownContainer}>
              <SelectList
                setSelected={(val: string) => setCategoria(val)}
                data={categorias}
                save="value"
              />
            </View>

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              placeholderTextColor="#ccc"
              value={descricao}
              onChangeText={setDescricao}
            />

            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.input}
              placeholder="Valor"
              placeholderTextColor="#ccc"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Loja</Text>
            <TextInput
              style={styles.input}
              placeholder="Loja"
              placeholderTextColor="#ccc"
              value={loja}
              onChangeText={setLoja}
            />

            <Text style={styles.label}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="Selecione a Data"
              placeholderTextColor="#ccc"
              value={dataCompra.toLocaleDateString()}
              editable={false}
              onPressIn={() => setShowDatePicker(true)}
            />

            {showDatePicker && (
              <DateTimePicker
                value={dataCompra}
                mode="date"
                display="default"
                onChange={onChangeData}
              />
            )}

            {/* Botão de Adicionar */}
            <View style={styles.bottomEnd}>
              <TouchableOpacity style={styles.addBtn} onPress={handleAdicionar}>
                <Text style={styles.btnTxt}>Adicionar </Text>
                <Text style={styles.maisBtn}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  bottomEnd: {
    position: "absolute",
    bottom: 60,
    right: 20,
  },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#111727",
    width: 161,
    height: 42,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  maisBtn: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  btnTxt: {
    color: "#fff",
    fontSize: 17,
  },
  safearea: {
    flex: 1,
    backgroundColor: "#2D7B8A",
    borderEndEndRadius: 26,
    borderEndStartRadius: 26,
  },
  headerspace: {
    backgroundColor: "#f4f4f4",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  selectDropdownContainer: {
    marginBottom: 16,
  },
  selectDropdownButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  selectDropdownButtonText: {
    color: "#000",
    fontSize: 16,
  },
  selectDropdownIcon: {
    fontSize: 20,
    color: "#000",
  },
  selectDropdownList: {
    borderRadius: 8,
  },
  input: {
    height: 46,
    borderColor: "#4f4f4f",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
});

export default AdicionarCompra;
