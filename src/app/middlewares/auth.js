const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')

module.exports = (req, res, next) => {
  const { authorization: auth } = req.headers

  if (!auth) {
    return res.status(401).send({
      error: 'No token provided'
    })
  }

  const tokenSplit = auth.split(' ')

  if (tokenSplit.length !== 2) {
    return res.status(401).send({
      error: 'Token error'
    })
  }

  const [Bearer, token] = tokenSplit

  if (!/^Bearer$/i.test(Bearer)) {
    return res.status(401).send({
      error: 'Token malformatted'
    })
  }

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        error: 'Token invalid'
      })
    }
    
    req.userId = decoded.id

    return next()
  })
}