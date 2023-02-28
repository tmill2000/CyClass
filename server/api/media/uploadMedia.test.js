const { uploadMedia }  = require('./uploadMedia')
const mediaService = require('./services/mediaService')
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { studentSession, professorSession, noAssociationSession } = require('../../test/mock/mockStudentUserSession');
const fs = require('fs');
const { res, mockClear } = getMockRes()

describe('downloadMedia', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
    })

    it('should return 400 for invalid body', async () => {
        const req = getMockReq({ body: { course_id: 1 }})
        await uploadMedia(req, res);
        expect(res.status).toBeCalledWith(400)
    })
    it('should return 401 for media not available', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 1 }})
        req.session = noAssociationSession
        await uploadMedia(req, res);
        expect(res.status).toBeCalledWith(401)
    })

    it('should return 400 file type not supported', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 1 }})
        jest.spyOn(mediaService, 'metadataForDownload').mockResolvedValueOnce([{file_type: 'pnge', user_in_course: false, received: true}])
        req.session = studentSession
        await uploadMedia(req, res);
        expect(res.status).toBeCalledWith(400)
    })
    it('should return 403 for forbidden', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 'file' }})
        req.session = professorSession
        req.get = jest.fn().mockReturnValue('x/png')
        jest.spyOn(mediaService, 'authUpload').mockResolvedValueOnce([{user_id: 69, course_id: 1, received: true}])
        await uploadMedia(req, res);
        expect(res.status).toBeCalledWith(403)

    })

    it('should return 200 for success', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 'file' }})
        req.session = professorSession
        req.get = jest.fn().mockReturnValue('x/png')
        jest.spyOn(mediaService, 'authUpload').mockResolvedValueOnce([{user_id: 1, course_id: 1, received: true}])
        fs.existsSync = jest.fn().mockReturnValue(false)
        fs.mkdirSync = jest.fn().mockReturnValue()
        fs.writeFile = jest.fn().mockReturnValue()
        jest.spyOn(mediaService, 'updateMediaMetadataOnReceived').mockResolvedValueOnce()
        await uploadMedia(req, res);
        expect(res.status).toBeCalledWith(200)
    })

    it('should return 200 for success', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 'file' }})
        req.session = professorSession
        req.get = jest.fn().mockReturnValue('x/png')
        jest.spyOn(mediaService, 'authUpload').mockResolvedValueOnce([{user_id: 1, course_id: 1, received: true}])
        fs.existsSync = jest.fn().mockReturnValue(true)
        fs.mkdirSync = jest.fn().mockReturnValue()
        fs.writeFile = jest.fn().mockReturnValue()
        jest.spyOn(mediaService, 'updateMediaMetadataOnReceived').mockResolvedValueOnce()
        await uploadMedia(req, res);
        expect(res.status).toBeCalledWith(200)
    })
    
    it('should return 500 for for Server error', async () => {
        const req = getMockReq({ query: { course_id: 1, media_id: 'file' }})
        req.get = jest.fn().mockReturnValue('x/png')
        req.session = professorSession
        jest.spyOn(mediaService, 'authUpload').mockRejectedValueOnce(new Error())

        await uploadMedia(req, res);
        expect(res.status).toBeCalledWith(500)
    })
})