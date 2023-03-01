const mediaService = require("./mediaService");
const db = require("../../../utils/db_connection");

jest.mock("../../../utils/db_connection");

describe("mediaService", () => {
    describe("authUpload", () => {
        it("should return", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([{ course_id: 1, user_id: 1 }]);
            expect(await mediaService.authUpload(1)).toEqual([{ course_id: 1, user_id: 1 }]);
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValue(new Error());
            await expect(mediaService.authUpload(1)).rejects.toThrow();
        });
    });

    describe("updateMediaMetadataOnReceived", () => {
        it("should return", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([]);
            expect(await mediaService.updateMediaMetadataOnReceived(1, "png")).toEqual([]);
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValue(new Error());
            await expect(mediaService.updateMediaMetadataOnReceived(1, "xmla")).rejects.toThrow();
        });
    });

    describe("metadataForDownload", () => {
        it("should return", async () => {
            jest.spyOn(db, "runQuery").mockResolvedValueOnce([
                { recieved: true, file_type: "png", user_in_course: true }
            ]);
            expect(await mediaService.metadataForDownload(1, 2)).toEqual([
                { recieved: true, file_type: "png", user_in_course: true }
            ]);
        });
        it("should throw error", async () => {
            jest.spyOn(db, "runQuery").mockRejectedValue(new Error());
            await expect(mediaService.metadataForDownload(1, -3)).rejects.toThrow();
        });
    });
});
