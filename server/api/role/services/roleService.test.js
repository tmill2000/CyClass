const { addRole, getRole, getCourseRolesByUser } = require("./roleService");
const db = require("../../../utils/db_connection");

jest.mock("../../../utils/db_connection");

describe("roleService", () => {
    describe("getRole", () => {
        it("should return response", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([
                { role_id: 1, course_id: 1, user_id: 1, role: "PROFESSOR" }
            ]);
            const res = await getRole(1);
            expect(res).toEqual([{ role_id: 1, course_id: 1, user_id: 1, role: "PROFESSOR" }]);
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce(new Error());
            await expect(getRole(-1)).rejects.toThrow();
        });
    });

    describe("getCourseRolesByUser", () => {
        it("should return response", async () => {
            jest.spyOn(db, "runQuery")
                .mockResolvedValueOnce([{ role_id: 1, course_id: 1, user_id: 1, role: "PROFESSOR" }])
                .mockResolvedValueOnce([{ course_name: "name" }]);
            const res = await getCourseRolesByUser(1);
            expect(res).toEqual([{ role_id: 1, course_id: 1, role: "PROFESSOR", course_name: "name" }]);
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce(new Error());
            await expect(getCourseRolesByUser(-1)).rejects.toThrow();
        });
    });

    describe("addRole", () => {
        it("should return response", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce({ insertId: 1 });
            const res = await addRole(1, 1, "PROFESSOR");
            expect(res).toBe(1);
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValueOnce(new Error());
            await expect(addRole(-1)).rejects.toThrow();
        });
    });
});
