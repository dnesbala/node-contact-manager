const fs = require("fs");

exports.requestLogger = () => {
  return (req, res, next) => {
    const data = `${new Date(Date.now()).toLocaleString()}: ${req.method} ${
      req.path
    }\n`;
    fs.appendFile("./request-log.txt", data, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Something Went Wrong",
        });
      }
      next();
    });
  };
};
