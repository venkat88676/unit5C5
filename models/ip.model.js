

const mongoose = require("mongoose");

const userIp = mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"user", required: true},
    previousSearches: [{type:String, required:true}]
})

const userIpList = mongoose.model("ipAddress", userIp)

module.exports = userIpList;