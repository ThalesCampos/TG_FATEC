const express = require('express')
const auth = require('../middlewares/auth')

const Transaction = require('../models/transaction')
const User = require('../models/user')
const Account = require('../models/account')
const Category = require('../models/category')

const router = express.Router()

router.use(auth)

router.get('/relatorio', async (req, res) => {
  try {
    const { de, ate } = req.body

    let newDe = new Date(de)
    let newAte = new Date(ate)

    newAte.setDate(newAte.getDate() + 1)

    const transaction = await Transaction.find({ usuario: req.userId, data: { $gte: newDe, $lt: newAte } })

    return res.send(transaction)
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Impossível listar transações' })
  }
})

router.get('/', async (req, res) => {
  try {
    const transaction = await Transaction.find().populate(['usuario', 'conta', 'categoria', 'transacao'])

    return res.send(transaction)
  } catch (error) {
    return res.status(400).send({ error: 'Impossível listar transações' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(['usuario', 'conta', 'categoria', 'transacao'])

    return res.send(transaction)
  } catch (error) {
    return res.status(400).send({ error: 'Impossível listar transação' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { conta, valor, tipo, categoria } = req.body
    const { saldo: saldoUser } = await User.findById(req.userId)
    const { tipo: tipoCategory } = await Category.findById(categoria)

    if (tipoCategory !== tipo) {
      return res.send('Adicione uma categoria que corresponde ao tipo de transação selecionada')
    }

    if (conta) {
      const { saldo: saldoAccount } = await Account.findById(conta)


      if (tipo === 'Entrada') {
        await Account.findByIdAndUpdate(conta, {
          saldo: saldoAccount + valor
        })
      } else if (tipo == 'Saida' && saldoAccount - valor > 0) {
        await Account.findByIdAndUpdate(conta, {
          saldo: saldoAccount - valor
        })
      }
    }

    if (tipo === 'Entrada') {
      await User.findByIdAndUpdate(req.userId, {
        saldo: saldoUser + valor
      })
    } else if (tipo === 'Saida' && saldoUser - valor > 0) {
      await User.findByIdAndUpdate(req.userId, {
        saldo: saldoUser - valor
      })
    }

    const transaction = await Transaction.create({ usuario: req.userId, ...req.body })

    return res.send(transaction)

  } catch (error) {
    return res.status(400).send({ error: 'Impossível cadastrar nova transação' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    let { conta, categoria, transacao, descricao, tipo, valor, data } = req.body

    const { saldo: saldoUser } = await User.findById(req.userId)
    const { valor: valorOld } = await Transaction.findById(req.params.id)

    if (!data) {
      const { data: oldData } = await Transaction.findById(req.params.id)

      data = oldData
    }

    if (saldoUser - valor < 0) {
      return res.send('Impossível atualizar transação, saldo não pode ser negativo')
    }

    if (conta) {
      const { saldo: saldoAccount } = await Account.findById(conta)

      if (saldoAccount - valor < 0) {
        return res.send('Impossível atualizar transação, saldo não pode ser negativo')
      }

      if (tipo === 'Entrada') {
        await Account.findByIdAndUpdate(conta, {
          saldo: saldoAccount + (valor - valorOld)
        })
      } else if (tipo == 'Saida' && saldoAccount - valor > 0) {
        await Account.findByIdAndUpdate(conta, {
          saldo: saldoAccount - valor
        })
      }
    }

    if (tipo === 'Entrada') {
      await User.findByIdAndUpdate(req.userId, {
        saldo: saldoUser + (valor - valorOld)
      })
    } else if (tipo === 'Saida' && saldoUser - valor > 0) {
      await User.findByIdAndUpdate(req.userId, {
        saldo: saldoUser - valor
      })
    }

    const transaction = await Transaction.findByIdAndUpdate(req.params.id, {
      conta,
      categoria,
      transacao,
      descricao,
      tipo,
      valor,
      data
    })

    await transaction.save()

    res.send(transaction)
  } catch (error) {
    console.log(error)
    return res.status(400).send({ error: 'Impossível atualizar transação' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { tipo, valor, conta } = await Transaction.findById(req.params.id)
    const { saldo } = await User.findById(req.userId)

    if (conta) {
      const { saldo: saldoAccount } = await Account.findById(conta)

      if (saldoAccount - valor < 0) {
        return res.send('Impossível atualizar transação, saldo não pode ser negativo')
      }

      if (tipo === 'Entrada') {
        await Account.findByIdAndUpdate(conta, {
          saldo: saldoAccount - valor
        })
      } else if (tipo == 'Saida' && saldoAccount - valor > 0) {
        await Account.findByIdAndUpdate(conta, {
          saldo: saldoAccount + valor
        })
      }
    }

    if (tipo === 'Entrada') {
      if (saldo - valor < 0) {
        return res.status(400).send({ error: 'Saldo não pode ser negativo' })
      }

      await User.findByIdAndUpdate(req.userId, {
        saldo: saldo - valor
      })
    } else if (tipo === 'Saida') {
      await User.findByIdAndUpdate(req.userId, {
        saldo: saldo + valor
      })
    }

    await Transaction.findByIdAndRemove(req.params.id)

    return res.send()
  } catch (error) {
    return res.status(400).send({ error: 'Impossível excluir transação' })
  }
})

module.exports = app => app.use('/transacoes', router)