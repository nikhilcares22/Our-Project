const express = require('express');
const route = express.Router()

let user = require('./userRoutes')
let admin = require('./adminRoutes')

// route.use('/user', user)
route.use('/admin', admin)

module.exports = route