const express = require('express')
const { session } = require('../DBSession')
const checkMatch = require('../lib/checkMatch')
const router = express.Router()

router.post('/:itemWantedId', async function (req, res, next) {
  const { itemWantedId } = req.params
  const userId = req.user.sub
  const { itemToSwapFor } = req.body
  console.log('itemWantedId', itemWantedId, 'itemToSwapFor', itemToSwapFor, 'userId', userId)

  try {
    checkMatch(itemToSwapFor)
    // const result = await session.run(
    //   `
    //   MATCH(itemToSwapFor:Item { id: "${itemToSwapFor}"})
    //   WHERE(itemToSwapFor)<-[:OWNS]-(:User {id: "${userId}"})
    //   MATCH(itemWanted:Item { id: "${itemWantedId}"})
    //   CREATE(itemToSwapFor)-[:WANTS_TO_SWAP]->(itemWanted)
    //
    //         `
    // )
    //
    // const records = result.records
    // const nodes = records.map((singleNode) => singleNode.get(0).properties)
    //
    // res.json(nodes)
  } catch (e) {
    next(e)
  }
})

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
