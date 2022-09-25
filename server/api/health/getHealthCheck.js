const getHealthCheck = async (req, res) => {
   return res.status(200).send({message: 'OK'});
}

module.exports = { getHealthCheck }