import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


const AddBtnSection = () => {
  return (
    <View style={style.addBtn}>
      <Text style={style.btnTxt}>Compra</Text>
      <Text style={style.maisBtn}>+</Text>
    </View>
  );
};
export default AddBtnSection;

export const style = StyleSheet.create({
    addBtn: {
      flexDirection: "row",
      backgroundColor: "#2D7B8A",
      width: 161,
      height: 42,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 8,
      borderRadius: 16,
      bottom: 0,
      right: 0,
    },
    btnTxt: {
      color: "#fff",
      fontSize: 17,
    },
    maisBtn: {
      color: "#fff",
      fontSize: 22,
      fontWeight: 600,
    },
  });
  
