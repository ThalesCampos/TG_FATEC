const mongoose = require('../../database/connection')

const TransactionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true
  },
  conta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contas'
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorias',
    required: true
  },
  transacao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transacoes'
  },
  descricao: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100
  },
  tipo: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  },
  valor: {
    type: Number,
    required: true,
    min: .01
  },
  data: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

const transaction = mongoose.model('Transacoes', TransactionSchema)

module.exports = transaction