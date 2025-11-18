// src/presentation/screens/asesor/PerfilScreen.tsx (ACTUALIZADO)
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorTabScreenProps } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { colors, spacing, typography, radius } from '../../../theme';

type Props = AsesorTabScreenProps<'Perfil'>;

const PerfilScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, signOut } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      '🚪 Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          onPress: signOut, 
          style: 'destructive' 
        }
      ]
    );
  };

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con botón de logout */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mi Perfil 👤</Text>
          <Text style={styles.subtitle}>Asesor Comercial</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileCard}>
          {/* Avatar + Nombre */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile.nombreMostrar[0].toUpperCase()}
              </Text>
            </View>

            <Text style={styles.userName}>{profile.nombreMostrar}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
            
            {/* Badge de rol */}
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>💼 Asesor Comercial</Text>
            </View>
          </View>

          {/* Opciones */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.option}
            >
              <Text style={styles.optionIcon}>✏️</Text>
              <Text style={styles.optionText}>Editar Perfil</Text>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}
              style={styles.option}
            >
              <Text style={styles.optionIcon}>🔒</Text>
              <Text style={styles.optionText}>Cambiar Contraseña</Text>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={styles.option}
            >
              <Text style={styles.optionIcon}>📊</Text>
              <Text style={styles.optionText}>Ir al Dashboard</Text>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botón de cierre de sesión destacado */}
        <View style={styles.logoutSection}>
          <Button
            title="🚪 Cerrar Sesión"
            onPress={handleLogout}
            variant="danger"
            size="large"
            fullWidth
          />
          <Text style={styles.logoutHint}>
            Al cerrar sesión, perderás acceso temporal al panel de asesor
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: typography['3xl'],
    fontWeight: 'bold',
    color: colors.gray900,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.gray600,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: spacing[1],
  },
  logoutText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing[6],
    marginBottom: spacing[4],
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: colors.primary600,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  avatarText: {
    fontSize: 36,
    color: colors.white,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: typography['2xl'],
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: spacing[1],
  },
  userEmail: {
    color: colors.gray600,
    fontSize: typography.base,
    marginBottom: spacing[2],
  },
  roleBadge: {
    backgroundColor: colors.primary50,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.primary200,
  },
  roleBadgeText: {
    color: colors.primary700,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  optionsContainer: {
    gap: spacing[3],
  },
  option: {
    backgroundColor: colors.gray50,
    padding: spacing[4],
    borderRadius: radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 20,
    marginRight: spacing[3],
  },
  optionText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.gray900,
    flex: 1,
  },
  optionArrow: {
    color: colors.gray400,
    fontSize: typography.lg,
  },
  logoutSection: {
    marginBottom: spacing[8],
  },
  logoutHint: {
    textAlign: 'center',
    color: colors.gray500,
    fontSize: typography.xs,
    marginTop: spacing[2],
  },
});

export default PerfilScreen;