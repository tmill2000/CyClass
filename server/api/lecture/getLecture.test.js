const { getLecture, isLectureLive, getLecturesByCourseId }  = require('./getLecture')
const lectureService = require('./services/lectureService')
const { getMockReq, getMockRes } = require('@jest-mock/express');
const { studentSession, noAssociationSession } = require('../../test/mock/mockStudentUserSession');

const { res, mockClear } = getMockRes()
describe('getLecture', () => {

    beforeEach(() => {
        mockClear() // can also use clearMockRes()
    })

    describe('getLecture', () => {
        it('should return 400 for Missing Parameters', async () => {
            const req = getMockReq({ query: { course_id: 1 }})
            await getLecture(req, res);
            expect(res.status).toBeCalledWith(400)
        })
        it('should return 401 for insufficient perms', async () => {
            const req = getMockReq({ query: { course_id: 1, lecture_id: 1 }})
            req.session = noAssociationSession
            await getLecture(req, res);
            expect(res.status).toBeCalledWith(401)
        })
        it('should return 200 for success', async () => {
            const req = getMockReq({ query: { course_id: 1, lecture_id: 1 }})
            req.session = studentSession
            jest.spyOn(lectureService, 'getLecture').mockResolvedValueOnce([{lecture_id: 1, course_id: 1, title: 'foo'}])
            await getLecture(req, res);
            expect(res.status).toBeCalledWith(200)
    
        })
        it('should return 500 for for Server error', async () => {
            const req = getMockReq({ query: { course_id: 1, lecture_id: 1 }})
            req.session = studentSession
            jest.spyOn(lectureService, 'getLecture').mockRejectedValueOnce(new Error())
            await getLecture(req, res);
            expect(res.status).toBeCalledWith(500)
        })
    })

    describe('getLecturesByCourseId', () => {
        it('should return 400 for Missing Parameters', async () => {
            const req = getMockReq({ query: {  }})
            await getLecturesByCourseId(req, res);
            expect(res.status).toBeCalledWith(400)
        })
        it('should return 401 for insufficient perms', async () => {
            const req = getMockReq({ query: { course_id: 1 }})
            req.session = noAssociationSession
            await getLecturesByCourseId(req, res);
            expect(res.status).toBeCalledWith(401)
        })
        it('should return 200 for success', async () => {
            const req = getMockReq({ query: { course_id: 1 }})
            req.session = studentSession
            jest.spyOn(lectureService, 'getLecturesByCourseId').mockResolvedValueOnce([{lecture_id: 1, course_id: 1, title: 'foo'}])
            await getLecturesByCourseId(req, res);
            expect(res.status).toBeCalledWith(200)
    
        })
        it('should return 500 for for Server error', async () => {
            const req = getMockReq({ query: { course_id: 1 }})
            req.session = studentSession
            jest.spyOn(lectureService, 'getLecturesByCourseId').mockRejectedValueOnce(new Error())
            await getLecturesByCourseId(req, res);
            expect(res.status).toBeCalledWith(500)
        })
    })

    describe('isLectureLive', () => {
        it('should return 400 for Missing Parameters', async () => {
            const req = getMockReq({ query: { course_id: 1 }})
            await isLectureLive(req, res);
            expect(res.status).toBeCalledWith(400)
        })
        it('should return 401 for insufficient perms', async () => {
            const req = getMockReq({ query: { course_id: 1, lecture_id: 1 }})
            req.session = noAssociationSession
            await isLectureLive(req, res);
            expect(res.status).toBeCalledWith(401)
        })
        it('should return 200 for success', async () => {
            const req = getMockReq({ query: { course_id: 1, lecture_id: 1 }})
            req.session = studentSession
            await isLectureLive(req, res);
            expect(res.status).toBeCalledWith(200)
        })
    })
    
})