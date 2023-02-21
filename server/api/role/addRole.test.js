const { addRole }  = require('./addRole')
const roleService = require('./services/roleService')
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { studentSession, professorSession } = require('../../test/mock/mockStudentUserSession');

const { res, mockClear } = getMockRes()

describe('addLecture', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
    })

    it('should return 400 for invalid body', async () => {
        const req = getMockReq({ body: { course_id: 1 }})
        await addRole(req, res);
        expect(res.status).toBeCalledWith(400)
    })
    it('should return 401 for invalid body', async () => {
        const req = getMockReq({ body: { course_id: 1, user_id: 1, role: 'PROFESSOR' }})
        req.session = studentSession
        await addRole(req, res);
        expect(res.status).toBeCalledWith(401)
    })
    it('should return 201 for success', async () => {
        const req = getMockReq({ body: { course_id: 1, user_id: 1, role: 'PROFESSOR' }})
        req.session = professorSession
        jest.spyOn(roleService, 'addRole').mockResolvedValueOnce(1)
        await addRole(req, res);
        expect(res.status).toBeCalledWith(201)

    })
    it('should return 500 for for Server error', async () => {
        const req = getMockReq({ body: { course_id: 1, user_id: 1, role: 'PROFESSOR' }})
        req.session = professorSession
        jest.spyOn(roleService, 'addRole').mockRejectedValueOnce(new Error())
        await addRole(req, res);
        expect(res.status).toBeCalledWith(500)
    })
})