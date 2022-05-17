const express = require("express");
const router = express.Router();
const urlController = require("../controller/urlController")

<<<<<<< HEAD
router.post("/url/shorten", urlController.createUrl);



module.exports = router;
=======
router.post("/url/shortener",urlController.createUrl)

// if api is invalid OR wrong URL
router.all("/*", function (req, res) {
    res
      .status(404)
      .send({ status: false, msg: "The api you requested is not available" });
  });
  
  module.exports = router;
  
>>>>>>> 6d9b2d2797d61c9c84e9b27c5c576dbc441c3e28
