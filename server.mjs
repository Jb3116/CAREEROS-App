import http from 'node:http'
import { existsSync, createReadStream } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { createServer as createViteServer } from 'vite'
import { handleApi } from './server/api.mjs'

const production = process.argv.includes('--production')
const port = Number(process.env.PORT || 5173)
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' }
const vite = production ? null : await createViteServer({ server: { middlewareMode: true }, appType: 'spa' })

const server = http.createServer(async (request, response) => {
  if (request.url?.startsWith('/api/')) return handleApi(request, response)
  if (vite) return vite.middlewares(request, response, () => { response.statusCode = 404; response.end('Not found') })
  const pathname = request.url === '/' ? '/index.html' : request.url.split('?')[0]
  const file = normalize(join(process.cwd(), 'dist', pathname))
  const fallback = join(process.cwd(), 'dist', 'index.html')
  const selected = existsSync(file) && !file.endsWith('\\') ? file : fallback
  response.writeHead(200, { 'Content-Type': mime[extname(selected)] || 'application/octet-stream' })
  createReadStream(selected).pipe(response)
})

server.listen(port, '127.0.0.1', () => console.log(`CAREEROS is ready at http://127.0.0.1:${port}`))
