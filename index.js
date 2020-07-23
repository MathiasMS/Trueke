

async function insertPerson() {
    try {
        const result = await session.run(
            'CREATE (a:Person {name: "Nicolas"}) RETURN a',
        )

        const singleRecord = result.records[0]
        const node = singleRecord.get(0)

        console.log(node.properties.name)
    } finally {
        await session.close()
    }

    await driver.close()
}


insertPerson()
