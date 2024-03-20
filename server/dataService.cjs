const jsonServer = require('json-server')
const router = jsonServer.router('./src/assets/db.json')

const getUsersData = async (username, month) => {
  const db = router.db
  console.log('month', month)

  console.log('(username, month', username, month)
  const data = await db.get('data').find({ month }).value()
  const usersData = data.data.find((data) => data.user_name === username)

  console.log('usersData', data)

  return new Promise((resolve, reject) => {
    if (!usersData) {
      reject(new Error('Data not found'))
    } else {
      resolve(usersData)
    }
  })
}

module.exports = { getUsersData }
