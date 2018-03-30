
const Text = require('../models/Text')
module.exports = function (req) {
    req.checkBody('text', 'oops..something went wrong with your text :(').isLength({min:1, max:10001})
    req.checkBody('pass', 'oops..something went wrong with your pass :( ').isLength({min:5})
    req.checkBody('custom_url', 'oops..that url is already taken, try something else')
        .custom((value)=>{
            return new Promise(function (resolve, reject) {
                Text.findOne({custom_url:value, $not:[{custom_url:''}]},(err, res)=>{
                    res ? reject() : resolve()
                })           
            })
        })
}
