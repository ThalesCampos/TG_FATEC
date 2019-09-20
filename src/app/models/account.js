const mongoose = require('../../database/connection')

const AccountSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true
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
  numero: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
    unique: true
  },
  agencia: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 10
  },
  saldo: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true })

const bill = mongoose.model('Contas', AccountSchema)

module.exports = bill