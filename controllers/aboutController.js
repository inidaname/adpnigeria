const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

var adminStaff = require('../models/aboutModel');

// rendering the home page
router.get('/', (req, res, next) => {
	req.app.locals.layout = 'layout';

		 res.status(200).render('about', {title: "About the Party" });
});

module.exports = router;
