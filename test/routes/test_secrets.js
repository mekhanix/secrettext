const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const app =require('../../app')

chai.use(chaiHttp)

describe('secrets route (main)', function () {
    it('should return 200', function (done) {
        chai.request(app).get('/secret')
            .end(function (err, res) {
                if(err) throw new Error
                expect(res).to.have.status(200)
                done()
            })
    })
    it('should create a new mongodb document', function () {
        chai.request(app).post('/secret')
            .send({
                'text': 'hello world!',
                'custom_url' : 'foobarurl',
                'pass' : 'foobar123',
                'destroy' : 'daily'
            })
            .end(function (err, res) {
                if(err) throw new Error
                expect(res).to.redirectTo('/foobarurl/auth')
                done()
            })
    })
})