const supertest = require('supertest')
const server = require("./server")

describe('Integration test', () => {

    beforeAll(() => {
        require('dotenv').config()
    })

    it('GET "./user" returns all users', async () =>{
        // console.log(process.env)
        const res = await supertest('http://localhost').post('/api/user/login/').send({netId: 'test', password: 'pw'})
        console.log(res.body)
        const response = await supertest('http://localhost').get('/api/user/').query({id: 1})
        console.log(response.body)

    })
})





// const { getUserInfo } = require('./users')


// describe('getUserInfo', () => {

//     beforeEach(() => {
//     })

//     it('GET userInfo when called', done => {
//         expect(res.status).toEqual(200)
//     })
// })
