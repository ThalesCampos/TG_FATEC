const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authConfig = require('../../config/auth')

const User = require('../models/user')
const Transaction = require('../models/transaction')
const Account = require('../models/account')
const Category = require('../models/category')

const auth = require('../middlewares/auth')

const router = express.Router()

function gerarToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: '24h'
  })
}

router.post('/', async (req, res) => {
  const { usuario } = req.body;

  try {
    if (await User.findOne({ usuario })) {
      return res.status(400).send({
        error: 'User already exists'
      })
    }
    const user = await User.create(req.body)

    user.senha = undefined

    return res.send({
      user,
      token: gerarToken({ id: user.id })
    })

  } catch (err) {
    return res.status(400).send({
      error: 'Registration failed'
    })
  }
})

router.post('/login', async (req, res) => {
  const { usuario, senha } = req.body

  try {
    const user = await User.findOne({ usuario }).select('+senha')

    if (!user) {
      return res.status(400).send({
        error: 'User not found'
      })
    }

    if (!await bcrypt.compare(senha, user.senha)) {
      return res.status(400).send({
        error: 'Invalid password'
      })
    }

    user.senha = undefined

    return res.send({
      user,
      token: gerarToken({ id: user.id })
    })
  } catch (err) {
    return res.status(400).send({
      error: 'Registration failed'
    })
  }
})

router.put('/', auth, async (req, res) => {
  try {
    const { saldo: deposito } = req.body
    const { saldo } = await User.findById(req.userId)

    await User.findByIdAndUpdate(req.userId, {
      saldo: saldo + deposito
    })
    
    return res.send()
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Impossível atualizar saldo' })
  }
})

module.exports = app => app.use('/usuarios', router) 