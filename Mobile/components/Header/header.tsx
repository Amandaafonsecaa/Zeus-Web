import React from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";

const Header = () => {
  const route = useRoute();
  const routeName = route.name;

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{routeName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 30,
    padding: 0,
    width: "100%",
    height: 60, // Altura do cabeçalho
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2D7B8A",
    borderEndEndRadius: 26,
    borderEndStartRadius: 26,
    paddingTop: StatusBar.currentHeight || 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff", // Cor do texto
  },
});

export default Header;
