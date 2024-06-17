// jwtAuth.js
const jwt = require('jsonwebtoken')

const createAccessToken = (user) => {
  const secret = process.env.JWT_SECRET || 'jwt_access_secret'
  const payload = { name: user.name }
  const options = { expiresIn: '12h' }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (error, token) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })
  })
}

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  const secret = process.env.JWT_SECRET || 'your_jwt_secret'

  jwt.verify(token, secret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: 'Неверный токен' })
    }
    req.user = decoded
    next()
  })
}
const createRefreshToken = (user) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret'
  const payload = { name: user.name }
  const options = { expiresIn: '7d' }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, refreshSecret, options, (error, refreshToken) => {
      if (error) {
        reject(error)
      } else {
        resolve(refreshToken)
      }
    })
  })
}

const refreshAccessToken = (req, res) => {
  // const { refreshToken } = req.body
  const refreshToken = req.cookies.refreshToken
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'jwt_refresh_secret'

  jwt.verify(refreshToken, refreshSecret, (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: 'Неверный refreshToken' })
    }

    // Предполагая, что decoded содержит информацию о пользователе:
    const user = { name: decoded.name }

    console.log('user----->>>>>>', user)

    createAccessToken(user)
      .then((accessToken) => {
        res.status(200).json({ accessToken })
      })
      .catch((error) => {
        res.status(500).json({ error })
      })
  })
}

module.exports = {
  createAccessToken,
  verifyToken,
  createRefreshToken,
  refreshAccessToken,
}
