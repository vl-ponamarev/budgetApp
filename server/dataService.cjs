const jsonServer = require('json-server')
const router = jsonServer.router('./src/assets/db.json')

const getUsersData = async (username, month) => {
  const db = router.db
  const data = await db.get('data').find({ month }).value()
  const usersData = data.users_data.find((data) => data.user_name === username)

  return new Promise((resolve, reject) => {
    if (!usersData) {
      reject(new Error('Data not found'))
    } else {
      resolve(usersData)
    }
  })
}

module.exports = { getUsersData }
