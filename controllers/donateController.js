const express = require('express');
const router = express.Router();
const session = require('express-session');
const request = require('request');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
  res.render('donate')
});

router.post('/paid', (req, res) => {
	body = req.body
	request.post(
		 process.env.ADDR+'/donate',
		 { json: body},
		 function (error, response, body) {
			  if (!error) {
				  res.status(200).send({message: "created"});
			  } else {
				  res.status(400).send({message: "Sorry we couldn't submit your pay"});
			  }
		 });
});

module.exports = router;
