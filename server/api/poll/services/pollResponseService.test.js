
const { addPollResponse, getPollResponse } = require('./pollResponseService')
const db = require ('../../../utils/db_connection');

jest.mock('../../../utils/db_connection')


describe("pollResponseService", () => {
    describe("getPollResponse",  () => {
        it('should return response', async () => {
            const expected = [{ poll_response_id: 1, user_id: 1, response_id: 1, poll_id: 1, timestamp: '2023-02-16T15:42:56.360Z' }]
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce(expected);
            const res = await getPollResponse(1);
            expect(res).toEqual(expected)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(getPollResponse(-1)).rejects.toThrow()
        })
    })

    describe("addPollResponse",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce({ insertId: 1});
            const res = await addPollResponse(1, 1, 1);
            expect(res).toBe(1)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(addPollResponse(-1)).rejects.toThrow()
        })
    })
})