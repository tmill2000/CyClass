const getHealthCheck = async (_req, res) => {
   return res.status(200).send({ status: 'UP' , test: 1});
}

module.exports = { getHealthCheck }