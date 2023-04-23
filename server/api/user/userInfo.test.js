const { getUserInfoByUserId, login, logout, getRoleByUserCourse } = require("./userInfo");
const userService = require("./services/userService");
const roleService = require("../role/services/roleService");
const { getMockReq, getMockRes } = require("@jest-mock/express");
const crypto = require("crypto");
// const bcrypt = require("bcrypt");
const { res, mockClear } = getMockRes();
const { studentSession, noAssociationSession } = require("../../test/mock/mockStudentUserSession");

describe("userInfo", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
    });

    describe("getUserInfoByUserId", () => {
        it("should return 400 for invalid body", async () => {
            const req = getMockReq({ query: {} });
            await getUserInfoByUserId(req, res);
            expect(res.status).toBeCalledWith(400);
        });
        it("should return 200 for success", async () => {
            const req = getMockReq({ query: { id: 1 } });
            jest.spyOn(userService, "getUserInfoByUserId").mockResolvedValueOnce([
                {
                    user_id: 1,
                    netid: "twmiller",
                    first_name: "Tyler",
                    last_name: "Miller"
                }
            ]);
            await getUserInfoByUserId(req, res);
            expect(res.status).toBeCalledWith(200);
            expect(res.send).toBeCalledWith({
                userId: 1,
                email: "twmiller@iastate.edu",
                first_name: "Tyler",
                last_name: "Miller"
            });
        });
        it("should return 500 for for Server error", async () => {
            const req = getMockReq({ query: { id: 1 } });
            jest.spyOn(userService, "getUserInfoByUserId").mockRejectedValueOnce(new Error());
            await getUserInfoByUserId(req, res);
            expect(res.status).toBeCalledWith(500);
        });
    });

    describe("login", () => {
        it("should return 400 for invalid body", async () => {
            const req = getMockReq({ body: { netId: "netid" } });
            await login(req, res);
            expect(res.status).toBeCalledWith(400);
        });

        it("should return 401 for incorrect creds", async () => {
            const req = getMockReq({ body: { netId: "netid", password: "password" } });
            jest.spyOn(userService, "loginInfo").mockResolvedValueOnce();
            await login(req, res);
            expect(res.status).toBeCalledWith(401);
        });
        // it("should return 200 for success", async () => {
        //     const req = getMockReq({ body: { netId: "netid", password: "password" } });
        //     jest.spyOn(userService, "loginInfo").mockResolvedValueOnce([
        //         { netid: "netid", password: "password", user_id: 1 }
        //     ]);
        //     jest.spyOn(roleService, "getCourseRolesByUser").mockResolvedValueOnce([
        //         {
        //             course_id: 1,
        //             role: "STUDENT",
        //             role_id: 2,
        //             course_name: "CPRE 492"
        //         }
        //     ]);
        //     jest.spyOn(crypto, "randomBytes").mockReturnValueOnce("session");
        //     jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true);
        //     req.session = {};
        //     await login(req, res);
        //     expect(res.status).toBeCalledWith(200);
        //     expect(req.session).toEqual({
        //         userid: 1,
        //         netId: "netid",
        //         sessionId: "session",
        //         user_roles: [
        //             {
        //                 course_id: 1,
        //                 role: "STUDENT",
        //                 role_id: 2,
        //                 course_name: "CPRE 492"
        //             }
        //         ]
        //     });
        // });
        it("should return 500 for for Server error", async () => {
            const req = getMockReq({ body: { netId: "netid", password: "pw" } });
            jest.spyOn(userService, "loginInfo").mockRejectedValueOnce(new Error());
            await login(req, res);
            expect(res.status).toBeCalledWith(500);
        });
    });

    describe("logout", () => {
        it("should return 200 for success", async () => {
            const req = getMockReq();
            req.session = {};
            req.session.destroy = () => ({});
            await logout(req, res);
            expect(res.status).toBeCalledWith(200);
        });
    });

    describe("getRoleByUserCourse", () => {
        it("should return 400 for invalid body", async () => {
            const req = getMockReq({ query: {} });
            await getRoleByUserCourse(req, res);
            expect(res.status).toBeCalledWith(400);
        });
        it("should return 401 for insufficient perms", async () => {
            const req = getMockReq({ query: { user_id: 1, course_id: 1 } });
            req.session = noAssociationSession;
            await getRoleByUserCourse(req, res);
            expect(res.status).toBeCalledWith(401);
        });
        it("should return 200 for success", async () => {
            const req = getMockReq({ query: { user_id: 1, course_id: 1 } });
            req.session = studentSession;
            jest.spyOn(roleService, "getCourseRolesByUser").mockResolvedValueOnce([
                {
                    course_id: 1,
                    role_id: 1
                }
            ]);
            await getRoleByUserCourse(req, res);
            expect(res.status).toBeCalledWith(200);
            expect(res.send).toBeCalledWith({
                role_id: 1
            });
        });
        it("should return 500 for for Server error", async () => {
            const req = getMockReq({ query: { user_id: 1, course_id: 1 } });
            jest.spyOn(roleService, "getCourseRolesByUser").mockRejectedValueOnce(new Error());
            await getRoleByUserCourse(req, res);
            expect(res.status).toBeCalledWith(500);
        });
    });
});
