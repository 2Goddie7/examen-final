// src/presentation/navigation/RootNavigator.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { InvitadoNavigator } from './InvitadoNavigator';
import { AuthNavigator } from './AuthNavigator';
import { UsuarioNavigator } from './UsuarioNavigator';
import { AsesorNavigator } from './AsesorNavigator';
import { RootStackParamList } from './types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, profile, initialize } = useAuthStore();
  const [showGuestMode, setShowGuestMode] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Iniciando aplicación..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            {/* Modo Invitado por defecto */}
            <Stack.Screen name="Invitado" component={InvitadoNavigator} />
            {/* Auth cuando el usuario quiere iniciar sesión */}
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        ) : profile?.esAsesor ? (
          <Stack.Screen name="AsesorStack" component={AsesorNavigator} />
        ) : (
          <Stack.Screen name="UsuarioStack" component={UsuarioNavigator} />
        )}
      </Stack.Navigator>
      

      {/* Banner informativo para invitados */}
      {!isAuthenticated && showGuestMode && (
        <View style={styles.guestBanner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerText}>
              👋 Estás navegando como invitado. Inicia sesión para contratar planes.
            </Text>
            <TouchableOpacity 
              onPress={() => setShowGuestMode(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  guestBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.primary600,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    zIndex: 999,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerText: {
    color: colors.white,
    fontSize: typography.sm,
    flex: 1,
    marginRight: spacing[2],
  },
  closeButton: {
    padding: spacing[1],
  },
  closeText: {
    color: colors.white,
    fontSize: typography.lg,
    fontWeight: 'bold',
  },
});