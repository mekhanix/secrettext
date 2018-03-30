var mongoose = require('mongoose')
var connection = require('../models/connection')()

var TextSchema = mongoose.Schema({
    text:{type:String, required: true, maxlength:10001},
    pass:{type:String, required:true},
    url:{type:String, required:true, unique:true},
    custom_url:{ type: String },
},{ timestamps: true })

TextSchema.statics.checkURLexists = function (paramsurl,cb) {
    return this.model('Text').findOne({$or:[ {custom_url:paramsurl}, {url:paramsurl} ]}, cb)
}


TextSchema.statics.findByURLandSave = function (paramsurl, paramsText) {
    return this.model('Text').findOne({$or:[ {custom_url:paramsurl}, {url:paramsurl} ]}, function (err, updatedText) {
        updatedText.text = paramsText
        updatedText.save()
    })
}

var Text = mongoose.model('Text', TextSchema)

module.exports = Text