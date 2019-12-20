module.exports = {
  name: 'mongodb-root',
  version: '0.0.2',
  description: 'Some basic core components',
  components: [
    require('./mongodb'),
    require('./mongodb-find'),
    require('./mongodb-insertone')
  ]
}
