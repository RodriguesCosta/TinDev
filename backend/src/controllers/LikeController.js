const Dev = require('../models/Dev')

module.exports = {
  store: async (req, res) => {
    const { io, connectedUsers } = res.locals
    const { devId } = req.params
    const { user } = req.headers

    const [loggedDev, targetDev] = await Promise.all([
      Dev.findById(user).exec(),
      Dev.findById(devId).exec(),
    ])

    if (!targetDev || !loggedDev) {
      res.status(400).json({
        error: 'Dev not exists'
      })
      return
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedSocket = connectedUsers[loggedDev._id]
      const targetSocket = connectedUsers[targetDev._id]

      if (loggedSocket) {
        io.to(loggedSocket).emit('match', targetDev)
      }

      if (targetSocket) {
        io.to(targetSocket).emit('match', loggedDev)
      }
    }

    loggedDev.likes.push(targetDev._id)
    await loggedDev.save()

    res.json(loggedDev)
  }
}