import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Prefix '' loads every var (not only VITE_*), so OPENCODE_GO_KEY stays server-side
  // and is never inlined into the client bundle.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      // Plain JS config, so only `node:url` is needed; no `@types/node`.
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        // Browser calls /opencode-go/* (same origin, no CORS). Vite forwards to
        // OpenCode Go and injects the secret + the headers the browser cannot set.
        '/opencode-go': {
          target: 'https://opencode.ai',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/opencode-go/, '/zen/go/v1'),
          headers: {
            Authorization: `Bearer ${env.OPENCODE_GO_KEY ?? ''}`,
            'User-Agent': 'mini-chat-ia/1.0',
            'x-opencode-session': 'mini-chat-ia-session'
          }
        }
      }
    }
  }
})
