const { getUserInfoByUserId, loginInfo, addUser } = require("./userService");
const db = require("../../../utils/db_connection");

jest.mock("../../../utils/db_connection");

describe("roleService", () => {
    describe("getUserInfoByUserId", () => {
        it("should return response", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([
                { user_id: 1, netid: "twmiller", first_name: "Phil", last_name: "Swift", password: "hee hee" }
            ]);
            const res = await getUserInfoByUserId(1);
            expect(res).toEqual([
                { user_id: 1, netid: "twmiller", first_name: "Phil", last_name: "Swift", password: "hee hee" }
            ]);
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce(new Error());
            await expect(getUserInfoByUserId(-1)).rejects.toThrow();
        });
    });

    describe("addUser", () => {
        it("should return response", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce({ insertId: 1 });
            const res = await addUser("netid", "pw", "Phil", "Swift");
            expect(res).toBe(1);
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce(new Error());
            await expect(addUser(1, 1, 1, 1)).rejects.toThrow();
        });
    });

    describe("loginInfo", () => {
        it("should return response", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([{ netid: "netid", password: "pw" }]);
            const res = await loginInfo(1);
            expect(res).toEqual([{ netid: "netid", password: "pw" }]);
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce(new Error());
            await expect(loginInfo(-1)).rejects.toThrow();
        });
    });
});
