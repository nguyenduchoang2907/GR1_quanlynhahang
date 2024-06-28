const config = require("config");

const port = config.get("app.port");

const sever = require("../apps/app").listen(port, (req , res)=> console.log("Sever running on "+port));