const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const comparePassword = async (password, hashed_password) => {
  return await bcrypt.compare(password, hashed_password)
}

module.exports = { hashPassword, comparePassword };