const express = require('express')
const { session } = require('../DBSession')
const checkMatch = require('../lib/checkMatch')
const { v4: uuidv4 } = require('uuid')
const router = express.Router()

router.post('/:itemWantedId', async function (req, res, next) {
  const { itemWantedId } = req.params
  const userId = req.user.sub
  const { itemToSwapFor } = req.body
  console.log('itemWantedId', itemWantedId, 'itemToSwapFor', itemToSwapFor, 'userId')

  try {
    const result = await session.run(
      `
      MATCH(itemToSwapFor:Item { id: "${itemToSwapFor}"})
      WHERE(itemToSwapFor)<-[:OWNS]-(:User {id: "${userId}"})
      MATCH(itemWanted:Item { id: "${itemWantedId}"})
      MERGE(itemToSwapFor)-[:WANTS_TO_SWAP]->(itemWanted)

            `
    )
    const records = result.records

    const nodes = records.map((singleNode) => singleNode.get(0).properties)
    
    res.status(200).json(nodes)
    
    const match = await checkMatch(itemToSwapFor)
  
    if (!match) {
      console.log('No hay match...')
      return
    }
    
    console.log('Match found.')
    
    console.log('Creating chat')
    
    const chatId = uuidv4()
    
    console.log('Chat successfully created!')
    
    console.log('Creating Match Node...')
    const matchQuery = match.reduce((acc, node, i) => {
      return `${acc}
              MATCH (i${i.toString()}:Item { id: "${node.get(0).properties.id}"})
      `
    }, '')
    
    const createQuery = match.reduce((acc, node, i) => {
      return `${acc}
              CREATE (i${i.toString()})-[:IS_PART_OF]->(m)
      `
    }, '')
    
    
    const query = `
        ${matchQuery}
        CREATE (m:Match {id: "${uuidv4()}", chatId: "${chatId}", status: "ACTIVE"})
        ${createQuery}
        `
  
    await session.run(query)
    
    console.log('Match Node Created!')
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
