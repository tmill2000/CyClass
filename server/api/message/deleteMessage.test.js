const { deleteMessage } = require("./deleteMessage");
const messageService = require("./services/messageService");
const { getMockReq, getMockRes } = require("@jest-mock/express");
const { noAssociationSession, professorSession, studentSession } = require("../../test/mock/mockStudentUserSession");

const { res, mockClear } = getMockRes();

describe("getMessage", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
        jest.clearAllMocks();
    });
    it("should return 400 for invalid params", async () => {
        const req = getMockReq({ query: {} });
        await deleteMessage(req, res);
        expect(res.status).toBeCalledWith(400);
    });
    it("should return 401 if not users own message", async () => {
        const req = getMockReq({ query: { message_id: 1, course_id: 1 } });
        req.session = noAssociationSession;
        jest.spyOn(messageService, "getMessage").mockResolvedValueOnce([{ sender_id: 69 }]);
        await deleteMessage(req, res);
        expect(res.status).toBeCalledWith(401);
    });

    it("should return 204 for success if course owner but not sender", async () => {
        const req = getMockReq({ query: { message_id: 1, course_id: 1 } });
        req.session = professorSession;
        jest.spyOn(messageService, "getMessage").mockResolvedValueOnce([{ sender_id: 69 }]);
        jest.spyOn(messageService, "deleteMessage").mockResolvedValueOnce();
        await deleteMessage(req, res);
        expect(res.status).toBeCalledWith(204);
    });

    it("should return 204 for success if sender", async () => {
        const req = getMockReq({ query: { message_id: 1, course_id: 1 } });
        req.session = studentSession;
        jest.spyOn(messageService, "getMessage").mockResolvedValueOnce([{ sender_id: 1 }]);
        jest.spyOn(messageService, "deleteMessage").mockResolvedValueOnce();
        await deleteMessage(req, res);
        expect(res.status).toBeCalledWith(204);
    });
    it("should return 500 for Server Error", async () => {
        const req = getMockReq({ query: { message_id: 1, course_id: 1 } });
        const spy = jest.spyOn(messageService, "getMessage").mockRejectedValueOnce(new Error());
        await deleteMessage(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    });
});
