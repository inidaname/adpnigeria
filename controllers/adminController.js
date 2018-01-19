const express = require('express');
const router = express.Router();
const session = require('express-session');
const request = require('request');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));

var adminStaff = require('../models/adminModel');

function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (req.session.user)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/');
}


router.all('/*', isAuthenticated, (req, res, next) => {
	req.app.locals.layout = 'others/dashboard';
  next()
});

// rendering the home page
router.get('/', isAuthenticated, (req, res, next) => {
	fetch('http://192.168.8.101:8888/api/member/'+req.session.user)
	.then(function(res) {
		return res.json();
	}).then(function(json) {
		res.status(200).render('others/admin', {json, title: "Admin Section"});
	});
});

router.post('/', (req, res) => {
	  // console.log(req.body);
	  var body = {
		  phone: req.body.phone,
		  personalInfo: req.body.personalInfo,
		  level: req.body.level,
		  position: req.body.position
	  }

	  // console.log(body);
	  request.post(
	      'http://192.168.8.101:8888/api/admin/register',
	      { json: body},
	      function (error, response, body) {
	          if (!error && response.statusCode == 200) {
	              console.log(body)
	          }
	      });
});


module.exports = router;
