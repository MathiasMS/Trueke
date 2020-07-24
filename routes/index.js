const express = require('express')
const userRoute = require('./user')
const swapsRoute = require('./swap')
const itemRoute = require('./item')

const apiRouter = express.Router();

apiRouter.use('/user', userRoute)
apiRouter.use('/swap', swapsRoute)
apiRouter.use('/item', itemRoute);

module.exports = apiRouter
