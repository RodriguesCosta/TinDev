const port = 3333

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes')

mongoose.connect('mongodb://localhost:27017/tindev', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const connectedUsers = {}

io.on('connection', socket => {
  const { user } = socket.handshake.query
  connectedUsers[user] = socket.id
})

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  res.locals.io = io
  res.locals.connectedUsers = connectedUsers
  next()
})
app.use(routes)

server.listen(port, () => {
  console.log(`Server start on port ${port}`)
})
