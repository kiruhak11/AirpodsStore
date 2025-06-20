import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/ui',
    '@nuxtjs/device',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-swiper',
    '@nuxtjs/device',
    '@nuxtjs/supabase',
    'shadcn-nuxt',
    '@nuxtjs/tailwindcss',
  ],
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode',
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },

  runtimeConfig: {
    public: {
      sb_url: process.env.SUPABASE_URL ?? '',
      sb_key: process.env.SUPABASE_KEY ?? '',
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL ?? '',
    key: process.env.SUPABASE_KEY ?? '',
    redirectOptions: {
      login: '/',
      callback: '/',
      include: undefined,
      exclude: ['/', '/contact', '/products', '/login', '/products/[\\d]+'],
      cookieRedirect: false,
    },
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

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/collection/index.scss";',
        },
      },
    },
  },
});
