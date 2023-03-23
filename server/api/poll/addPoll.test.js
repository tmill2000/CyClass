const { addPoll } = require("./addPoll");
const pollService = require("./services/pollService");
const { getMockReq, getMockRes } = require("@jest-mock/express");
const { studentSession, professorSession } = require("../../test/mock/mockStudentUserSession");

const { res, mockClear } = getMockRes();

describe("addPoll", () => {
    beforeEach(() => {
        mockClear(); // can also use clearMockRes()
        jest.clearAllMocks();
    });
    it("should return 400 for invalid body", async () => {
        const req = getMockReq({
            body: {
                lecture_id: 1,
                question_text: "foo",
                poll_choices: [
                    { is_correct_choice: true, choice_text: "bar" },
                    { is_correct_choice: false, choice_text: "buzz" }
                ]
            }
        });
        req.session = professorSession;
        await addPoll(req, res);
        expect(res.status).toBeCalledWith(400);
    });

    it("should return 401 for Unauthorized", async () => {
        const req = getMockReq({
            body: {
                lecture_id: 1,
                question_text: "foo",
                poll_type: "MULTIPLE_CHOICE",
                poll_choices: [
                    { is_correct_choice: true, choice_text: "bar" },
                    { is_correct_choice: false, choice_text: "buzz" }
                ],
                course_id: 1
            }
        });
        req.session = studentSession;
        await addPoll(req, res);
        expect(res.status).toBeCalledWith(401);
    });
    it("should return 201 for success", async () => {
        const req = getMockReq({
            body: {
                lecture_id: 1,
                question_text: "foo",
                poll_type: "MULTIPLE_CHOICE",
                poll_choices: [
                    { is_correct_choice: true, choice_text: "bar" },
                    { is_correct_choice: false, choice_text: "buzz" }
                ],
                course_id: 1
            }
        });
        req.session = professorSession;
        const spy = jest.spyOn(pollService, "addPoll").mockResolvedValueOnce({ pollId: 1, pollChoiceIds: [1, 2] });
        await addPoll(req, res);
        expect(res.status).toBeCalledWith(201);
        expect(spy).toBeCalledTimes(1);
    });
    it("should return 500 for Server Error", async () => {
        const req = getMockReq({
            body: {
                lecture_id: 1,
                question_text: "foo",
                poll_type: "MULTIPLE_CHOICE",
                poll_choices: [
                    { is_correct_choice: true, choice_text: "bar" },
                    { is_correct_choice: false, choice_text: "buzz" }
                ],
                course_id: 1
            }
        });
        req.session = professorSession;
        const spy = jest.spyOn(pollService, "addPoll").mockRejectedValueOnce(new Error());
        await addPoll(req, res);
        expect(res.status).toBeCalledWith(500);
        expect(spy).toBeCalledTimes(1);
    });
});
