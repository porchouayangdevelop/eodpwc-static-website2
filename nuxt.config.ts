// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  ssr: false,

  imports: {
    autoImport: true,
  },

  app: {
    head: {
      title: "EODPWC Static Website",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",

      link: [],
    },
  },

  runtimeConfig: {
    public: {
      base_url: "",
    },
  },

  plugins: [
    "~/plugins/axios.ts",
    //  "~/plugins/error-handler.ts"
  ],
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@pinia/nuxt",
    "nuxt-lucide-icons",
    "@nuxt/icon",
  ],

  lucide: {
    namePrefix: "Icon",
  },

  css: ["~/assets/css/main.css", "~/assets/css/google-fonts.css"],

  typescript: {
    // typeCheck: true,
  },

  vite: {
    optimizeDeps: {
      include: [],
    },
    // ssr: {
    //   noExternal: [],
    // },
  },
  nitro: {
    preset: "node-server",
    // experimental: {
    //   wasm: true,
    // },

    devServer: {
      watch: ["~/types/**/*.ts"],
    },
  },
});
