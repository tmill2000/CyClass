const { getMessagesAndPollsByLectureId } = require("./getMessagesAndPollsByLectureId");
const messageService = require("./services/messageService");
const { getMockReq, getMockRes } = require("@jest-mock/express");

const { res, mockClear } = getMockRes();

describe("getMessage", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
        jest.clearAllMocks();
    });
    it("should return 400 for invalid params", async () => {
        const req = getMockReq({ query: {} });
        await getMessagesAndPollsByLectureId(req, res);
        expect(res.status).toBeCalledWith(400);
    });
    it("should return 200 for success", async () => {
        const req = getMockReq({ query: { lecture_id: 1 } });
        const spy = jest.spyOn(messageService, "getMessagesAndPollsByLectureId").mockResolvedValueOnce();
        await getMessagesAndPollsByLectureId(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(spy).toBeCalledTimes(1);
    });
    it("should return 500 for Server Error", async () => {
        const req = getMockReq({ query: { lecture_id: 1 } });
        const spy = jest.spyOn(messageService, "getMessagesAndPollsByLectureId").mockRejectedValueOnce(new Error());
        await getMessagesAndPollsByLectureId(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    });
});
