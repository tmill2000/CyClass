
const { getCourse, addCourse, getCourseByJoinCode } = require('./courseService')
const roleService = require('../../role/services/roleService')
const db = require ('../../../utils/db_connection');

jest.mock('../../../utils/db_connection')


describe("courseService", () => {
    describe("addCourse",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce({ insertId: 1});
            jest.spyOn(roleService, 'addRole').mockResolvedValueOnce()
            const res = await addCourse(1, 'Title');
            expect(res).toEqual(1)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(addCourse(-1, 'Bad Title')).rejects.toThrow()
        })
    })

    describe("getCourse",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce([{course_id: 1, owner_id: 1, course_name: 'Title'}]);
            const res = await getCourse(1);
            expect(res).toEqual([{course_id: 1, owner_id: 1, course_name: 'Title'}])
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(getCourse(-1)).rejects.toThrow()
        })
    })

    describe("getCourseByJoinCode",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce([{course_id: 1, closed: false}]);
            const res = await getCourseByJoinCode('ajsjfh-akdsjhf-adnfj');
            expect(res).toEqual({course_id: 1, closed: false})
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(getCourseByJoinCode(-1)).rejects.toThrow()
        })
    })
})