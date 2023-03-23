const { editUser } = require("./editUser");
const db = require("../utils/patchService");

const { getMockReq, getMockRes } = require("@jest-mock/express");
const { res, mockClear } = getMockRes();

jest.mock("../utils/patchService");

describe("editUser", () => {

    beforeEach(() => {
        mockClear()
        jest.clearAllMocks()
    })

    it("should return 200 for Success", async () => {
        const req = getMockReq({ query: { user_id: 1 } });
        const spy = jest.spyOn(db, "genericPatch").mockResolvedValueOnce();
        await editUser(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(spy).toBeCalledTimes(1);
    });

    it("should return 500 for for Server error", async () => {
        const req = getMockReq({ query: { user_id: 1 } });
        jest.spyOn(db, "genericPatch").mockRejectedValueOnce(new Error());
        await editUser(req, res);
        expect(res.status).toBeCalledWith(500);
    });
});