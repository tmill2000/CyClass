
const { getPollMetrics, closePoll, addPoll } = require('./pollService')
const db = require('../../../utils/db_connection');

jest.mock('../../../utils/db_connection')


describe("pollService", () => {

    describe('addPoll', () => {
        it('should return response', async () => {
            const spy = jest.spyOn(db, 'runQuery')
            spy
                .mockResolvedValueOnce({ insertId: 1 })
                .mockResolvedValueOnce({ insertId: 1 })
                .mockResolvedValueOnce({ insertId: 2 });
            const resp = await addPoll(
                1,
                1,
                'Why am I not being paid?', [
                { choice_text: 'They hate us cuz they ain\'t us', is_correct_choice: false },
                { choice_text: 'Just cuz', is_correct_choice: true }
            ]
            );
            expect(resp).toEqual({ pollId: 1, pollChoiceIds: [1, 2] });
            expect(spy).toBeCalledTimes(3)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(addPoll(
                1,
                1,
                'Why am I not being paid?', [
                { choice_text: 'They hate us cuz they ain\'t us', is_correct_choice: false },
                { choice_text: 'Just cuz', is_correct_choice: true }
            ]
            )).rejects.toThrow()
        })
    })
    describe("getPollMetrics", () => {
        it('should return response', async () => {
            const expected = [
                { poll_choice_id: 1, user_id: 1, is_correct_choice: true },
                { poll_choice_id: 2, user_id: 2, is_correct_choice: false },
                { poll_choice_id: 1, user_id: 3, is_correct_choice: true },
            ]
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce(expected);
            const res = await getPollMetrics(1);
            expect(res).toEqual(expected)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(getPollMetrics(-1)).rejects.toThrow()
        })
    })

    describe("closePoll", () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce();
            const res = await closePoll(1);
            expect(res).toBe(undefined)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(closePoll(-1)).rejects.toThrow()
        })
    })
})