const express = require('express')
const { session } = require('../DBSession')
const { v4: uuidv4 } = require('uuid')

const router = express.Router()

const mockedData = [
  {
    index: "a",
    userId: 'google-oauth2|103252823292280469428',
    name: 'Nicolas Medina Sanchez',
    email: 'nicoms91@gmail.com',
    picture: 'https://lh3.googleusercontent.com/a-/AOh14GjyEjZZtJ6QqClUj6REGVv5iRzi8-byNDN4fYWS4Q',
    items: [
      {
        title: 'Item A',
        description: 'Descripcion del Item A',
        category: 'Otros',
        quality: 'Nuevo',
        id: uuidv4()
      },
      {
        title: 'Item B',
        description: 'Descripcion del Item B',
        category: 'Otros',
        quality: 'Como nuevo',
        id: uuidv4()
      }
    ]
  },
  {
    index: "b",
    userId: 'google-oauth2|103469408900365175724',
    name: 'Mathias Medina',
    email: 'mathiasmedinasanchez11@gmail.com',
    picture: 'https://lh3.googleusercontent.com/a-/AOh14GjS8DPYiXWwei2W7GjQDKHX2MxdsEBNW1txlr3ncQ',
    items: [
      {
        title: 'Item C',
        description: 'Descripcion del Item C',
        category: 'Otros',
        quality: 'Nuevo',
        id: uuidv4()
      },
      {
        title: 'Item D',
        description: 'Descripcion del Item D',
        category: 'Otros',
        quality: 'Como nuevo',
        id: uuidv4()
      }
    ]
  },
  {
    index: "c",
    userId: 'google-oauth2|102086238854069576400',
    name: 'Vivi Saludable',
    email: 'vivisaludable1@gmail.com',
    picture: 'https://lh3.googleusercontent.com/a-/AOh14Gi30GPvHaYZMJUgEiHHyFy9CTfD49AbiNLFN-0t',
    items: [
      {
        title: 'Item E',
        description: 'Descripcion del Item E',
        category: 'Otros',
        quality: 'Nuevo',
        id: uuidv4()
      },
      {
        title: 'Item F',
        description: 'Descripcion del Item F',
        category: 'Otros',
        quality: 'Como nuevo',
        id: uuidv4()
      }
    ]
  }
]

router.post('/clear', async (req, res, next) => {
  try {
    const result = await session.run(
      `
      MATCH (n)
      OPTIONAL MATCH (n)-[r]-()
      WITH n,r LIMIT 50000
      DELETE n,r
      RETURN count(n) as deletedNodesCount
      `
    )
    
    const records = result.records[0].get(0)
    
    res.json(records)
  } catch (e) {
    next(e)
  }
})

router.post('/populate', async function (req, res, next) {
  const generateQuery = user => (
    `
     CREATE  (${user.index}:User {id: "${user.userId}", name: "${user.name}", email: "${user.email}", picture: "${user.picture}"})
     ${user.items.reduce((acc,item) => (
       `
        ${acc}
        CREATE (:Item { id: "${item.id}", title: "${item.title}", description: "${item.description}", category: "${item.category}", quality: "${item.quality}"})<-[:OWNS]-(${user.index})
       `
    ),'')}
    `
  )
  
  try {
    
    // const result = await Promise.all(mockedData.map(user => session.run(generateQuery(user))))
    const createMockedDataQuery = mockedData.reduce((acc, user) => (
      `
        ${acc}
        ${generateQuery(user)}
      `), '')
    
    const result = await session.run(createMockedDataQuery)
    
    res.json(result.records)
  } catch (e) {
    next(e)
  }
})

module.exports = router
