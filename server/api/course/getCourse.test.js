const { getCourse } = require('.//getCourse')
const courseService = require('./services/courseService')
const { getMockReq, getMockRes } = require('@jest-mock/express');

const { res, mockClear } = getMockRes()

describe('getCourse', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
        jest.clearAllMocks()
    })
    it('should return 400 for invalid body', async () => {
        const req = getMockReq({ query: {} })
        await getCourse(req, res);
        expect(res.status).toBeCalledWith(400);
    });
    it('should return 200 for success', async () => {
        const req = getMockReq({ query: { course_id: 1 } })
        const spy = jest.spyOn(courseService, 'getCourse').mockResolvedValueOnce()
        await getCourse(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(spy).toBeCalledTimes(1);
    })
    it('should return 500 for Server Error', async () => {
        const req = getMockReq({ query: { course_id: 1 } })
        const spy = jest.spyOn(courseService, 'getCourse').mockRejectedValueOnce(new Error())
        await getCourse(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    })
})