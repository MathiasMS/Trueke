const { session } = require('../DBSession')

const MAX_CIRCLE_LENGTH = 4

const checkMath = async (itemId) => {
  const query = `
    MATCH (i:Item { id: "${itemId}"})
    MATCH p = (i)-[:WANTS_TO_SWAP*..${MAX_CIRCLE_LENGTH}]->(i)
    WITH p, length(p) as len
    ORDER by len ASC LIMIT 1
    UNWIND nodes(p) as node
    RETURN distinct node
  `
  
  const result = await session.run(query)
  
  console.log('result', result.records.length )
  
  if (result.records.length === 0) {
    return null
  }
  
  return result.records
  
}

module.exports = checkMath
