const express = require("express");

const router = express.Router();

router.use(require("./employee"));

router.use(require("./leave"));

module.exports = router;
