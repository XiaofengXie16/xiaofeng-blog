// src/server.ts
import handler from '@tanstack/react-start/server-entry'
import { promises as fs } from 'node:fs'
import { extname, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// Resolve the dist/client directory relative to this built file at runtime.
// After build, this file is at dist/server/server.js, so client assets live at ../client
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const clientDistDir = join(__dirname, '../client')

const mimeTypes: Record<string, string> = {
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

async function serveStaticIfNeeded(request: Request): Promise<Response | null> {
  try {
    const url = new URL(request.url)
    const pathname = url.pathname

    // Serve built client assets and common static files in production
    if (
      pathname.startsWith('/assets/') ||
      pathname === '/favicon.ico' ||
      pathname.startsWith('/favicon') ||
      pathname === '/robots.txt' ||
      pathname === '/manifest.webmanifest'
    ) {
      const filePath = join(clientDistDir, pathname.replace(/^\/+/, ''))
      const ext = extname(filePath)
      const type = mimeTypes[ext] || 'application/octet-stream'

      const data = await fs.readFile(filePath)
      const headers = new Headers({ 'Content-Type': type })

      // Aggressive caching for hashed assets
      if (pathname.startsWith('/assets/')) {
        headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      }

      return new Response(data, { status: 200, headers })
    }
  } catch (err) {
    // Fall through to SSR handler on any error (e.g., file not found)
  }
  return null
}

export default {
  async fetch(request: Request) {
    const staticRes = await serveStaticIfNeeded(request)
    if (staticRes) return staticRes
    return handler.fetch(request)
  },
}
