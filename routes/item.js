const express = require('express')
const { session } = require('../DBSession')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()

router.get('/', async function (req, res, next) {
  try {
    const result = await session.run(
      `MATCH (i:Item)
                  RETURN i`
    )

    const records = result.records
    const nodes = records.map((singleNode) => singleNode.get(0).properties)

    res.json(nodes)
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async function (req, res, next) {
  const { id } = req.params

  try {
    const result = await session.run(
      `MATCH (i:Item { id: "${id}"})
              RETURN i`
    )

    const records = result.records
    const nodes = records.map((singleNode) => singleNode.get(0).properties)

    res.json(nodes)
  } catch (e) {
    next(e)
  }
})

router.put('/', async function (req, res, next) {
  const { name, description, image, itemId } = req.body

  const query = `
             MATCH (i:Item {id:"${itemId}"}) SET 
             ${name ? `i.name = "${name}"` : ''}
             ${description ? `i.description = "${description}"` : ''}
             ${image ? `i.image = "${image}"` : ''}
             return i
            `
  try {
    const result = await session.run(query)

    const singleRecord = result.records[0]
    const node = singleRecord.get(0)

    res.json(node.properties)
  } catch (e) {
    next(e)
  }
})

router.post('/', async function (req, res, next) {
  const { name, description, image, userId } = req.body

  try {
    const result = await session.run(
      `
                MATCH (u:User)
                WHERE u.id = "${userId}"
                CREATE (i:Item {id: "${uuidv4()}", name: "${name}", description: "${description}", image: "${image}"}) <- [r:OWNS] - (u)
                RETURN i
            `
    )

    const singleRecord = result.records[0]
    const node = singleRecord.get(0)

    res.json(node.properties)
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async function (req, res, next) {
  const { id } = req.params

  try {
    const result = await session.run(`
                MATCH (i:Item {id: "${id}"})
                OPTIONAL MATCH (i)-[r]-()
                DELETE i, r
                return i
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
