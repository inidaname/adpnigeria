const express = require('express');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const request = require('request');
const session = require('express-session');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (req.cookies.user_id)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('/');
}


router.get('/', isAuthenticated, (req, res) => {
	req.app.locals.layout = 'layout';
		fetch(process.env.ADDR+'/member/'+req.cookies.user_id)
		.then((res) => {
			return res.json();
		}).then((docs) => {
			res.status(200).render('pay', {docs, title: 'Make Payment Online'});
		})
});

router.post('/paid', (req, res) => {
	// console.log(body);
	var body = req.body
	request.post(
		 process.env.ADDR+'/payment',
		 { json: body},
		 function (error, response, body) {
			 res.status(200).send({message: "Success"});
			//  request.patch(process.env.ADDR+'/member/'+req.body.userId, {MemberVerified: true},
		 // (err, resp, body) => {
		 // })
		 }
	);

});

module.exports = router;
