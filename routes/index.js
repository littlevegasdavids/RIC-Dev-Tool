const file = require('./file')
const solver = require('./solver')

module.exports = (app) =>{
    app.use('/file', file)
    app.use('/solver', solver)
}