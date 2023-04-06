const { getCourse } = require(".//getCourse");
const courseService = require("./services/courseService");
const { getMockReq, getMockRes } = require("@jest-mock/express");
const { studentSession } = require("../../test/mock/mockStudentUserSession");

const { res, mockClear } = getMockRes();

describe("getCourse", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
        jest.clearAllMocks();
    });
    it("should return 400 for invalid body", async () => {
        const req = getMockReq({ query: {} });
        await getCourse(req, res);
        expect(res.status).toBeCalledWith(400);
    });
    it("should return 200 for success", async () => {
        const req = getMockReq({ query: { course_id: 1 } });
        const spy = jest.spyOn(courseService, "getCourse").mockResolvedValueOnce([
            {
                course_id: 1,
                owner_id: 1,
                course_name: "course",
                closed: 1,
                join_code: "join_code"
            }
        ]);
        req.session = studentSession;
        await getCourse(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(spy).toBeCalledTimes(1);
    });
    it("should return 500 for Server Error", async () => {
        const req = getMockReq({ query: { course_id: 1 } });
        const spy = jest.spyOn(courseService, "getCourse").mockRejectedValueOnce(new Error());
        req.session = studentSession;
        await getCourse(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    });
});
