const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  console.log('req.body---->>>>>', req.body)
  console.log('--------authenticateToken-------')
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  console.log('token', token)
  if (token === null) {
    return res.status(401).json({ error: 'Токен не предоставлен' })
  }

  const accessSecret = process.env.JWT_ACCESS_SECRET || 'jwt_access_secret'

  jwt.verify(token, accessSecret, (error, user) => {
    if (error) {
      return res.status(403).json({ error: 'Неверный или истекший токен' })
    }

    req.user = user // сохраняем декодированные данные пользователя для дальнейшего использования
    next() // продолжаем обработку запроса
  })
}

module.exports = authenticateToken
