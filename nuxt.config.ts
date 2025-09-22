// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  ssr: false,

  future: {
    compatibilityVersion: 4,
  },

  imports: {
    autoImport: true,
  },

  routeRules: {
    "/": { prerender: true },
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
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
  ],

  lucide: {
    namePrefix: "Icon",
  },

  css: ["~/assets/css/main.css", "~/assets/css/google-fonts.css"],

  typescript: {
    // typeCheck: true,
  },

  vite: {
    build: {
      minify: false,
    },
  },
  nitro: {
    preset: "node-server",
    minify: false,
  },
});
