const express = require('express')
const { session } = require('../DBSession')

const router = express.Router()

router.get('/:userId', async function (req, res, next) {
  const { userId } = req.params

  try {
    const result = await session.run(
      `
                MATCH (uItems:Item)<-[:OWNS]-(u:User {id: "${userId}" })
                MATCH (uItems)-[:IS_PART_OF]->(m:Match)
                MATCH (mi:Item)-[:IS_PART_OF]->(m) WHERE NOT (mi)<-[:OWNS]->(u)
                WITH m, uItems, collect(properties(mi)) as matchedItems
                return collect({matchData: properties(m), userItem:properties(uItems), matchedItems: matchedItems})
            `
    )

    const records = result.records[0].get(0)

    res.json(records)
  } catch (e) {
    next(e)
  }
})

module.exports = router
