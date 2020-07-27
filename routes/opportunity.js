const express = require('express')
const { session } = require('../DBSession')

const router = express.Router()

router.get('/:userId', async function (req, res, next) {
  const { userId } = req.params

  try {
    const result = await session.run(
      `
                MATCH (uItems:Item)<-[:OWNS]-(u:User {id: "${userId}" })
                MATCH path=((uItems)<-[:WANTS_TO_SWAP*1..]-(:Item))
                UNWIND NODES(path) AS n
                WITH path, uItems,u, SIZE(COLLECT(DISTINCT n)) AS testLength
                WHERE testLength = LENGTH(path) + 1
                WITH uItems, u, last(nodes(path)) as opp
                WHERE NOT (opp)<-[:OWNS]-(u) AND NOT (uItems)-[:WANTS_TO_SWAP]->(opp)
                return collect({userItem: properties(uItems), opportunity: properties(opp)})
            `
    )

    const records = result.records[0].get(0)

    res.json(records)
  } catch (e) {
    next(e)
  }
})

module.exports = router
