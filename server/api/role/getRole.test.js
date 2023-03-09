const { getRole } = require("./getRole");
const roleService = require("./services/roleService");
const { getMockReq, getMockRes } = require("@jest-mock/express");

const { res, mockClear } = getMockRes();

describe("addLecture", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
    });

    it("should return 400 for invalid body", async () => {
        const req = getMockReq({ query: {} });
        await getRole(req, res);
        expect(res.status).toBeCalledWith(400);
    });
    it("should return 200 for success", async () => {
        const req = getMockReq({ query: { role_id: 1 } });
        jest.spyOn(roleService, "getRole").mockResolvedValueOnce([
            {
                role_id: 1,
                course_id: 1,
                user_id: 1,
                role: "PROFESSOR"
            }
        ]);
        await getRole(req, res);
        expect(res.status).toBeCalledWith(200);
    });
    it("should return 500 for for Server error", async () => {
        const req = getMockReq({ query: { role_id: 1 } });
        jest.spyOn(roleService, "getRole").mockRejectedValueOnce(new Error());
        await getRole(req, res);
        expect(res.status).toBeCalledWith(500);
    });
});
