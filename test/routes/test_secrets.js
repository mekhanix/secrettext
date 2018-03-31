const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app =require('../../app')

chai.use(chaiHttp)

describe('secrets route (main)', function () {
    it('should return 200', function (done) {
        chai.request(app).get('/secret')
            .end(function (err, res) {
                if(err) throw new Error(err)
                expect(res).to.have.status(200)
                done()
            })
    })
    it('should create a new text with custom_url', function (done) {
        chai.request('127.0.0.1:3000').post('/secret')
            .send({
                'text': 'hello world!',
                'custom_url' : 'foobarurl',
                'pass' : 'foobar123',
                'destroy' : 'daily'
            })
            .end(function (err, res) {
                expect(res).to.redirectTo('127.0.0.1:3000/secret/foobarurl/auth')
                done()
            })
    })

    it('should create a new text with random generated url', function (done) {
        chai.request(app).post('/secret')
            .send({
                'text': 'hello world!',
                'pass' : 'foobar123',
                'custom_url' : '',
                'destroy' : 'never'
            })
            .end(function (err, res) {
                expect(res).to.have.status(200)
                done()
            })
    })

    it('should fail/validate when create text with duplicate custom_url', function (done) {
        chai.request(app).post('/secret')
            .send({
                'text': 'hello world!',
                'custom_url' : 'foobarurl',
                'pass' : 'foobar123',
                'destroy' : 'daily'
            })
            .end(function (err, res) {
                if(err) throw new Error(err)
                expect(res.text).to.have.string('oops..that url is already taken, try something else')
                done()
            })
    })

    it('should throw 403 password doesn\'t match', function (done) {
        chai.request(app).post('/secret/foobarurl/auth')
            .send({
                'pass' : 'foobar12345',
            })
            .end(function (err, res) {
                expect(res).to.have.status(403)
                done()
            })
    })
})