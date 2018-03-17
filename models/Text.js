var mongoose = require('mongoose')
var connection = require('../models/connection')()

var TextSchema = mongoose.Schema({
    text:{type:String, required: true, maxlength:10001},
    pass:{type:String, required:true},
    url:{type:String, required:true, unique:true},
    custom_url:{ type: String, unique:true },
},{ timestamps: true })

var Text = mongoose.model('Text', TextSchema)

module.exports = Text