const express = require('express')
const http = require('http')
const { WebSocketServer } = require('ws')
const { MemoryCharactersRepo } = require('./repos')
const config = require('./config')
const { MemoryBus } = require('./bus')
const { Socket } = require('./socket')

async function main () {
  const app = express()
  const srv = http.createServer(app)
  const ws = new WebSocketServer({
    server: srv
  })

  const deps = {
    repos: {
      charactersConnected: new MemoryCharactersRepo()
    },
    bus: new MemoryBus()
  }

  ws.on('connection', async socket => {
    const s = new Socket(deps, socket)
    await s.start()
  })

  srv.listen(3333, () => {
    const { address, port } = srv.address()
    console.log(`Server listening on ${address}:${port}`)
  })
}

main()
