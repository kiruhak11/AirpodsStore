import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ["@/assets/styles/global/index.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // перед каждым scss-файлом (включая <style> в компонентах)
          // будут автоматически подключаться эти модули
          additionalData: `
            @use "@/assets/styles/collection/functions" as *;
            @use "@/assets/styles/collection/colors" as *;
            @use "@/assets/styles/collection/fonts" as *;
          `,
        },
      },
    },
  },
  modules: [
    '@nuxtjs/device',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/device',
    'shadcn-nuxt',
    '@nuxt/image',
    '@nuxtjs/google-fonts',
    'nuxt-file-storage'
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },

  runtimeConfig: {
    public: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? '',
      paypalClientId: process.env.PAYPAL_CLIENT_ID ?? '',
    },
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET ?? '',
    databaseUrl: process.env.DATABASE_URL ?? '',
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },

  googleFonts: {
    families: {
      'Inter': [300, 400, 500, 600, 700],
      'Poppins': [300, 400, 500, 600, 700],
    },
    display: 'swap',
  },

  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' }
      ]
    }
  },  
});
