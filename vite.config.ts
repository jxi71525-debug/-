import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl()
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    https: (() => {
      const pfxPath = path.resolve(__dirname, 'certs', 'trae-dev.pfx')
      if (!fs.existsSync(pfxPath)) return true

      const envLocalPath = path.resolve(__dirname, '.env.local')
      let passphrase = process.env.VITE_SSL_PASSPHRASE
      if (!passphrase && fs.existsSync(envLocalPath)) {
        const raw = fs.readFileSync(envLocalPath, 'utf8')
        const match = raw.match(/^\s*VITE_SSL_PASSPHRASE\s*=\s*(.+)\s*$/m)
        if (match?.[1]) {
          passphrase = match[1].trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1')
        }
      }
      if (!passphrase) return true

      return {
        pfx: fs.readFileSync(pfxPath),
        passphrase,
      }
    })(),
  },
})
