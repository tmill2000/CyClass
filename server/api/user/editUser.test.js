const { editUser } = require("./editUser");
const db = require("../utils/patchService");

jest.mock("../utils/patchService");

describe("editUser", () => {
    it("should log hello world", async () => {
        console.log("hello world")
    });
});