const jwt = require('jsonwebtoken')
const {
  createRefreshToken,
  createAccessToken,
} = require('./jwtAuthService.cjs')
const jsonServer = require('json-server')
const router = jsonServer.router('./src/assets/db.json')

const authenticateAccess = (req, res, next) => {
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
              console.log(
                'Срок действия менее одного дня, перевыпустить refresh токен',
              )
              const newRefreshToken = createRefreshToken(user)
              res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                sameSite: 'Strict',
              })
            }

            const newAccessToken = createAccessToken(user)
            res.json({ accessToken: newAccessToken })
          })
        }
      } else {
        req.user = user // добавляем декодированные данные пользователя в req.user
        res.cookie('username', user.name, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 12,
        })
        next()
      }
    })
  }
}

module.exports = authenticateAccess
