import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatsListScreen from "../screens/chat/ChatsListScreen";
import ChatScreen from "../screens/chat/ChatScreen";

const Stack = createNativeStackNavigator();

export const ChatNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatsList" component={ChatsListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};
