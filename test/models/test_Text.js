const Text = require('../../models/Text')
const bcrypt = require('bcrypt')
const expect = require('chai').expect
const assert = require('chai').assert
const crypto = require('crypto')

// Text Model Test
describe('TextModel', function () {
    beforeEach(function(done) {
        Text.remove({}, function () {
            done()
        })
    })
    it('save new secret text', function (done) {
        bcrypt.hash('foobar123', 10, function(err, hash) {
            var newText = new Text({
                text:'hello world',
                custom_url:'',
                pass:hash,
                url:crypto.randomBytes(10).toString('hex')
            })
            newText.save(function (err, newText) {
                if (err) { throw new Error(err) }
                expect(newText).to.be.an('object')
                expect(newText).is.not.empty
                expect(newText).to.not.have.an('error')
            })
            done()
        })
    })
    
    it('text should be not null', function (done) {
        bcrypt.hash('foobar123', 10, function(err, hash) {
            var newText = new Text({
                text:null,
                custom_url:'',
                pass:hash,
                url:crypto.randomBytes(10).toString('hex')
            })
            newText.validate(function (err) {
                expect(err.errors.text).to.exist
                done()
            })
        })
    })

    it('url should be a string', function (done) {
        bcrypt.hash('foobar', 10, function(err, hash) {
            var newText = new Text({
                text:'foo bar',
                custom_url:'',
                pass:hash,
                url:12345667
            })
            newText.save(function (err, results) {
                assert.typeOf(newText.url, 'string')
                done()
            })
        })
    })

    it('custom url is string', function (done) {
        bcrypt.hash('foobar', 10, function(err, hash) {
            var newText = new Text({
                text:'foo bar',
                custom_url:1234567,
                pass:hash,
                url:1234567
            })
            newText.save(function (err, results) {
                assert.typeOf(newText.custom_url, 'string')
                assert.typeOf(newText.url, 'string')
                done()
            })
        })
    })

    it('text length should not > 10001 characters', function (done) {
        bcrypt.hash('foobar', 10, function(err, hash) {
            var newText = new Text({
                text:crypto.randomBytes(10001).toString('hex'), //generate 20002 characters
                custom_url:'',
                pass:hash,
                url:crypto.randomBytes(10).toString('hex')
            })
            newText.validate(function (err) {
                expect(err.errors.text).to.exist
                done()
            })
        })
    })
})