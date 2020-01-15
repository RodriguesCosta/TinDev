const port = 3333

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes')

mongoose.connect('mongodb://localhost:27017/tindev', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const server = express()
server.use(cors())
server.use(express.json())

server.use(routes)

server.listen(port, () => {
  console.log(`Server start on port ${port}`)
})
