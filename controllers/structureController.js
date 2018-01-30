const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', (req, res) => {
	// FIXME: To fetch excos by location
	// req.app.locals.layout = 'layout';
	// fetch(process.env.ADDR+'/exco/')
	// .then((res) => {
	// 	return res.json();
	// }).then((json) => {
   //
	// })
	res.render('structure', {title: "Party Excos", header: req.headers.authorization});
});

module.exports = router;
