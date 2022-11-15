const getHealthCheck = async (_req, res) => {
   return res.status(200).send({ status: 'UP' });
}

module.exports = { getHealthCheck }