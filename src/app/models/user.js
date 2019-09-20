const mongoose = require('../../database/connection')
const bcrypt = require('bcryptjs')

const d = new Date()

let dia = d.getDate().toString()
dia = (dia.length == 1) ? `0${dia}` : dia

let mes = (d.getMonth() + 1).toString()
mes = (mes.length == 1) ? `0${mes}` : mes

let ano = d.getFullYear()

const minAge = `${ano - 100}-${mes}-${dia}`
const maxAge = `${ano - 18}-${mes}-${dia}`

const UserSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    maxlength: 150,
    minlength: 25,
    lowercase: true
  },
  nascimento: {
    type: Date,
    required: true,
    min: minAge,
    max: maxAge
  },
  email: {
    type: String,
    required: true,
    minlength: 15,
    maxlength: 100,
    unique: true
  },
  usuario: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 20,
    unique: true
  },
  senha: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
    maxlength: 20,
  },
  saldo: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true })

UserSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.senha, 10)
  
  this.senha = hash

  next
})

const user = mongoose.model('Usuarios', UserSchema)

module.exports = user