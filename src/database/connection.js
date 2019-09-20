const mongoose = require('mongoose')

mongoose.connect('mongodb://user:user01@ds311538.mlab.com:11538/tg', {
  useNewUrlParser: true
})

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

module.exports = mongoose