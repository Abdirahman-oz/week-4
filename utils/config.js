require('dotenv').config()

const PORT = process.env.PORT
const MONGO_URL = process.env.NODE_ENV === 'test' 
? process.env.TEST_MONGODB_URI
:process.env.MONGO_URL

module.exports = {
  PORT,
  MONGO_URL
}
