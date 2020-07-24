const express = require('express')
const { session } = require('../DBSession')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()

router.get('/', async function (req, res, next) {
  try {
    const result = await session.run(
      `
                MATCH (u:User)
                RETURN u
            `
    )

    const records = result.records
    const nodes = records.map((singleNode) => singleNode.get(0).properties)

    res.json(nodes)
  } catch (e) {
    next(e)
  }
})

router.get('/:userId', async function (req, res, next) {
  const { userId } = req.params
  try {
    const result = await session.run(
      `
           MATCH (u:User { id: "${userId}"})
           RETURN u`
    )

    const singleRecord = result.records[0]
    const node = singleRecord.get(0)

    res.json(node.properties)
  } catch (e) {
    next(e)
  }
})

router.post('/', async function (req, res, next) {
  const { name, email } = req.body
  try {
    const result = await session.run(
      `
            CREATE (u:User {name: "${name}", email: "${email}", id: "${uuidv4()}"})
            RETURN u
            `
    )

    const singleRecord = result.records[0]
    const node = singleRecord.get(0)

    res.json(node.properties)
  } catch (e) {
    next(e)
  }
})

router.put('/:userId', async function (req, res, next) {
  const { userId } = req.params
  const { name, email } = req.body
  try {
    const result = await session.run(
      `
            MERGE (u:User {id: '${userId}'})
            SET u.name = '${name}', u.email = '${email}'
            RETURN u
          `
    )

    const singleRecord = result.records[0]
    const node = singleRecord.get(0)

    res.json(node.properties)
  } catch (e) {
    next(e)
  }
})

router.delete('/:userId', async function (req, res, next) {
  const { userId } = req.params

  try {
    const result = await session.run(`
                MATCH (u:User {id: "${userId}"})
                OPTIONAL MATCH (u)-[r]-()
                DELETE u, r
                return u
        `)

    if (result.summary.counters.containsUpdates()) {
      return res.status(200).send()
    }

    return res.status(404).send()
  } catch (e) {
    next(e)
  }
})

module.exports = router
