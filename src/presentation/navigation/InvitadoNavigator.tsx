// src/presentation/navigation/InvitadoNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { InvitadoStackParamList, InvitadoTabParamList } from './types';
import { Text } from 'react-native';

// Screens pantallas 
import CatalogoPublicoScreen from '../screens/invitado/CatalogoPublicoScreen';
import PlanDetailPublicoScreen from '../screens/invitado/PlanDetailPublicoScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

const Tab = createBottomTabNavigator<InvitadoTabParamList>();
const Stack = createNativeStackNavigator<InvitadoStackParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0057e6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="CatalogoPublico"
        component={CatalogoPublicoScreen}
        options={{
          tabBarLabel: 'Planes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📱</Text>,
        }}
      />
      <Tab.Screen
        name="Acceder"
        component={WelcomeScreen}
        options={{
          tabBarLabel: 'Acceder',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔐</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export const InvitadoNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="PlanDetailPublico" component={PlanDetailPublicoScreen} />
    </Stack.Navigator>
  );
};