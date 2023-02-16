const { getPollMetrics } = require('./getPollMetrics')
const pollService = require('./services/pollService')
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { studentSession, professorSession, noAssociationSession } = require('../../test/mock/mockStudentUserSession');

const { res, mockClear } = getMockRes()

describe('getPollMetrics', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
        jest.clearAllMocks()
    })
    it('should return 400 for invalid body', async () => {
        const req = getMockReq({ query:{} })
        await getPollMetrics(req, res);
        expect(res.status).toBeCalledWith(400);
    });

    it('should return 401 for Unauthorized', async () => {
        const req = getMockReq({ query: {poll_id: 1, course_id: 1 } })
        req.session = noAssociationSession
        await getPollMetrics(req, res);
        expect(res.status).toBeCalledWith(401);
    })
    it('should return 200 for success and correct items for Professor', async () => {
        const req = getMockReq({ query: {poll_id: 1, course_id: 1 } })
        req.session = professorSession
        const expected = [
            { user_id: 1, poll_choice_id: 1, is_correct_choice: false },
            { user_id: 2, poll_choice_id: 2, is_correct_choice: true },
            { user_id: 3, poll_choice_id: 2, is_correct_choice: true }
        ]
        const spy = jest.spyOn(pollService, 'getPollMetrics').mockResolvedValueOnce(expected)
        await getPollMetrics(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith({ 
            totalRespondants: 3,
            correctResponses: 2,
            userResponses: expected 
        })
        expect(spy).toBeCalledTimes(1);
    })

    it('should return 200 for success and correct items for Student', async () => {
        const req = getMockReq({ query: {poll_id: 1, course_id: 1 } })
        req.session = studentSession
        const result = [
            { user_id: 1, poll_choice_id: 1, is_correct_choice: false },
            { user_id: 2, poll_choice_id: 2, is_correct_choice: true },
            { user_id: 3, poll_choice_id: 2, is_correct_choice: true }
        ]
        const spy = jest.spyOn(pollService, 'getPollMetrics').mockResolvedValueOnce(result)
        await getPollMetrics(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith({ 
            totalRespondants: 1,
            correctResponses: 0,
            userResponse: {
                user_id: 1,
                poll_choice_id: 1,
                is_correct_choice: false
            } 
        })
        expect(spy).toBeCalledTimes(1);
    })
    it('should return 500 for Server Error', async () => {
        const req = getMockReq({ query: {poll_id: 1, course_id: 1 } })
        req.session = studentSession
        const spy = jest.spyOn(pollService, 'getPollMetrics').mockRejectedValueOnce(new Error())
        await getPollMetrics(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    })
})