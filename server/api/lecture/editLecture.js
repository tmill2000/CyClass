const patch = require("../utils/patchService");

const editLecture = async (req, res) => {
    try {
        const { lecture_id: lectureId } = req.body;

        await patch.genericPatch("lectures", req.body, "lecture_id", lectureId);

        return res.status(200).send({ msg: "Success" });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

module.exports = {
    editLecture
};
