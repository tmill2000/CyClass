const { closeCourse } = require("./closeCourse");
const courseService = require("./services/courseService");
const { getMockReq, getMockRes } = require("@jest-mock/express");
const { studentSession, professorSession } = require("../../test/mock/mockStudentUserSession");

const { res, mockClear } = getMockRes();

describe("closePoll", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
        jest.clearAllMocks();
    });
    it("should return 400 for invalid body", async () => {
        const req = getMockReq({ query: {} });
        await closeCourse(req, res);
        expect(res.status).toBeCalledWith(400);
    });

    it("should return 401 for Unauthorized", async () => {
        const req = getMockReq({ query: { course_id: 1 } });
        req.session = studentSession;
        await closeCourse(req, res);
        expect(res.status).toBeCalledWith(401);
    });
    it("should return 201 for success", async () => {
        const req = getMockReq({ query: { course_id: 1 } });
        req.session = professorSession;
        const spy = jest.spyOn(courseService, "closeCourse").mockResolvedValueOnce();
        await closeCourse(req, res);
        expect(res.status).toBeCalledWith(204);
        expect(spy).toBeCalledTimes(1);
    });
    it("should return 500 for Server Error", async () => {
        const req = getMockReq({ query: {course_id: 1 } });
        req.session = professorSession;
        const spy = jest.spyOn(courseService, "closeCourse").mockRejectedValueOnce(new Error());
        await closeCourse(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    });
});
