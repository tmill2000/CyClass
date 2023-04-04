const { addRole, addRoleByJoinCode } = require("./addRole");
const courseService = require("../course/services/courseService");
const roleService = require("./services/roleService");
const { getMockReq, getMockRes } = require("@jest-mock/express");
const { studentSession, professorSession } = require("../../test/mock/mockStudentUserSession");

const { res, mockClear } = getMockRes();

describe("addRole", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
    });
    describe("addRole", () => {
        it("should return 400 for invalid body", async () => {
            const req = getMockReq({ body: { course_id: 1 } });
            await addRole(req, res);
            expect(res.status).toBeCalledWith(400);
        });
        it("should return 401 for invalid body", async () => {
            const req = getMockReq({ body: { course_id: 1, user_id: 1, role: "PROFESSOR" } });
            req.session = studentSession;
            await addRole(req, res);
            expect(res.status).toBeCalledWith(401);
        });
        it("should return 201 for success", async () => {
            const req = getMockReq({ body: { course_id: 1, user_id: 1, role: "PROFESSOR" } });
            req.session = professorSession;
            jest.spyOn(roleService, "addRole").mockResolvedValueOnce(1);
            jest.spyOn(courseService, "getCourse").mockResolvedValueOnce([{ course_name: "test" }]);
            await addRole(req, res);
            expect(res.status).toBeCalledWith(201);
        });
        it("should return 500 for for Server error", async () => {
            const req = getMockReq({ body: { course_id: 1, user_id: 1, role: "PROFESSOR" } });
            req.session = professorSession;
            jest.spyOn(roleService, "addRole").mockRejectedValueOnce(new Error());
            await addRole(req, res);
            expect(res.status).toBeCalledWith(500);
        });
    });

    describe("addRoleByJoinCode", () => {
        it("should return 400 for invalid body", async () => {
            const req = getMockReq({ params: {} });
            await addRoleByJoinCode(req, res);
            expect(res.status).toBeCalledWith(400);
        });
        it("should return 404 for course not found", async () => {
            const req = getMockReq({ query: { join_code: "asiugfkajuhsfkjhsa" } });
            req.session = studentSession;
            jest.spyOn(courseService, "getCourseByJoinCode").mockResolvedValueOnce({ closed: true });
            await addRoleByJoinCode(req, res);
            expect(res.status).toBeCalledWith(404);
        });
        it("should return 201 for success", async () => {
            const req = getMockReq({ query: { join_code: "asiugfkajuhsfkjhsa" } });
            req.session = studentSession;
            jest.spyOn(courseService, "getCourseByJoinCode").mockResolvedValueOnce({ closed: false, course_id: 2 });
            jest.spyOn(roleService, "addRole").mockResolvedValueOnce({ insertId: 1 });
            await addRoleByJoinCode(req, res);
            expect(res.status).toBeCalledWith(201);
        });
        it("should return 500 for for Server error", async () => {
            const req = getMockReq({ query: { join_code: "asiugfkajuhsfkjhsa" } });
            req.session = studentSession;
            jest.spyOn(courseService, "getCourseByJoinCode").mockRejectedValueOnce(new Error());
            await addRoleByJoinCode(req, res);
            expect(res.status).toBeCalledWith(500);
        });
    });
});
