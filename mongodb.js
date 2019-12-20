const MongoClient = require('mongodb').MongoClient
const mongodb = require('mongodb')

module.exports = {
  name: 'mongodb',
  title: 'mongodb',
  version: '1.0.0',
  color: '#ff0000',
  icon: 'file-text-o',
  outputs: [
    {
      color: '#666D77',
      description: `db`
    },
    {
      color: '#666D77',
      description: `error`
    }
  ],

  props: {
    url: { type: 'string', default: 'mongodb://localhost:27017' }
  },

  status: {
    connected: { color: 'green' },
    error: { color: 'red' }
  },

  mounted: async ({ send, options, setStatus, log, variables }) => {
    const { url } = options

    const STATES = {
      CONNECTED: { text: 'connected', color: 'green' },
      ERROR: { text: 'error', color: 'red' }
    }

    const dbName = 'test'

    log(`Connecting to database: ${url}`)
    // var url = 'mongodb://localhost:27017/example'
    try {
      const client = await MongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })

      setStatus(STATES.CONNECTED)

      client.on('authenticated', () => {
        setStatus('authenticated')
      })

      client.on('fullsetup', () => {
        setStatus('fullsetup')
      })

      // Proxy Events to LowOnCode ( http://mongodb.github.io/node-mongodb-native/2.1/api/Db.html#event )
      // When the mongodb server goes down, the driver emits a 'close' event
      client.on('close', () => {
        console.log('MongoDb: Error')
        setStatus('error')
      })

      // The driver tries to automatically reconnect by default, so when the
      // server starts the driver will reconnect and emit a 'reconnect' event.
      client.on('reconnect', () => {
        console.log('MongoDb: reconnect')
        setStatus('connected')
      })

      // Select database
      const db = client.db(dbName)

      // Add mongodb library
      db.mongodb = mongodb

      send(0, db)
    } catch (err) {
      console.warn(err)
      send(1, err)
      setStatus(STATES.ERROR)
    }
  }
}

// function testDb() {
//       // db.collection('tests').fin d().toArray(function (err, docs) {
//       //   console.log(err)
//       //   console.log('Found the following records')
//       //   console.log(docs)
//       // })
// }
