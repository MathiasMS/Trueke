const express = require('express')
const { session } = require('../DBSession')

const router = express.Router()

router.get('/requested', async function (req, res, next) {
  const { userId } = req.query

  if (!userId) throw Error('userId must be provided')

  try {
    const result = await session.run(
      `
                MATCH(u:User {id: '${userId}'}) -[:OWNS]->(i:Item)-[:WANTS_TO_SWAP]->(ii:Item)
                RETURN [i, ii] as pair
                
            `
    )

    const records = result.records
    const nodes = records.map((singleNode) => singleNode.toObject().pair.map((item) => item.properties))

    res.json(nodes)
  } catch (e) {
    next(e)
  }
})

router.get('/received', async function (req, res, next) {
  const { userId } = req.query

  if (!userId) throw Error('userId must be provided')

  try {
    const result = await session.run(
      `
                MATCH(u:User {id: '${userId}'}) -[:OWNS]->(i:Item)<-[:WANTS_TO_SWAP]-(ii:Item)
                RETURN [i, ii] as pair
                
            `
    )

    const records = result.records
    const nodes = records.map((singleNode) => singleNode.toObject().pair.map((item) => item.properties))

    res.json(nodes)
  } catch (e) {
    next(e)
  }
})

module.exports = router
