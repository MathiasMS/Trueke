const express = require('express');
const userRoute = require('./user');
const itemRoute = require('./item');

const apiRouter = express.Router();

apiRouter.use('/user', userRoute);
apiRouter.use('/item', itemRoute);

module.exports = apiRouter
