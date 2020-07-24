const express = require('express')
const userRoute = require('./user')
const swapsRoute = require('./swap')

const apiRouter = express.Router()

apiRouter.use('/user', userRoute)
apiRouter.use('/swap', swapsRoute)

module.exports = apiRouter
