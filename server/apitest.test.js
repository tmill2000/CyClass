// import axios from 'axios'

// const supertest = require('supertest')
// const server = require("./server")
const axios = require('axios')
require('dotenv').config()

describe('Integration tests', () => {

    beforeAll(() => {
        require('dotenv').config()
    })

    
    it('POST "user/login" logs user in', async() => {
        const requestConfig = {
            url: 'http://localhost/api/user/login',
            method: 'POST',
            data: {
                netid: 'test',
                password: 'password'
            }
        }
        const res = await axios.request(requestConfig)
        console.log(res.data)
        expect(res.data).toBeDefined()
        expect(res.status).toBe(200)
        sessionId = res.data.sessionId
    })

    it('GET "user/login" logs user in', async() => {
        const requestConfig = {
            url: 'http://localhost/api/user/login',
            method: 'GET',
            params: {
                id: 1,
            },
            headers: {
                'x-session-id': sessionId
            }
        }

        const res = await axios.request(requestConfig)
        expect(res.data).toEqual({
            userId: 1,
            email: 'test@iastate.edu',
            first_name: 'test',
            last_name: 'test'
        });
    })

    // it('GET "/user/login" logs user in', async () =>{
    //     const reqConfig = {
    //         url: 'http://localhost/api/user/login',
    //         method: 'POST',
    //         data:{
    //             netId: "maruf",
    //             password: "maruf"
    //         }
    //     }

    //     const res = await axios.request(reqConfig)
    //     expect(res.data).toBeDefined()
    //     expect(res.status).toBe(200)
    // })

    // THE ONLY WORKING TEST
    // it('POST "/user/login" create user', async () =>{
    //     console.log('hello world')
    //     const res = await axios.post('http://localhost/api/user/login', {
    //         netId: 'user1',
    //         password: 'pw',
    //         first_name: 'user1',
    //         last_name: 'user1'

    //     })
    //     console.log(res.data)
    //     expect(res.status).toBe(200)

    //     expect(res.data).toEqual({
    //         userId: 1,
    //         userRoles: [{ role_id: 1, course_id: 1, course_name: '100', role: 'PROFESSOR' }]
    //     })

    //     const userInfoRes = await axios.post('http://localhost/api/user/login')
    //     expect(userInfoRes.data).toEqual({
    //         userId: 1,
    //         userRoles: {role_id: 1, course_id: 1, course_name: '100', role: 'PROFESSOR'},
    //     })
    // })

    // it('POST "/course" create course', async () =>{
    //     console.log('hello world')
    //     const res = await axios.get('http://localhost/api/course', {
    //         ownerID: 1,
    //         courseTitle: '100'
    //     })
    //     console.log(res.data)
    //     expect(res.status).toBe(200)
    // })

    it('POST "/message" user posts a message', async () =>{
        console.log('hello world')
    })

    it('POST "/poll" user (professor) posts a poll', async () =>{
        console.log('hello world')
    })
})

