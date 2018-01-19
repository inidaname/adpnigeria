const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const mongojs = require('mongojs');

var Nigeria = mongojs(process.env.DB_URL, ['PollingUnits', 'Senates', 'FederalConstituency']);

router.use(bodyParser.urlencoded({ extended: true }));

// rendering the home page
router.get('/', (req, res) => {
	req.app.locals.layout = 'layout';
	res.status(200).render('index', {
		title: "Home Page"
	});
});


module.exports = router;
