import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { chatRepository } from '../../../data/repositories/ChatRepository';


interface ChatItem {
  id: string;
  contratacionId: string;
  ultimoMensaje: string;
  fecha: string;
}

const ChatsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarChats = async () => {
    try {
      const data = await chatRepository.getUserChats(); // ajusta si tu método tiene otro nombre
      setChats(data || []);
    } catch (error) {
      console.error('Error cargando chats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarChats();
  }, []);

  const abrirChat = (chat: ChatItem) => {
    console.log('📨 Navegando a Chat con contratacionId =', chat.contratacionId);

    const parent = navigation.getParent();
    if (parent) {
      parent.navigate('Chat' as never, { contratacionId: chat.contratacionId } as never);
      return;
    }

    // Fallback improbable
    navigation.navigate('Chat' as never, { contratacionId: chat.contratacionId } as never);
  };

  const renderItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity
      style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ddd' }}
      onPress={() => abrirChat(item)}
    >
      <Text style={{ fontSize: 16, fontWeight: '600' }}>Chat #{item.id}</Text>
      <Text style={{ color: '#555' }}>{item.ultimoMensaje}</Text>
      <Text style={{ fontSize: 12, color: '#999' }}>{item.fecha}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {chats.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No hay chats disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default ChatsListScreen;
