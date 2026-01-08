import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import dcs from '@duffcloudservices/cms-astro'

// https://astro.build/config
export default defineConfig({
  site: 'https://demo-3.duffcloudservices.com',
  integrations: [dcs()],
  vite: {
    plugins: [tailwindcss()]
  },
  output: 'static',
  build: {
    assets: '_assets'
  }
})
