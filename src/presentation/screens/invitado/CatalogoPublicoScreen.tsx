// src/presentation/screens/invitado/CatalogoPublicoScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePlanesStore } from '../../store/planesStore';
import { PlanCard } from '../../components/PlanCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../components/FilterModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../styles/colors';
import { spacing, fontSize } from '../../styles/spacing';

const CatalogoPublicoScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { 
    planes, 
    isLoading, 
    searchQuery, 
    fetchPlanes, 
    searchPlanes, 
    filterByPrice, 
    clearFilters, 
    subscribeToPlanes, 
    unsubscribeFromPlanes 
  } = usePlanesStore();
  
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPlanes();
    subscribeToPlanes();
    return () => unsubscribeFromPlanes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlanes();
    setRefreshing(false);
  };

  if (isLoading && planes.length === 0) {
    return <LoadingSpinner message="Cargando planes..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>📱 PLANES TIGO 📱</Text>
          <Text style={styles.subtitle}>Explora nuestros planes móviles</Text>
          
          {/* Banner de invitado */}
          <View style={styles.guestBanner}>
            <Text style={styles.guestBannerIcon}>👋</Text>
            <View style={styles.guestBannerContent}>
              <Text style={styles.guestBannerTitle}>Modo Invitado</Text>
              <Text style={styles.guestBannerText}>
                Puedes explorar nuestros planes. Para contratar,{' '}
                <Text 
                  style={styles.guestBannerLink}
                  onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
                >
                  inicia sesión
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Search y Filter */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={searchPlanes}
            placeholder="Buscar planes..."
            showFilter
            onFilter={() => setShowFilterModal(true)}
          />
        </View>

        {/* Planes */}
        <View style={styles.planesContainer}>
          {planes.length === 0 ? (
            <EmptyState
              icon="😥"
              title="No hay planes"
              message="No se encontraron planes con los filtros aplicados."
              actionLabel="Limpiar Filtros"
              onAction={clearFilters}
            />
          ) : (
            planes.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onPress={() => navigation.navigate('PlanDetailPublico', { planId: plan.id })}
              />
            ))
          )}
        </View>
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={filterByPrice}
        onClear={clearFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  guestBanner: {
    flexDirection: 'row',
    backgroundColor: colors.blue[50],
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  guestBannerIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  guestBannerContent: {
    flex: 1,
  },
  guestBannerTitle: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: colors.primary[700],
    marginBottom: spacing.xs,
  },
  guestBannerText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  guestBannerLink: {
    color: colors.primary[600],
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  planesContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
});

export default CatalogoPublicoScreen;