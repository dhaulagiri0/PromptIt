import type { NuxtPage } from 'nuxt/schema';
import { resolve } from 'path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    '@' : resolve(__dirname, '/') 
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    '@pinia/nuxt', // needed
    '@pinia-plugin-persistedstate/nuxt',
  ],
  components: [
    '~/components',
    {
      path: '~/pages',
      pattern: '*/components/**',
      pathPrefix: false
    }
  ],
  imports: {
    dirs: [
      'composables',
      'composables/*/index.{ts,js,mjs,mts}',
      'composables/**'
    ]
  },
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.FIREBASE_APIKEY,
        authDomain: process.env.FIREBASE_AUTHDOMAIN,
        projectId: process.env.FIREBASE_PROJECTID,
        storageBucket: process.env.FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
        appId: process.env.FIREBASE_APPID,
      },
      webhook_url: process.env.WEBHOOK_URL
    }
  },
  hooks: {
    'pages:extend'(pages) {
      const pagesToRemove: NuxtPage[] = [];
      pages.forEach(page => {
        if (page.path.includes('component')) pagesToRemove.push(page);
      });

      pagesToRemove.forEach((page: NuxtPage) => {
        pages.splice(pages.indexOf(page), 1);
      });
    }
  },
})
