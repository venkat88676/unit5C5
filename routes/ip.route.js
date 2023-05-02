
const {Router } = require("express");

const {validator}=require("../middlewares/validator")
const { authenticator } = require("../middlewares/auth");

const { getIpAddress, mostSearchedCity } = require("../controllers/ip.controller");


const ipRouter = Router();

ipRouter.get("/getipaddress/:ip",validator,authenticator,getIpAddress);

module.exports = ipRouter;