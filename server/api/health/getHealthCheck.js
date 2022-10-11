const getHealthCheck = async (_req, res) => {
   return res.status(200).send({message: 'OK'});
}

module.exports = { getHealthCheck }