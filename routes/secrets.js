const express = require('express')
const router = express.Router({strict:true})
const crypto = require('crypto')
const Text = require('../models/Text')
const bcrypt = require('bcrypt')
const cron = require('node-cron')
const validate = require('../utils/validation')
const {cron_string} = require('../config')

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Secret Text' })
})

router.post('/', function (req, res, next) {
    validate(req)
    req.getValidationResult()
        .then((res_err)=>{
            if (res_err.array().length > 0) {
                res.render('index', { errors:res_err.array() })
                return
            }
            else {
                bcrypt.hash(req.body.pass, 10, function(err, hash) {                
                    var newText = new Text({
                        text: req.body.text,
                        custom_url: req.body.custom_url,
                        pass: hash,
                        url:unique_url()
                    })
                    newText.save(function (err, newtext) {
                        if (err) { 
                            throw new Error(err) 
                        }
                        if (req.body.destroy !== 'never') {
                        // crontab
                            console.log('running cron')
                            cron.schedule(cron_string[req.body.destroy], function(){
                                Text.remove({ _id:  newtext._id}, function (err) {
                                    if (err) throw new Error(err)
                                    console.log('destroyed!')
                                })
                            })
                        }
                        newtext.custom_url !== '' ? res.redirect(`secret/${newtext.custom_url}`) : res.redirect(`secret/${newtext.url}`) 
                    })
                })
            }
        })
        .catch((err)=>{throw err})



})

router.get('/:url', function (req, res, next) {
    Text.findOne({$or:[ {custom_url:req.params.url}, {url:req.params.url} ]}, function (err, text) {
        if (text != null) {
            var activeUrl = text.custom_url !== '' ? text.custom_url : text.url
        }
        else {
            res.status(404).render('error', {message:'Not Found'})
            return
        }

        if (err) { throw new Error(err) }
        if (!req.session.auth || req.session.auth.url !== req.params.url) {
            return res.redirect(`./${activeUrl}/auth`)
        }
        else {
            res.render('show', {payload:text})
        }
    })
})

router.post('/:url/auth', function (req, res, next) {
    var text = new Text()
    text.checkURLexists(req.params.url, function (err, text) {
        bcrypt.compare(req.body.pass, text.pass, function(err, result) {
            if (result) {
                req.session.auth = {url : req.params.url, ip : req.ip}
                return res.redirect(`/secret/${req.params.url}?auth=true`)
            }
            else {
                res.status(403).send('Forbidden')
            }
        })
    })
})

router.get('/:url/auth', function (req, res, next) {
    var text = new Text()
    text.checkURLexists(req.params.url, function (err, text) {
        if (text !== null) {
            res.render('show_pass', {url:req.params.url})            
        }
        else {
            res.status(404).render('error', {message:'Not Found'})
            return
        }
    })
})

function unique_url() {
    return crypto.randomBytes(10).toString('hex')
}

module.exports = router
