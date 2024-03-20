const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./src/assets/db.json')
const middlewares = jsonServer.defaults()
server.use(jsonServer.bodyParser)
const setupRoutes = require('./routes.cjs')

const authenticateToken = require('./authMiddleware.cjs')

const cookieParser = require('cookie-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const cookieOptions = {
  maxAge: 1000 * 60 * 60 * 12,
  httpOnly: true,
}
server.use(cookieParser())
server.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'test',
    resave: true,
    store: new FileStore(),
    saveUninitialized: true,
    cookie: cookieOptions,
  }),
)

server.use((req, res, next) => {
  console.log('Cookies received:', req.cookies) // Выводит все куки
  console.log('Session ID cookie:', req.cookies['connect.sid'])
  next()
})
setupRoutes(server)

server.use(middlewares)

function isAuthenticated(req, res, next) {
  if (req.path === '/login' || req.path === '/register') {
    next()
  } else {
    authenticateToken(req, res, next)
  }
}

server.use(isAuthenticated)

server.use(router)

const PORT = process.env.VITE_PORT || 5070

server.listen(PORT, () => {
  console.log(`Json-server стартовал на порту ${PORT}`)
})
