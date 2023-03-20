const { editMessage } = require("./editMessage");
const db = require("../utils/patchService");

jest.mock("../utils/patchService");

describe("editMessage", () => {
    it("should log hello world", async () => {
        console.log("hello world")
    });
});