const { editMessage } = require("./editMessage");
const db = require("../utils/patchService");

const { getMockReq, getMockRes } = require("@jest-mock/express");
const { res, mockClear } = getMockRes();

jest.mock("../utils/patchService");

describe("editMessage", () => {
    beforeEach(() => {
        mockClear();
        jest.clearAllMocks();
    });

    it("should return 200 for Success", async () => {
        const req = getMockReq({ query: { message_id: 1 } });
        const spy = jest.spyOn(db, "genericPatch").mockResolvedValueOnce();
        await editMessage(req, res);
        expect(res.status).toBeCalledWith(200);
        expect(spy).toBeCalledTimes(1);
    });

    it("should return 500 for for Server error", async () => {
        const req = getMockReq({ query: { message_id: 1 } });
        jest.spyOn(db, "genericPatch").mockRejectedValueOnce(new Error());
        await editMessage(req, res);
        expect(res.status).toBeCalledWith(500);
    });
});
