const express = require('express')
const userRoute = require('./user')
const swapsRoute = require('./swap')
const opportunityRoute = require('./opportunity')

const apiRouter = express.Router()

apiRouter.use('/user', userRoute)
apiRouter.use('/swap', swapsRoute)
apiRouter.use('/opportunity', opportunityRoute)

module.exports = apiRouter
