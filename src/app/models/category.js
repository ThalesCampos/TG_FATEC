const mongoose = require('../../database/connection')

const CategorySchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true
  },
  descricao: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100
  },
  tipo: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20
  }
}, { timestamps: true })

const category = mongoose.model('Categorias', CategorySchema)

module.exports = category