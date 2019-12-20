/* eslint-disable no-tabs */

module.exports = {
  name: 'mongodb-insertone',
  version: '1.0.0',
  outputs: [
    {
      color: '#666D77',
      description: `result, ctx`
    }
  ],
  inputs: [
    {
      color: 'red',
      description: `db`
    },
    {
      color: '#666D77',
      description: `data`
    }],

  refTemplate: `{{collection}}`,

  props: {
    collection: { type: 'string', default: 'tests', required: true },
    limit: { type: 'number', default: 100 }
  },

  mounted: ({ send, bus, state, options }) => {
    // Components internal state
    state = {
      db: {}
    }

    // Util
    const insertOne = async (doc = {}) => {
      const collection = state.db.collection(options.collection)
      const docs = await collection.insertOne(doc)
      return docs
    }

    // Save db connection
    bus.on('data:0', (db) => {
      state.db = db
    })

    // Handle events
    bus.on('data:1', async (doc, mixed) => {
      console.log(doc)

      const response = await insertOne(doc)
      // console.log(response)
      send(0, response, mixed)
    })
  }
}
