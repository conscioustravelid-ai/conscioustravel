import {createReadStream} from 'node:fs'
import {stat} from 'node:fs/promises'
import {createServer} from 'node:http'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..')
const port=Number.parseInt(process.env.PORT||'8765',10)
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'}

createServer(async(request,response)=>{
  try{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname)
    const relative=pathname.replace(/^\/+/, '')
    let target=path.resolve(root,relative)
    if(target!==root&&!target.startsWith(`${root}${path.sep}`))throw new Error('Path tidak aman')
    const info=await stat(target)
    if(info.isDirectory())target=path.join(target,'index.html')
    const fileInfo=await stat(target)
    if(!fileInfo.isFile())throw new Error('Bukan file')
    response.writeHead(200,{'Content-Type':types[path.extname(target).toLowerCase()]||'application/octet-stream'})
    createReadStream(target).pipe(response)
  }catch{response.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});response.end('Not found')}
}).listen(port,'127.0.0.1',()=>console.log(`Static server: http://127.0.0.1:${port}`))
