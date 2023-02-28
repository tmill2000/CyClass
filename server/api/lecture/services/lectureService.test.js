
const { addLecture, getLecture, getLecturesByCourseId } = require('./lectureService')
const db = require ('../../../utils/db_connection');

jest.mock('../../../utils/db_connection')


describe("lectureService", () => {
    describe("getLecture",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce([{ lecture_id: 1, course_id: 1, title: 'Test'}]);
            const res = await getLecture(1);
            expect(res).toEqual([{ lecture_id: 1, course_id: 1, title: 'Test'}])
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(getLecture(-1)).rejects.toThrow()
        })
    })

    describe("getLectureByCourseId",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce([{ lecture_id: 1, course_id: 1, title: 'Test'}]);
            const res = await getLecturesByCourseId(1);
            expect(res).toEqual([{ lecture_id: 1, course_id: 1, title: 'Test'}])
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(getLecturesByCourseId(-1)).rejects.toThrow()
        })
    })

    describe("addLecture",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce({ insertId: 1});
            const res = await addLecture(1, 'New Lecture');
            expect(res).toBe(1)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(addLecture(-1)).rejects.toThrow()
        })
    })
})