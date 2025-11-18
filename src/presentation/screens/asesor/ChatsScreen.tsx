import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { chatRepository } from '../../../data/repositories/ChatRepository';


interface MessageItem {
  id: string;
  mensaje: string;
  remitente: 'usuario' | 'soporte';
  fecha: string;
}

const ChatScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const contratacionId: string | undefined = route.params?.contratacionId;

  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!contratacionId) {
      console.warn('❌ ChatScreen abierto sin contratacionId. Regresando.');
      navigation.goBack();
      return;
    }

    const cargarMensajes = async () => {
      try {
        const data = await chatRepository.getMessages(contratacionId);
        setMessages(data || []);
      } catch (error) {
        console.error('Error getting messages:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarMensajes();

    // Suscripción en tiempo real
    const channel = chatRepository.subscribeToMessages(contratacionId, (msg: MessageItem) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    return () => {
      chatRepository.unsubscribe(channel);
    };
  }, [contratacionId]);

  const enviarMensaje = async () => {
    if (!input.trim() || !contratacionId) return;

    setSending(true);

    try {
      await chatRepository.sendMessage({
        contratacionId,
        mensaje: input.trim(),
        remitente: 'usuario',
      });

      setInput('');
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: MessageItem }) => (
    <View
      style={{
        padding: 10,
        marginVertical: 6,
        maxWidth: '80%',
        alignSelf: item.remitente === 'usuario' ? 'flex-end' : 'flex-start',
        backgroundColor: item.remitente === 'usuario' ? '#007bff' : '#e5e5ea',
        borderRadius: 10,
      }}
    >
      <Text style={{ color: item.remitente === 'usuario' ? '#fff' : '#000' }}>{item.mensaje}</Text>
      <Text style={{ fontSize: 10, color: '#666', marginTop: 4 }}>{item.fecha}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Caja de texto para enviar */}
      <View style={{ flexDirection: 'row', padding: 12, borderTopWidth: 1, borderColor: '#ccc' }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1, backgroundColor: '#f1f1f1', borderRadius: 8, paddingHorizontal: 12 }}
        />

        <TouchableOpacity
          style={{
            marginLeft: 8,
            backgroundColor: '#007bff',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 16,
            borderRadius: 8,
            opacity: sending ? 0.5 : 1,
          }}
          onPress={enviarMensaje}
          disabled={sending}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
