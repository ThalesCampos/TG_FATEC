const express = require('express')
const auth = require('../middlewares/auth')

const Category = require('../models/category')

const router = express.Router()

router.use(auth)

router.get('/', async (req, res) => {
  try {
    const category = await Category.find().populate('usuario')

    return res.send(category)
  } catch (error) {
    return res.status(400).send({ error: 'Impossível listar categorias' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('usuario')

    return res.send(category)
  } catch (error) {
    return res.status(400).send({ error: 'Impossível listar categoria' })
  }
})

router.post('/', async (req, res) => {
  try {
    const category = await Category.create({ usuario: req.userId, ...req.body })

    return res.send(category)
  } catch (error) {
    return res.status(400).send({ error: 'Impossível cadastrar nova categorias' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { descricao, tipo } = req.body

    const category = await Category.findByIdAndUpdate(req.params.id, {
      descricao,
      tipo
    })

    await category.save()

    res.send(category)
  } catch (error) {
    return res.status(400).send({ error: 'Impossível atualizar categorias' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndRemove(req.params.id)

    return res.send()
  } catch (error) {
    return res.status(400).send({ error: 'Impossível excluir categoria' })    
  }
})

module.exports = app => app.use('/categorias', router)