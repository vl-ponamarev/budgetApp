const bcrypt = require('bcrypt')
const {
  createAccessToken,
  createRefreshToken,
} = require('./jwtAuthService.cjs')
const saltRounds = 3
const jsonServer = require('json-server')
const { getUsersData } = require('./dataService.cjs')
const router = jsonServer.router('./src/assets/db.json')

module.exports = function (app) {
  app.post('/register', (req, res) => {
    const { username, password } = req.body
    bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
      if (err) {
        res
          .status(500)
          .json({ error: 'Внутренняя ошибка сервера при хэшировании пароля' })
      } else {
        // Получаем доступ к базе данных
        const db = router.db
        const userExists = db.get('users').find({ username }).value()
        if (userExists) {
          res
            .status(400)
            .json({ error: 'Пользователь с таким именем уже существует' })
        } else {
          // Создаем нового пользователя и сохраняем в db.json
          const newUser = { username, password: hashedPassword }
          db.get('users').push(newUser).write()
          Promise.all([
            createAccessToken(newUser.username),
            createRefreshToken(newUser.username),
          ])
            .then(([accessToken, refreshToken]) => {
              db.get('access_tokens')
                .push({ username: newUser.username, accessToken })
                .write()
              db.get('refresh_tokens')
                .push({ username: newUser.username, refreshToken })
                .write()
              res.status(201).json({
                message: 'Пользователь успешно зарегистрирован',
                username: newUser.username,
                accessToken,
                refreshToken,
              })
            })
            .catch((error) => {
              res
                .status(500)
                .json({ message: 'Ошибка при создании пользователя', error })
            })
        }
      }
    })
  })
  app.post('/refresh', (req, res) => {
    const { refresh_token } = req.body
    const refreshSecret =
      process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret'

    jwt.verify(refresh_token, refreshSecret, (error, decoded) => {
      if (error) {
        return res.status(401).json({ error: 'Неверный refreshToken' })
      }

      const user = { name: decoded.name }

      createAccessToken(user)
        .then((accessToken) => {
          res.status(200).json({ accessToken })
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: 'Ошибка при создании accessToken', error })
        })
    })
  })
  app.post('/usersdata', async (req, res) => {
    console.log('запрос ====>>>>> ,req.body', req.body)
    const { username, date } = req.body
    if (username) {
      await getUsersData(username, date)
        .then((data) => {
          res.status(200).json({ data })
        })
        .catch((error) => {
          res.status(500).json({
            message: `Данные пользователя ${username} отсутствуют`,
            data: [],
            error,
          })
        })
    }
  })

  app.post('/login', async (req, res) => {
    const { username, password } = req.body
    console.log('req.body', req.body)
    if (username && password) {
      try {
        const db = router.db
        const user = db.get('users').find({ username }).value()
        if (!user) {
          return res.status(401).json({ message: 'Пользователь не существует' })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (passwordMatch) {
          const accessToken = await createAccessToken(username)
          const refreshToken = await createRefreshToken(username)
          res.status(200).json({ accessToken, refreshToken, username })
        } else {
          return res.sendStatus(401) // Incorrect password
        }
      } catch (e) {
        console.log(e)
        return res.status(500).json({ message: e.message })
      }
    } else {
      return res.status(400).json({ message: 'Пропущены логин или пароль' })
    }
  })
}
