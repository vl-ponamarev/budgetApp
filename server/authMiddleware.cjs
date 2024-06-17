const jwt = require('jsonwebtoken')
const { createRefreshToken } = require('./jwtAuthService.cjs')
const { createAccessToken } = require('./jwtAuthService.cjs')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token === 'null' || token === null) {
    return res.status(401).json({ error: 'Токен не предоставлен' })
  } else {
    const accessSecret = process.env.JWT_ACCESS_SECRET || 'jwt_access_secret'
    const refreshSecret =
      process.env.JWT_REFRESH_TOKEN_SECRET || 'jwt_refresh_secret'

    jwt.verify(token, accessSecret, (error, user) => {
      if (error) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
          return res
            .status(403)
            .json({ error: 'Refresh токен не предоставлен' })
        } else {
          // Валидация refresh токена
          jwt.verify(refreshToken, refreshSecret, (err, user) => {
            if (err) {
              return res
                .status(403)
                .json({ error: 'Неверный или истекший refresh токен' })
            }

            const now = Math.floor(Date.now() / 1000)
            const oneDayInSeconds = 24 * 60 * 60
            const remainingTime = user.exp - now

            if (remainingTime < oneDayInSeconds) {
              // Если срок действия менее одного дня, перевыпустить refresh токен
              console.log(
                'Срок действия менее одного дня, перевыпустить refresh токен',
              )
              const newRefreshToken = createRefreshToken(user)
              res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true, // Используйте true, если ваш сервер работает по HTTPS
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
                sameSite: 'Strict',
              })
            }

            const newAccessToken = createAccessToken(user)
            res.json({ accessToken: newAccessToken })
          })
        }
      }

      req.user = user // сохраняем декодированные данные пользователя для дальнейшего использования
      next() // продолжаем обработку запроса
    })
  }
}

module.exports = authenticateToken
