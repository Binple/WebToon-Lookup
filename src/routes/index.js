import express from "express";

const router = express.Router();

/* GET Main Page. */
router.get('/', function (req, res, next) {
	res.send('WebToon Lookup API');
});

module.exports = router;
