
const { addMessage, addMediaMetadata, getMessage, getMessagesAndPollsByLectureId } = require('./messageService')
const db = require ('../../../utils/db_connection');

jest.mock('../../../utils/db_connection')


describe("messageService", () => {
    describe("addMessage",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce({ insertId: 1});
            const res = await addMessage(1, 'body', false, 1, null);
            expect(res).toEqual(1)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(addMessage(-1, 'body', false, 1, null)).rejects.toThrow()
        })
    })

    describe("addMediaMetadata",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce({ insertId: 1});
            const res = await addMediaMetadata(1, 1, 1, 1);
            expect(res).toEqual(1)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(addMediaMetadata(1, 1, 1, 1)).rejects.toThrow()
        })
    })

    describe("getMessage",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce(
                [{message_id: 1, parent_id: null, sender_id: 1, lecture_id: 1, timestamp: '2022-11-13 17:41:28', body: 'body'}]);
            const res = await getMessage(1);
            expect(res).toEqual([{message_id: 1, parent_id: null, sender_id: 1, lecture_id: 1, timestamp: '2022-11-13 17:41:28', body: 'body'}])
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(getMessage(-1)).rejects.toThrow()
        })
    })

    describe("getMessagesAndPollsByLectureId",  () => {
        it('should return response', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce(
                [
                    {
                        message_id: 1,
                        parent_id: null,
                        sender_id: 1,
                        lecture_id: 1,
                        timestamp: '2022-11-13 17:41:28',
                        body: 'body'
                    }
                ]
            ).mockResolvedValueOnce(
                [{
                    poll_id: 1,
                    timestamp: '2022-11-13 17:41:29',
                    question: 'Who is Him?',
                    close_date: null,
                    closed: 0,
                    choices: [
                        {
                            poll_choice_id: 2,
                            choice_text: 'Me',
                            is_correct_choice: 1
                        }
                    ]
                }]
            );
            const res = await getMessagesAndPollsByLectureId(1, null);
            expect(res.length).toBe(2)
        })
        it('should return response with by timestamp', async () => {
            jest.spyOn(db, 'runQuery').mockResolvedValueOnce(
                [
                    {
                        message_id: 1,
                        parent_id: null,
                        sender_id: 1,
                        lecture_id: 1,
                        timestamp: '2022-11-13 17:41:28',
                        body: 'body'
                    }
                ]
            ).mockResolvedValueOnce(
                [{
                    poll_id: 1,
                    timestamp: '2022-11-13 17:41:29',
                    question: 'Who is Him?',
                    close_date: '2022-11-13 17:41:30',
                    closed: 0,
                    choices: [
                        {
                            poll_choice_id: 2,
                            choice_text: 'Me',
                            is_correct_choice: 1
                        }
                    ]
                }]
            );
            const res = await getMessagesAndPollsByLectureId(1, '2022-11-13 17:41:28');
            expect(res.length).toBe(2)
        })
        it('should throw error', async () => {
            jest.spyOn(db, 'runQuery').mockRejectedValueOnce(new Error());
            await expect(getMessagesAndPollsByLectureId(-1, null)).rejects.toThrow()
        })
    })
})