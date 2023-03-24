const { genericPatch } = require("./patchService");
const db = require("../../utils/db_connection");

jest.mock("../../utils/db_connection");

describe("patchService", () => {

    describe("genericPatch", () => {

        it("should return response", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([
                {
                    message_id: 1,
                    parent_id: null,
                    sender_id: 1,
                    lecture_id: 1,
                    timestamp: "2023-3-28 17:41:28",
                    body: "body"
                }
            ]);
            const res = await genericPatch(null, null, null, 'new body');
            expect(res).toEqual([
                {
                    message_id: 1,
                    parent_id: null,
                    sender_id: 1,
                    lecture_id: 1,
                    timestamp: "2023-3-28 17:41:28",
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