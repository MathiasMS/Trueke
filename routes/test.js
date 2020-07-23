const express = require('express');
const router = express.Router();
const { session } = require('../DBSession')
router.post('/person', async function(req, res, next) {
    const { name } = req.body
    try {
        const result = await session.run(
            `CREATE (a:Person {name: "${name}"}) RETURN a`,
        )

        const singleRecord = result.records[0]
        const node = singleRecord.get(0)

        res.send(node.properties.name)
    } finally {
        await session.close()
    }

});

module.exports = router;