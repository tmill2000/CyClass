const { getPollResponse } = require('./getPollResponse')
const pollResponseService = require('./services/pollResponseService')
const { getMockReq, getMockRes } = require('@jest-mock/express');

const { res, mockClear } = getMockRes()

describe('getPollResponse', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
        jest.clearAllMocks()
    })
    it('should return 400 if no poll_response_id provided', async () => {
        const req = getMockReq({ query: {} })
        await getPollResponse(req, res);
        expect(res.status).toBeCalledWith(400);
    });

    it('should return 200 for success and correct items for Professor', async () => {
        const req = getMockReq({ query: { poll_response_id: 1 } })
        const expected = [
            { poll_response_id: 1, user_id: 1, response_id: 1, poll_id: 1, timestamp: '2023-02-16T15:42:56.360Z' },
        ]
        const spy = jest.spyOn(pollResponseService, 'getPollResponse').mockResolvedValueOnce(expected)
        await getPollResponse(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(res.send).toBeCalledWith(expected[0])
        expect(spy).toBeCalledTimes(1);
    })
    it('should return 500 for Server Error', async () => {
        const req = getMockReq({ query: { poll_response_id: 1 } })
        const spy = jest.spyOn(pollResponseService, 'getPollResponse').mockRejectedValueOnce(new Error())
        await getPollResponse(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    })
})