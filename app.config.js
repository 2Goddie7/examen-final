import 'dotenv/config';

export default {
  expo: {
    name: "final",
    slug: "final",
    owner: "ellokitogoddie",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: false,

    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },

    ios: {
      supportsTablet: true
    },

    android: {
      package: "com.examendiego.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },

    web: {
      favicon: "./assets/favicon.png"
    },

    plugins: ["expo-secure-store"],

    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,

      eas: {
        "projectId": "3bb86f29-ff0b-4425-ac54-490123f827cf"
      }
    }
  }
};
