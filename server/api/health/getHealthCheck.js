const { writeLog } = require("../../utils/logger");

const getHealthCheck = async (_req, res) => {
    writeLog("general", "in health");
    return res.status(200).send({ status: "UP" });
};

module.exports = { getHealthCheck };
