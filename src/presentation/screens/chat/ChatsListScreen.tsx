import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { supabase } from "../../../core/supabase/client";
import { useAuthStore } from "../../store/authStore";

export default function ChatsListScreen({ navigation }) {
  const user = useAuthStore(state => state.user);
  const [items, setItems] = useState([]);

  const fetchChats = async () => {
    if (!user) return;

    if (user.rol === "usuario") {
      // Usuario ve asesores
      const { data, error } = await supabase
        .from("perfiles")
        .select("id, nombre, apellido, rol")
        .eq("rol", "asesor_comercial");

      if (!error) setItems(data);
    } else {
      // Asesor ve usuarios con chats activos
      const { data, error } = await supabase
        .from("chat_mensajes")
        .select("emisor, perfiles!emisor(nombre, apellido)")
        .neq("emisor", user.id)
        .order("created_at", { ascending: false });

      if (!error) {
        const únicos = [];
        const usados = new Set();
        data.forEach(msg => {
          if (!usados.has(msg.emisor)) {
            usados.add(msg.emisor);
            únicos.push({
              id: msg.emisor,
              nombre: msg.perfiles.nombre,
              apellido: msg.perfiles.apellido,
            });
          }
        });
        setItems(únicos);
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const openChat = (otherUserId: string) => {
    navigation.navigate("Chat", { otherUserId });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        {user?.rol === "usuario" ? "Asesores disponibles" : "Chats activos"}
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openChat(item.id)}
            style={{
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          >
            <Text style={{ fontSize: 16 }}>
              {item.nombre} {item.apellido}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
