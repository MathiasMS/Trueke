const express = require('express')
const userRoute = require('./user')
const swapsRoute = require('./swap')
const opportunityRoute = require('./opportunity')
const itemRoute = require('./item')
const matchRoute = require('./match')

const apiRouter = express.Router()

apiRouter.use('/user', userRoute)
apiRouter.use('/swap', swapsRoute)
apiRouter.use('/item', itemRoute)
apiRouter.use('/opportunity', opportunityRoute)
apiRouter.use('/match', matchRoute)

module.exports = apiRouter
