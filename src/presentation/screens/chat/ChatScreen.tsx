import React, { useEffect, useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity } from "react-native";
import { supabase } from "@/core/supabase/client";
import { useAuthStore } from "../../store/authStore";

export default function ChatScreen({ route }) {
  const { otherUserId } = route.params;
  const user = useAuthStore(s => s.user);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadMessages = async () => {
    const { data } = await supabase
      .from("chat_mensajes")
      .select("*")
      .or(`emisor.eq.${user.id},receptor.eq.${user.id}`)
      .order("created_at");

    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!text) return;
    await supabase.from("chat_mensajes").insert({
      emisor: user.id,
      receptor: otherUserId,
      contenido: text,
    });
    setText("");
  };

  useEffect(() => {
    loadMessages();

    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_mensajes" },
        (payload) => {
          const msg = payload.new;
          if (msg.emisor === user.id || msg.receptor === user.id) {
            setMessages((prev) => [...prev, msg]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              marginVertical: 5,
              alignSelf: item.emisor === user.id ? "flex-end" : "flex-start",
              backgroundColor: item.emisor === user.id ? "#0078FF" : "#DDD",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: item.emisor === user.id ? "#FFF" : "#000" }}>
              {item.contenido}
            </Text>
          </View>
        )}
      />

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={{
            flex: 1,
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
            marginRight: 10,
          }}
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={{
            backgroundColor: "#0078FF",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#FFF" }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
