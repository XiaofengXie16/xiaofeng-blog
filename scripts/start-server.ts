import { stat } from 'node:fs/promises'
import { dirname, join, normalize } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const distDir = join(here, '..', 'dist')
const clientDir = join(distDir, 'client')
const bunRuntime = (globalThis as typeof globalThis & { Bun: any }).Bun
const serverModule = await import(pathToFileURL(join(distDir, 'server', 'server.js')).href)
const server = serverModule.default
const port = Number(process.env.PORT ?? process.env.HTTP_PORT ?? 3000)

function sanitizePath(pathname: string): string | null {
  if (!pathname || pathname === '/') return null

  try {
    const decoded = decodeURIComponent(pathname)
    const withoutLeadingSlash = decoded.replace(/^\/+/, '')
    if (!withoutLeadingSlash) return null
    const normalized = normalize(withoutLeadingSlash)
    if (normalized.startsWith('..')) return null
    return normalized
  } catch {
    return null
  }
}

async function serveStatic(request: Request) {
  const normalized = sanitizePath(new URL(request.url).pathname)
  if (!normalized) return null

  const filePath = join(clientDir, normalized)
  if (!filePath.startsWith(clientDir)) {
    return new Response('Not Found', { status: 404 })
  }

  try {
    const fileStats = await stat(filePath)
    if (!fileStats.isFile()) return null

    const file = bunRuntime.file(filePath)
    const headers = new Headers()
    const cacheControl =
      normalized.startsWith('assets/') || normalized.startsWith('build/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=3600'

    headers.set('Cache-Control', cacheControl)
    if (file.type) {
      headers.set('Content-Type', file.type)
    }

    if (request.method === 'HEAD') {
      headers.set('Content-Length', fileStats.size.toString())
      return new Response(null, { status: 200, headers })
    }

    return new Response(file, { status: 200, headers })
  } catch {
    return null
  }
}

const fetchHandler = typeof server?.fetch === 'function' ? server.fetch.bind(server) : server

bunRuntime.serve({
  port,
  fetch: async (request: Request) => {
    if (request.method === 'GET' || request.method === 'HEAD') {
      const response = await serveStatic(request)
      if (response) return response
    }

    return fetchHandler(request)
  },
})

console.log(`🚀 Server ready on port ${port}`)
