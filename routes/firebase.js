const express = require('express')
const serviceAccount = require('../firebaseServiceAccountKey.json')
const firebaseAdmin = require('firebase-admin')

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://trueque-285816.firebaseio.com'
})

const router = express.Router()

router.get('/', async function (req, res, next) {
  const { sub: uid } = req.user

  try {
    const firebaseToken = await firebaseAdmin.auth().createCustomToken(uid)
    res.json({ firebaseToken })
  } catch (err) {
    next(err)
  }
})

module.exports = router
