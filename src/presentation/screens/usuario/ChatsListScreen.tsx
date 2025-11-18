import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UsuarioTabScreenProps } from "../../navigation/types";
import { useChatStore } from "../../store/chatStore";
import { colors } from "../../styles/colors";
import { spacing, fontSize } from "../../styles/spacing";

type Props = UsuarioTabScreenProps<"ChatTab">;

const ChatsListScreen: React.FC<Props> = ({ navigation }) => {
  const { chats, fetchChats } = useChatStore();

  useEffect(() => {
    fetchChats(); // Obtener lista de chats del usuario
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Mis Chats 💬</Text>

        {chats.length === 0 ? (
          <Text style={styles.emptyText}>No tienes chats todavía.</Text>
        ) : (
          chats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate("Chat", { contratacionId: chat.contratacionId })
              }
            >
              <Text style={styles.chatTitle}>{chat.planNombre}</Text>
              <Text style={styles.chatSubtitle}>Toca para continuar el chat →</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatsListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  scroll: { padding: spacing.lg },
  title: {
    fontSize: fontSize["2xl"],
    fontWeight: "bold",
    marginBottom: spacing.lg,
    color: colors.gray[900],
  },
  chatItem: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  chatTitle: {
    fontSize: fontSize.xl,
    fontWeight: "600",
    color: colors.gray[900],
  },
  chatSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  emptyText: {
    textAlign: "center",
    marginTop: spacing.xl,
    color: colors.gray[500],
    fontSize: fontSize.base,
  },
});
