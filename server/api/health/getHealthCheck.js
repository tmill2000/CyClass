const getHealthCheck = async (_req, res) => {
   console.log("in health");
   return res.status(200).send({ status: 'UP' });
}

module.exports = { getHealthCheck }