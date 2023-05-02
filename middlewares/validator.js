const redisClient = require("../helpers/redis");

const validator = async (req, res, next) => {
  try {
    const ip = req.params.ip || req.body.preferred_ip;
    console.log("from Validator", ip);
    let regex =
      /\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}\b /;
    if (regex.test(ip)) {
      next();
    } else {
      res.send({ msg: "Invlaid IP Address" });
    }
  } catch (err) {
    res.send(err.message);
  }
};
module.exports = { validator };
