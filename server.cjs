// import jsonServer from 'json-server'
// import path from 'path'
// import cors from 'cors'
// import { config } from 'dotenv'
// import { fileURLToPath } from 'url'

// config()

// const server = jsonServer.create()
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// console.log('__dirname', path.join(__dirname, './src/assets/db_.json'))

// const router = jsonServer.router(path.join(__dirname, './src/assets/db.json'))

// const middlewares = jsonServer.defaults()

// server.use(
//   cors({
//     credentials: true,
//     origin: true,
//   }),
// )

// server.use(middlewares)
// server.use(router)

// const PORT = process.env.VITE_PORT

// server.listen(PORT, () => {
//   console.log(`Json-server стартовал на порту ${PORT}`)
// })

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./src/assets/db.json')

const middlewares = jsonServer.defaults()

require('dotenv').config()

const cors = require('cors')
server.use(
  cors({
    credentials: true,
    origin: true,
  }),
)

server.use(middlewares)
server.use(router)

const PORT = process.env.VITE_PORT || 5070

server.listen(PORT, () => {
  console.log(`Json-server стартовал на порту ${PORT}`)
})
