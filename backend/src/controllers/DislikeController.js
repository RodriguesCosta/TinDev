const Dev = require('../models/Dev')

module.exports = {
  store: async (req, res) => {
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

    loggedDev.dislikes.push(targetDev._id)
    await loggedDev.save()

    res.json(loggedDev)
  }
}