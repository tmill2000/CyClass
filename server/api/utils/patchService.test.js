const { genericPatch } = require("./patchService");
const db = require("../../utils/db_connection");

jest.mock("../../utils/db_connection");

const tableKeyVal = {
    courses: [
        {
            course_id: 1
        }
    ],
    messages: [
        {
            message_title: "test",
            is_anonymous: false,
            body: "body"
        }
    ]
};

describe("patchService", () => {
    describe("genericPatch", () => {
        it("should return", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([]);
            // const res = await genericPatch(tableName, newValsObj, whereClauseCol, whereClauseVal);
            const res = await genericPatch("courses", tableKeyVal, "course_id", 2);
            expect(res).toEqual([]);
        });

        it("should return", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([]);
            const res = await genericPatch("messages", tableKeyVal, "body", "new body");
            expect(res).toEqual([]);
        });

        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce(new Error());
            await expect(genericPatch(null, null, null, null)).rejects.toThrow();
        });
    });
});
