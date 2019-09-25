const express = require('express')
const auth = require('../middlewares/auth')

const Account = require('../models/account')
const User = require('../models/user')

const router = express.Router()

router.use(auth)

router.get('/', async (req, res) => {
  try {
    const account = await Account.find({ usuario: req.userId }).populate('usuario')

    return res.send(account)
  } catch (error) {
    return res.status(400).send({ error: 'Impossível listar contas bancárias' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const account = await Account.find({ id: req.params.id, usuario: req.userId }).populate('usuario')

    return res.send(account)
  } catch (error) {
    return res.status(400).send({ error: 'Impossíivel listar conta bancária' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { saldo: saldoAccount } = req.body
    const { saldo: saldoUser } = await User.findById(req.userId)
    const account = await Account.create({ usuario: req.userId, ...req.body })

    await User.findByIdAndUpdate(req.userId, {
      saldo: Number(saldoUser + saldoAccount)
    })

    return res.send(account)
  } catch (error) {
    return res.status(400).send({ error: 'Impossível cadastrar nova conta bancária' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { descricao } = req.body
    const { usuario } = await Account.findById(req.params.id)

    if (usuario !== req.userId) {
      return res.status(400).send({ error: 'Impossível atualizar conta bancária' })
    }

    const account = await Account.findByIdAndUpdate(req.params.id, {
      descricao
    })

    await account.save()

    res.send(account)
  } catch (error) {

    console.log(error)
    return res.status(400).send({ error: 'Impossível atualizar conta bancária' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { saldo: saldoAccount, usuario } = await Account.findById(req.params.id)
    const { saldo: saldoUser } = await User.findById(req.userId)

    if (usuario !== req.userId) {
      return res.status(400).send({ error: 'Impossível atualizar conta bancária' })
    }

    await Account.findByIdAndRemove(req.params.id)

    await User.findByIdAndUpdate(req.userId, {
      saldo: Number(saldoUser - saldoAccount)
    })

    return res.send()
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Impossível excluir conta bancária' })
  }
})

module.exports = app => app.use('/contas-bancarias', router)