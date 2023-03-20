const { genericPatch } = require("./patchService");
const db = require("../../utils/db_connection");

jest.mock("../../utils/db_connection");

describe("patchService", () => {

    describe("genericPatch", () => {

        it("Return with 200", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce()
            const res = await genericPatch()
            expect(res).toBe()
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce(new Error());
            await expect(genericPatch(-1, null)).rejects.toThrow();
        });
    })
});