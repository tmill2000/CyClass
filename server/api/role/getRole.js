const roleService = require('./services/roleService');


/**
 * Function to get a course
 * @param {*} req 
 *  req.query = {
 *    role_id: int
 *    session_id: string
 *  }
 * @param {*} res 
 * @returns role data if successful, otherwise a 500 or 400 error
 */
const getRole = async (req, res) => {
    try {
        const {  role_id: roleId } = req.query;
        if (!roleId) {
            return res.status(400).send({ msg: "No role_id Provided" })
        }
        const resp = await roleService.getRole(roleId)
        return res.status(200).send({ 
            role_id: resp[0].role_id,
            course_id: resp[0].course_id,
            user_id: resp[0].user_id,
            role: resp[0].role,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).send({ msg: 'Internal Server Error' });
    }
}

module.exports = {
    getRole,
}