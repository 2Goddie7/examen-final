// src/data/services/NotificationsService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationsService {
  private static instance: NotificationsService;
  private expoPushToken: string | null = null;

  private constructor() {}

  static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('⚠️ Las notificaciones push solo funcionan en dispositivos físicos');
      return null;
    }

    try {
      // Solicitar permisos
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('❌ No se otorgaron permisos para notificaciones');
        return null;
      }

      // Obtener el token de Expo Push
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.warn('⚠️ EAS Project ID no configurado. Ejecuta: npx eas init');
        // En desarrollo, continuar sin token
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.expoPushToken = token.data;
      console.log('✅ Push Token obtenido:', this.expoPushToken);

      // Configurar canal de notificaciones para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Notificaciones Tigo',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0057e6',
          sound: 'default',
          enableVibrate: true,
          showBadge: true,
        });

        // Canal para mensajes de chat
        await Notifications.setNotificationChannelAsync('chat', {
          name: 'Mensajes de Chat',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 200, 200],
          lightColor: '#0057e6',
          sound: 'default',
        });

        // Canal para actualizaciones de contrataciones
        await Notifications.setNotificationChannelAsync('contrataciones', {
          name: 'Estado de Contrataciones',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 300, 100, 300],
          lightColor: '#22c55e',
          sound: 'default',
        });
      }

      return this.expoPushToken;
    } catch (error) {
      console.error('❌ Error registrando notificaciones push:', error);
      return null;
    }
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // 📨 Notificación local genérica
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>,
    channelId: string = 'default'
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        ...(Platform.OS === 'android' && { channelId }),
      },
      trigger: null, // Enviar inmediatamente
    });
  }

  // 💬 Notificación: Nuevo mensaje de chat
  async notifyNewMessage(
    senderName: string,
    message: string,
    contratacionId: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      `💬 Mensaje de ${senderName}`,
      message.length > 100 ? message.substring(0, 100) + '...' : message,
      {
        type: 'new_message',
        contratacionId,
        screen: 'Chat',
      },
      'chat'
    );
  }

  // ✅ Notificación: Contratación aprobada
  async notifyContratacionApproved(
    planName: string,
    contratacionId: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      '✅ ¡Contratación Aprobada!',
      `Tu solicitud para el plan "${planName}" ha sido aprobada. ¡Ya puedes disfrutar de tu nuevo plan!`,
      {
        type: 'contratacion_approved',
        contratacionId,
        screen: 'MisContrataciones',
      },
      'contrataciones'
    );
  }

  // ❌ Notificación: Contratación rechazada
  async notifyContratacionRejected(
    planName: string,
    contratacionId: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      '❌ Contratación Rechazada',
      `Tu solicitud para el plan "${planName}" ha sido rechazada. Contacta con soporte para más información.`,
      {
        type: 'contratacion_rejected',
        contratacionId,
        screen: 'MisContrataciones',
      },
      'contrataciones'
    );
  }

  // 🔔 Notificación: Nueva contratación pendiente (para asesores)
  async notifyNewContratacion(
    userName: string,
    planName: string,
    contratacionId: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      '🔔 Nueva Contratación',
      `${userName} ha solicitado el plan "${planName}". Revisa la solicitud.`,
      {
        type: 'new_contratacion',
        contratacionId,
        screen: 'ContratacionDetail',
      },
      'contrataciones'
    );
  }

  // 📝 Notificación: Plan actualizado
  async notifyPlanUpdated(planName: string, planId: string): Promise<void> {
    await this.scheduleLocalNotification(
      '📝 Plan Actualizado',
      `El plan "${planName}" ha sido actualizado. Revisa los nuevos detalles.`,
      {
        type: 'plan_updated',
        planId,
        screen: 'PlanDetail',
      }
    );
  }

  // 🆕 Notificación: Nuevo plan disponible
  async notifyNewPlan(planName: string, planId: string): Promise<void> {
    await this.scheduleLocalNotification(
      '🆕 ¡Nuevo Plan Disponible!',
      `Descubre nuestro nuevo plan: "${planName}". ¡Échale un vistazo!`,
      {
        type: 'new_plan',
        planId,
        screen: 'PlanDetail',
      }
    );
  }

  // 👂 Listener para notificaciones recibidas (app en foreground)
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // 👆 Listener para cuando el usuario toca una notificación
  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // 🧹 Limpiar badge (contador de notificaciones)
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  // ❌ Cancelar todas las notificaciones programadas
  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // 📋 Obtener notificaciones presentadas
  async getPresentedNotifications(): Promise<Notifications.Notification[]> {
    return await Notifications.getPresentedNotificationsAsync();
  }

  // 🗑️ Limpiar notificaciones presentadas
  async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }

  // 🔢 Actualizar badge
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }
}