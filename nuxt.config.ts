// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: false },

    runtimeConfig: {
        MONGO_URI: process.env.MONGO_URI,
    },

    ssr: true,

    css: ['~/assets/css/main.css'],

    imports: {
        dirs: ['types/*.ts'],
    },

    modules: [
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt',
        '@nuxtjs/i18n',
        '@nuxt/image',
    ],
    app: {
        head: {
            script: [{ src: 'https://telegram.org/js/telegram-web-app.js' }],
        },
    },

    i18n: {
        vueI18n: '~/i18n.config.ts', // if you are using custom path, default
    },
});
