const roleService = require("../role/services/roleService");
const userService = require("./services/userService");
const { writeLog } = require("../../utils/logger");
const { isInCourse } = require("../../utils/permissions");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const getUserInfoByUserId = async (req, res) => {
    try {
        const userId = req?.query?.id;
        if (!userId) {
            return res.status(400).send({ msg: "Invalid Parameters" });
        }
        const rows = await userService.getUserInfoByUserId(userId);
        if (!rows?.length) {
            return res.status(200).send({ msg: "No user found" });
        }
        const userData = rows[0];

        const resp = {
            userId: userData.user_id,
            email: `${userData.netid}@iastate.edu`,
            first_name: userData.first_name,
            last_name: userData.last_name
        };
        return res.status(200).send(resp);
    } catch (e) {
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const login = async (req, res) => {
    try {
        const { netId, password } = req.body;
        if (!netId || !password) {
            return res.status(400).send({ msg: "Invalid Body" });
        }
        const rows = await userService.loginInfo(netId);
        if (!rows) {
            return res.status(401).send({ msg: "Incorrect Username or Password" });
        }
        const match = await bcrypt.compare(password, rows[0].password);
        if (netId == rows[0]?.netid && match) {
            req.session.userid = rows[0].user_id;
            req.session.netId = netId;
            req.session.sessionId = crypto.randomBytes(16).toString("base64");
            const roles = await roleService.getCourseRolesByUser(req.session.userid);
            req.session.user_roles = roles;
            res.status(200).send({ userId: rows[0].user_id, sessionId: req.session.sessionId, userRoles: roles });
        } else {
            res.status(401).send({ msg: "Incorrect Username or Password" });
        }
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const logout = async (req, res) => {
    req.session.destroy();
    return res.status(200).send({ msg: "Logged Out" });
};

/**
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<Express.Response>}
 */
const getCoursesByUser = async (req, res) => {
    try {
        const roles = await roleService.getCourseRolesByUser(req.session.userid);
        const courses = new Set(roles.map(role => ({ course_name: role.course_name, course_id: role.course_id })));
        return res.status(200).send(courses);
    } catch (e) {
        writeLog("error", e.message);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

/**
*
* @param {Express.Request} req
* @param {Express.Response} res
* @returns {Promise<Express.Response>}
*/
const getRoleByUserCourse = async (req, res) => {
   try {
       const { user_id: userId, course_id: courseId } = req.query;
       if (!userId || !courseId) {
           return res.status(400).send({ msg: "Missing Parameters" });
       }
       if (!isInCourse(courseId, req.session)) {
           return res.status(401).send({ msg: "Must be associated with course to retrieve other user role info in that course." });
       }
       const roles = await roleService.getCourseRolesByUser(userId);
       const courseRole = roles.find(role => role.course_id == courseId);
       if (courseRole != null) {
            return res.status(200).send({
                role_id: courseRole.role_id
            });
       }
       return res.status(404).send({ msg: "User does not exist or is not in the given course." });
   } catch (e) {
       writeLog("error", e.message);
       return res.status(500).send({ msg: "Internal Server Error" });
   }
};

module.exports = { getUserInfoByUserId, login, logout, getCoursesByUser, getRoleByUserCourse };
