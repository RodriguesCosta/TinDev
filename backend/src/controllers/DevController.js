const axios = require('axios')
const Dev = require('../models/Dev')

module.exports = {
  store: async (req, res) => {
    const { username } = req.body

    const userExists = await Dev.findOne({ user: username }).exec()

    if (userExists) {
      res.json(userExists)
      return
    }

    const response = await axios.get(`https://api.github.com/users/${username}`)

    const { name, bio, avatar_url: avatar } = response.data

    const dev = await Dev.create({
      user: username,
      name, bio, avatar
    })

    res.json(dev)
  },
  index: async (req, res) => {
    const { user } = req.headers

    const loggedDev = await Dev.findById(user).exec()

    const users = await Dev.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } },
      ]
    }).exec()

    res.json(users)
  }
}