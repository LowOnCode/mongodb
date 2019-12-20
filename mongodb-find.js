/* eslint-disable no-tabs */

module.exports = {
  name: 'mongodb-find',
  version: '1.0.0',
  outputs: [
    {
      color: '#666D77',
      description: `result, ctx`
    }
  ],
  inputs: [
    {
      color: '#666D77',
      description: `db`
    },
    {
      color: '#666D77',
      description: `ctx`
    }],

  props: {
    collection: { type: 'string', default: 'tests', required: true },
    limit: { type: 'number', default: 100 }
  },

  mounted: ({ send, bus, state, log, options, variables }) => {
    // Components internal state
    state = {
      db: {}
    }

    // Save db connection
    bus.on('data:0', (db) => {
      state.db = db
    })

    // Util
    const find = async (query = {}) => {
      const collection = state.db.collection(options.collection)
      const docs = await collection.find(query).toArray()
      log('Found the following records')
      log(docs)
      return docs
    }

    // Handle events
    bus.on('data:1', async (mixed) => {
      const docs = await find()
      console.log(docs)
      send(0, docs, mixed)
    })
  }
}
