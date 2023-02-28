const { downloadMedia }  = require('./downloadMedia')
const mediaService = require('./services/mediaService')
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { studentSession, professorSession } = require('../../test/mock/mockStudentUserSession');

const { res, mockClear } = getMockRes()

describe('downloadMedia', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
    })

    it('should return 400 for invalid body', async () => {
        const req = getMockReq({ body: { course_id: 1 }})
        await downloadMedia(req, res);
        expect(res.status).toBeCalledWith(400)
    })
    it('should return 404 for media not available', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 1 }})
        jest.spyOn(mediaService, 'metadataForDownload').mockResolvedValueOnce([{file_type: 'png', user_in_course: false, received: false}])
        req.session = studentSession
        await downloadMedia(req, res);
        expect(res.status).toBeCalledWith(404)
    })

    it('should return 403 if user not in course', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 1 }})
        jest.spyOn(mediaService, 'metadataForDownload').mockResolvedValueOnce([{file_type: 'png', user_in_course: false, received: true}])
        req.session = studentSession
        await downloadMedia(req, res);
        expect(res.status).toBeCalledWith(403)
    })
    it('should return  for success', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 'file' }})
        req.session = professorSession
        jest.spyOn(mediaService, 'metadataForDownload').mockResolvedValueOnce([{file_type: 'png', user_in_course: true, received: true}])
        await downloadMedia(req, res);
        expect(res.sendFile).toBeCalled()

    })
    it('should return 500 for for Server error', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 'file' }})
        req.session = professorSession
        jest.spyOn(mediaService, 'metadataForDownload').mockRejectedValueOnce(new Error())
        await downloadMedia(req, res);
        expect(res.status).toBeCalledWith(500)
    })
})