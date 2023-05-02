
const redisClient = require("../helpers/redis");
const axios = require("axios");
const userIpList = require("../models/ip.model");


const getIpAddress = async (req, res) => {
  try {
    const ip = req.params.ip || req.body.preferred_ip;    
    const isIpInCache = await redisClient.get(`${ip}`);
    console.log("From Redis",isIpInCache);
    if (isIpInCache) return res.status(200).send({ dataFromRedis: isIpInCache });

    const response = await axios.get(
      `https://ipapi.co/${ip}/json/`
    );

    const ipAddress = response.data;
    console.log("From api",ipAddress);

    redisClient.set(ip, JSON.stringify(ipAddress), { EX: 6 * 30 * 60 });

    await userIpList.findOneAndUpdate(
      { userId: req.body.userId },
      {
        userId: req.body.userId,
        $push: { previousSearches: ip },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).send({ dataFromAPI: ipAddress });
  } catch (err) {
    return res.status(500).send(err.messsage);
  }
};


module.exports = { getIpAddress };
