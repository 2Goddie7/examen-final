// src/presentation/screens/invitado/PlanDetailPublicoScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InvitadoStackScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { colors, spacing, typography, radius } from '../../../theme';
import { useNavigation } from '@react-navigation/native';

type Props = InvitadoStackScreenProps<'PlanDetailPublico'>;

const PlanDetailPublicoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { planId } = route.params;
  const { selectedPlan, fetchPlanById } = usePlanesStore();
  const nav = useNavigation<any>();

  useEffect(() => {
    fetchPlanById(planId);
  }, [planId]);

  const handleContratar = () => {
    Alert.alert(
      '🔐 Inicia Sesión',
      'Para contratar planes necesitas crear una cuenta o iniciar sesión.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar Sesión',
          onPress: () => nav.navigate('Auth', { screen: 'Login' }),
        },
        {
          text: 'Registrarse',
          onPress: () => nav.navigate('Auth', { screen: 'Register' }),
        },
      ]
    );
  };

  if (!selectedPlan) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        {/* Back Button */}
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Image */}
        {selectedPlan.imagenUrl && (
          <Image
            source={{ uri: selectedPlan.imagenUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={styles.planName}>{selectedPlan.nombre}</Text>
              <Text style={styles.segmento}>{selectedPlan.segmento}</Text>
            </View>
            <Text style={styles.price}>{selectedPlan.precioFormateado}/mes</Text>
          </View>

          {/* Details */}
          <View style={styles.detailBox}>
            <DetailRow icon="📊" label="Datos" value={selectedPlan.datosGb} />
            <DetailRow icon="📞" label="Minutos" value={selectedPlan.minutos} />
            <DetailRow icon="💬" label="SMS" value={selectedPlan.sms} />
            <DetailRow icon="📡" label="4G" value={selectedPlan.velocidad4g} />
            {selectedPlan.velocidad5g && (
              <DetailRow icon="🚀" label="5G" value={selectedPlan.velocidad5g} />
            )}
            <DetailRow icon="📱" label="Redes Sociales" value={selectedPlan.redesSociales} />
            <DetailRow icon="💚" label="WhatsApp" value={selectedPlan.whatsapp} />
            <DetailRow icon="🌎" label="Llamadas Int." value={selectedPlan.llamadasInternacionales} />
            <DetailRow icon="✈️" label="Roaming" value={selectedPlan.roaming} />
          </View>

          {/* Target Audience */}
          <View style={styles.targetBox}>
            <Text style={styles.targetLabel}>Público Objetivo:</Text>
            <Text style={styles.targetText}>{selectedPlan.publicoObjetivo}</Text>
          </View>

          {/* Banner de invitado */}
          <View style={styles.guestAlert}>
            <Text style={styles.guestAlertIcon}>🔒</Text>
            <View style={styles.guestAlertContent}>
              <Text style={styles.guestAlertTitle}>Inicia sesión para contratar</Text>
              <Text style={styles.guestAlertText}>
                Crea una cuenta gratis para contratar este plan y más
              </Text>
            </View>
          </View>

          {/* Action Button */}
          <Button
            title="🔐 Contratar Plan (Requiere Cuenta)"
            onPress={handleContratar}
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backContainer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  backIcon: {
    fontSize: typography['2xl'],
  },
  image: {
    width: '100%',
    height: 190,
  },
  content: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },
  headerInfo: {
    flex: 1,
  },
  planName: {
    fontSize: typography['3xl'],
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: spacing[2],
  },
  segmento: {
    color: colors.gray600,
    fontSize: typography.base,
  },
  price: {
    fontSize: typography['4xl'],
    fontWeight: 'bold',
    color: colors.primary600,
  },
  detailBox: {
    backgroundColor: colors.gray50,
    padding: spacing[4],
    borderRadius: radius.xl,
    marginBottom: spacing[6],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  detailIcon: {
    fontSize: typography['2xl'],
    marginRight: spacing[3],
  },
  detailLabel: {
    flex: 1,
    color: colors.gray600,
    fontSize: typography.base,
  },
  detailValue: {
    flex: 2,
    textAlign: 'right',
    color: colors.gray900,
    fontWeight: '600',
    fontSize: typography.base,
  },
  targetBox: {
    backgroundColor: colors.primary50,
    padding: spacing[4],
    borderRadius: radius.xl,
    marginBottom: spacing[6],
  },
  targetLabel: {
    color: colors.gray700,
    fontWeight: '600',
    fontSize: typography.sm,
    marginBottom: spacing[2],
  },
  targetText: {
    color: colors.gray600,
    fontSize: typography.base,
  },
  guestAlert: {
    flexDirection: 'row',
    backgroundColor: colors.primary50,
    padding: spacing[4],
    borderRadius: radius.xl,
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.primary200,
  },
  guestAlertIcon: {
    fontSize: 28,
    marginRight: spacing[3],
  },
  guestAlertContent: {
    flex: 1,
  },
  guestAlertTitle: {
    fontSize: typography.base,
    fontWeight: 'bold',
    color: colors.primary700,
    marginBottom: spacing[1],
  },
  guestAlertText: {
    fontSize: typography.sm,
    color: colors.gray700,
  },
});

export default PlanDetailPublicoScreen;