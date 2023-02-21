const { addUser }  = require('./addUser')
const userService = require('./services/userService')
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { res, mockClear } = getMockRes()

describe('addLecture', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
    })

    it('should return 400 for invalid body', async () => {
        const req = getMockReq({ body: {netid: 'netid', first_name: 'first_name', last_name: 'last_name' }})
        await addUser(req, res);
        expect(res.status).toBeCalledWith(400)
    })
    it('should return 201 for success', async () => {
        const req = getMockReq({ body: {netid: 'netid', password: 'pw', first_name: 'first_name', last_name: 'last_name' }})
        jest.spyOn(userService, 'addUser').mockResolvedValueOnce(1)
        await addUser(req, res);
        expect(res.status).toBeCalledWith(201)

    })
    it('should return 500 for for Server error', async () => {
        const req = getMockReq({ body: {netid: 'netid', password: 'pw', first_name: 'first_name', last_name: 'last_name' }})
        jest.spyOn(userService, 'addUser').mockRejectedValueOnce(new Error())
        await addUser(req, res);
        expect(res.status).toBeCalledWith(500)
    })
})