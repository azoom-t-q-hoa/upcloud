const axios = require('axios')
const instance = axios.create({
  baseURL: 'https://gate.upcloud.com/',
})
module.exports = instance
