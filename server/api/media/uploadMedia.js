/**
 * @param {*} req 
 * req.body = {
 *    course_id: int,
 *    session_id: int
 * }
 * @param {*} res 
 * @returns guid of uploaded media
 */
const uploadMedia = async (req, res) => {
    console.log("img", req.body);
    return res.status(200).send({ guid: 'guid goes here' });
}

module.exports = {
    uploadMedia,
}