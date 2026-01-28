import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: Platform.OS === "ios" ? "absolute" : "relative",
          backgroundColor: "#3C8F9E", // Adiciona a cor de fundo
        },
        
        
      }}
    >
      {/* Tela Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home", // Nome da tab
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} /> // Ícone de casa
          ),
        }}
      />

      {/* Tela Adicionar */}
      <Tabs.Screen
        name="Adicionar"
        options={{
          title: "Adicionar", // Nome da tab
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus" color={color} /> // Ícone de mais
          ),
        }}
      />

      {/* Tela Lista */}
      <Tabs.Screen
        name="Lista"
        options={{
          title: "Lista", // Nome da tab
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="list.bullet" color={color} /> // Ícone de lista
          ),
        }}
      />

      {/* Tela Gastos */}
      <Tabs.Screen
        name="Gráficos"
        options={{
          title: "Gastos", // Nome da tab
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="dollarsign.circle.fill" color={color} /> // Ícone de dinheiro
          ),
        }}
      />
    </Tabs>
  );
}
