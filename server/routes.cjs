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
        const users = db.get('users').value()
        const userExists = db.get('users').find({ username }).value()

        if (userExists) {
          res
            .status(400)
            .json({ error: 'Пользователь с таким именем уже существует' })
        } else {
          // Создаем нового пользователя и сохраняем в db.json
          console.log('users.length', users.length)
          const newUser = {
            username,
            password: hashedPassword,
            id: users.length + 1,
          }
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
              res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // Используйте true, если ваш сервер работает по HTTPS
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
                sameSite: 'Strict',
              })
              res.status(201).json({
                message: 'Пользователь успешно зарегистрирован',
                username: newUser.username,
                id: users.length,
                accessToken,
                // refreshToken,
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
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // Используйте true, если ваш сервер работает по HTTPS
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
            sameSite: 'Strict',
            path: '/',
          })
          res.status(200).json({ accessToken, username, id: user.id })
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

  app.get('/data/:month/users_data/:userId', (req, res) => {
    const { month, userId } = req.params
    const db = router.db
    const dataEntry = db
      .get('data')
      .find({ month: Number(month) })
      .value()

    if (dataEntry) {
      const usersData = dataEntry?.users_data
      const currentUserData = usersData.find((user) => {
        return String(user.user_id) === String(userId)
      })
      if (currentUserData) {
        res.json({
          message: `Данные пользователя id: ${userId}`,
          users_data: currentUserData,
        })
      } else {
        res
          .status(404)
          .json({ error: `Данные пользователя id: ${userId} не найдены` })
      }
    } else {
      res
        .status(404)
        .json({ error: `Данные пользователя id: ${userId} не найдены` })
    }
  })

  app.patch('/data/:month/users_data/:userId', (req, res) => {
    const { month, userId } = req.params
    // const updatedUserData = req.body
    const db = router.db
    const dataEntry = db
      .get('data')
      .find({ month: Number(month) })
      .value()

    if (dataEntry) {
      const userData = dataEntry?.users_data
      const updatedUserData = userData.map((user) =>
        String(user.user_id) === String(userId) ? req.body : user,
      )
      db.get('data')
        .find({ month: Number(month) })
        .assign({ users_data: updatedUserData })
        .write()

      res.json({
        message: 'Пользователь успешно обновлен',
        users_data: req.body,
      })
    } else {
      res.status(404).json({ error: 'Запись для данного месяца не найдена' })
    }
  })

  app.post('/data/:month/users_data/:userId', (req, res) => {
    const { month, userId } = req.params
    const newUser = req.body
    const db = router.db
    const monthNumber = Number(month)
    const dataEntry = db.get('data').find({ month: monthNumber }).value()
    const usersData = dataEntry?.users_data
    let currentUserData
    if (usersData) {
      currentUserData = usersData?.find((user) => {
        return String(user.user_id) === String(userId)
      })
    }
    if (dataEntry && !currentUserData) {
      db.get('data')
        .find({ month: monthNumber })
        .get('users_data')
        .push(newUser)
        .write()
      res.json({
        message: 'Пользователь успешно добавлен',
        newUser: newUser,
      })
    } else if (!dataEntry) {
      db.get('data')
        .push({
          month: monthNumber,
          users_data: [newUser],
          id: monthNumber,
        })
        .write()
      res.json({
        message: 'Новый месяц и пользователь успешно добавлены',
        newUser: newUser,
      })
    } else {
      res.json({
        message:
          'Пользователь уже существует, данные отправлены в userBudgetData',
      })
    }
  })
}
