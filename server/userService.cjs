const jsonServer = require('json-server')
const router = jsonServer.router('./src/assets/db.json')

const getUser = (username) => {
  const db = router.db
  const user = db.get('users').find({ username }).value()

  return new Promise((resolve, reject) => {
    if (!user) {
      reject(error)
    } else {
      resolve(user)
    }
  })
}

module.exports = { getUser }
