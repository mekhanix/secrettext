var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/secrettext')

var db = mongoose.connection

module.exports = function () {
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', function() {
        console.log('connected!')
    })
}