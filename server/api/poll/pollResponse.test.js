const { addPollResponse } = require("./pollResponse");
const pollResponseService = require("./services//pollResponseService");
const { getMockReq, getMockRes } = require("@jest-mock/express");
const { studentSession, noAssociationSession } = require("../../test/mock/mockStudentUserSession");

const { res, mockClear } = getMockRes();

describe("addPoll", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
        jest.clearAllMocks();
    });
    it("should return 400 for invalid body", async () => {
        const req = getMockReq({
            body: {
                choice_id: 1,
                poll_id: 1
            }
        });
        req.session = studentSession;
        await addPollResponse(req, res);
        expect(res.status).toBeCalledWith(400);
    });

    it("should return 401 for Unauthorized", async () => {
        const req = getMockReq({
            body: {
                choice_id: 1,
                poll_id: 1,
                course_id: 1
            }
        });
        req.session = noAssociationSession;
        await addPollResponse(req, res);
        expect(res.status).toBeCalledWith(401);
    });
    it("should return 201 for success", async () => {
        const req = getMockReq({
            body: {
                choice_id: 1,
                poll_id: 1,
                course_id: 1
            }
        });
        req.session = studentSession;
        const spy = jest.spyOn(pollResponseService, "addPollResponse").mockResolvedValueOnce(2);
        await addPollResponse(req, res);
        expect(res.status).toBeCalledWith(201);
        expect(spy).toBeCalledTimes(1);
    });
    it("should return 500 for Server Error", async () => {
        const req = getMockReq({
            body: {
                choice_id: 1,
                poll_id: 1,
                course_id: 1
            }
        });
        req.session = studentSession;
        const spy = jest.spyOn(pollResponseService, "addPollResponse").mockRejectedValueOnce(new Error());
        await addPollResponse(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    });
});
