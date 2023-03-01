const { addCourse } = require("./addCourse");
const courseService = require("./services/courseService");
const { getMockReq, getMockRes } = require("@jest-mock/express");
const { professorSession } = require("../../test/mock/mockStudentUserSession");

const { res, mockClear } = getMockRes();

describe("addCourse", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
        jest.clearAllMocks();
    });
    it("should return 400 for invalid body", async () => {
        const req = getMockReq({ body: {} });
        await addCourse(req, res);
        expect(res.status).toBeCalledWith(400);
    });
    it("should return 201 for success", async () => {
        const req = getMockReq({ body: { ownerID: 1, courseTitle: 1 } });
        req.session = professorSession;
        const spy = jest.spyOn(courseService, "addCourse").mockResolvedValueOnce();
        await addCourse(req, res);
        expect(res.status).toBeCalledWith(201);
        expect(spy).toBeCalledTimes(1);
    });
    it("should return 500 for Server Error", async () => {
        const req = getMockReq({ body: { ownerID: 1, courseTitle: 1 } });
        req.session = professorSession;
        const spy = jest.spyOn(courseService, "addCourse").mockRejectedValueOnce(new Error());
        await addCourse(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    });
});
