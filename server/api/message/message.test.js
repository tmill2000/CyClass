const { addMessage } = require('./message')
const messageService = require('./services/messageService')
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { studentSession, noAssociationSession } = require('../../test/mock/mockStudentUserSession');
const { res, mockClear } = getMockRes()

describe('getMessage', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
        jest.clearAllMocks()
    })
    it('should return 400 for invalid params', async () => {
        const req = getMockReq({ body: {} })
        req.session = noAssociationSession
        await addMessage(req, res);
        expect(res.status).toBeCalledWith(400);
    });

    it('should return 500 for Server Error', async () => {
        const req = getMockReq({
            body: {
                body: 'body',
                lecture_id: 1,
                parent_id: null,
                course_id: 1,
            }
        })
        req.session = studentSession
        const spy = jest.spyOn(messageService, 'addMessage').mockRejectedValueOnce(new Error())
        await addMessage(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    })

    it('should return 401 for unauthorized', async () => {
        const req = getMockReq({
            body: {
                body: 'body',
                lecture_id: 1,
                parent_id: null,
                course_id: 1,
            }
        })
        req.session = noAssociationSession
        const spy = jest.spyOn(messageService, 'addMessage').mockResolvedValueOnce()
        await addMessage(req, res);
        expect(res.status).toBeCalledWith(401);
    })
    it('should return 201 for success', async () => {
        const req = getMockReq({
            body: {
                body: 'body',
                lecture_id: 1,
                parent_id: null,
                course_id: 1,
            }
        })
        req.session = studentSession
        const spy = jest.spyOn(messageService, 'addMessage').mockResolvedValueOnce()
        await addMessage(req, res);
        expect(res.status).toBeCalledWith(201);
        expect(spy).toBeCalledTimes(1);
    })

    it('should return 201 for success with media', async () => {
        const req = getMockReq({
            body: {
                body: 'body',
                lecture_id: 1,
                parent_id: null,
                course_id: 1,
                has_media: true
            }
        })
        req.session = studentSession
        const spy = jest.spyOn(messageService, 'addMessage').mockResolvedValueOnce()
        jest.spyOn(messageService, 'addMediaMetadata').mockResolvedValueOnce()
        await addMessage(req, res);
        expect(res.status).toBeCalledWith(201);
        expect(spy).toBeCalledTimes(1);
    })
})