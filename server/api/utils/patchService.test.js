const { genericPatch } = require("./patchService");
const db = require("../../utils/db_connection");

jest.mock("../../utils/db_connection");

describe("patchService", () => {

    describe("genericPatch", () => {

        it("should return response", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([]);
            // const res = await genericPatch(tableName, newValsObj, whereClauseCol, whereClauseVal);
            const res = await genericPatch(messages, messages.body, body, 'new body');
            expect(res).toEqual([
                {
                    body: "new body"
                }
            ]);
        });

        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce(new Error());
            await expect(genericPatch(null, null, null, null)).rejects.toThrow();
        });
    })
});