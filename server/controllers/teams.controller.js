const ObjectId = require('mongodb').ObjectId
const Team = require('../models/team')
const User = require('../models/user')

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({ deleted: false })
    res.status(200).send(teams)
  } catch (error) {
    res.status(404).send({ message: error.message })
  }
}

const getTeam = async (req, res) => {
  const id = req.params.id

  try {
    const team = await Team.find({ _id: id }).populate('createdBy').exec()
    res.status(200).send(team)
  } catch (error) {
    res.status(404).send({ message: error.message })
  }
}

export const createTeam = async (req, res) => {
  const team = new Team(req.body)

  try {
    const user = await User.findOne({ email: req.user.email })
    team.createdBy = user._id
    await team.save()
    res.send(team)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const updateTeam = async (req, res) => {
  const id = req.params.id

  try {
    const team = await Team.findByIdAndUpdate(id, req.body)
    team.updatedAt = Date.now()
    await team.save()
    res.send(team)
  } catch (error) {
    res.status(500).send(error)
  }
}

export const deleteTeam = async (req, res) => {
  const id = req.params.id
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(404).send()
    }

    const team = await Team.findOne({ _id: id })
    await team.remove()
    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllTeams,
  getTeam,
  deleteTeam,
  createTeam,
  updateTeam,
}
