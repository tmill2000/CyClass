const { getPollById } = require('./getPolls')
const pollService = require('./services/pollService')
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { noAssociationSession, studentSession } = require('../../test/mock/mockStudentUserSession');

const { res, mockClear } = getMockRes()

describe('getPollResponse', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
        jest.clearAllMocks()
    })
    it('should return 400 for missing params', async () => {
        const req = getMockReq({ query: {} })
        await getPollById(req, res);
        expect(res.status).toBeCalledWith(400);
    });

    it('should return 401 if user not in course', async () => {
        const req = getMockReq({ query: {poll_id: 1, course_id: 2} })
        req.session = noAssociationSession
        await getPollById(req, res);
        expect(res.status).toBeCalledWith(401);
    });

    it('should return 200 for success and correct items for Professor', async () => {
        const req = getMockReq({ query: {poll_id: 1, course_id: 1} })
        const expected = [
            { 
                poll_id: 1, 
                timestamp: '2023-02-16T15:42:56.360Z',
                closed: 0,
                sender_id: 1,
                poll_choices: [
                    {
                        poll_choice_id: 2,
                        question_text: '?',
                        choice_text: '??',
                        is_correct_choice: false
                    }
                ]
            },
        ]
        req.session = studentSession
        const spy = jest.spyOn(pollService, 'getPollById').mockResolvedValueOnce(expected)
        await getPollById(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(spy).toBeCalledTimes(1);
    })

    it('should return 200 for success and correct items for Professor', async () => {
        const req = getMockReq({ query: {poll_id: 1, course_id: 1} })
        const expected = [
            { 
                poll_id: 1, 
                timestamp: '2023-02-16T15:42:56.360Z',
                close_date: '2023-02-16T15:42:56.360Z',
                closed: 0,
                sender_id: 1,
                poll_choices: [
                    {
                        poll_choice_id: 2,
                        question_text: '?',
                        choice_text: '??',
                        is_correct_choice: false
                    }
                ]
            },
        ]
        req.session = studentSession
        const spy = jest.spyOn(pollService, 'getPollById').mockResolvedValueOnce(expected)
        await getPollById(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(spy).toBeCalledTimes(1);
    })

    it('should return 200 if no data found', async () => {
        const req = getMockReq({ query: {poll_id: 1, course_id: 1} })
        const expected = []
        req.session = studentSession
        const spy = jest.spyOn(pollService, 'getPollById').mockResolvedValueOnce(expected)
        await getPollById(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(spy).toBeCalledTimes(1);
    })
    it('should return 500 for Server Error', async () => {
        const req = getMockReq({ query: {poll_id: 1, course_id: 1} })
        req.session = studentSession
        const spy = jest.spyOn(pollService, 'getPollById').mockRejectedValueOnce(new Error())
        await getPollById(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    })
})