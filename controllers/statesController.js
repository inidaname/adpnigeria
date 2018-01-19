const express = require('express');
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch');
const request = require('request');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieSession = require('cookie-session');
const mongojs = require('mongojs')
const moment = require('moment');

router.use(bodyParser.urlencoded({ extended: true }));
var Nigeria = mongojs(process.env.DB_URL, ['PollingUnits', 'Senates', 'FederalConstituency']);

router.get('/', (req, res) => {
	var states = ["ABIA", "ADAMAWA", "AKWA IBOM", "ANAMBRA", "BAUCHI", "BAYELSA", "BENUE", "BORNO", "CROSS RIVER", "DELTA", "EBONYI", "EDO", "EKITI", "ENUGU", "FCT", "GOMBE", "IMO", "JIGAWA", "KADUNA", "KANO", "KATSINA", "KEBBI", "KOGI", "KWARA", "LAGOS", "NASARAWA", "NIGER", "OGUN", "ONDO", "OSUN", "OYO", "PLATEAU", "RIVERS", "SOKOTO", "TARABA", "YOBE", "ZAMFARA"];

	Nigeria.PollingUnits.aggregate(
		{
			$match: {stName: "SOKOTO"}
		},
		{

		$group : { _id : "$lgaName", wdName: { $push: "$wardName" } }

	},
		function (err, wedontknow) {
			res.status(200).render('states', {title: 'About the States', wedontknow, states})
		}
	)

});



//
// router.get('/:states', (req, res) => {
// 	console.log(req.params);
// 	var listOfthing = {
// 		active: false
// 	}
// 	fetch(process.env.ADDR+'/contact/'+req.params.states)
// 	.then((res) => {
// 		return res.json();
// 	}).then((json) => {
// 		listOfthing.contact = json
// 		listOfthing.active = true
// 	})
// 	fetch(process.env.ADDR+'/excos/'+req.params.states)
// 	.then((res) => {
// 		return res.json();
// 	}).then((json) => {
// 		listOfthing.excos = json
// 		listOfthing.active = true
// 	})
//
// 	if (listOfthing.active === true) {
// 		res.status(200).render('states', {title: 'About '+req.params.states, data: listOfthing});
// 	}
// });
//
// router.get('/:states/:lga', (req, res) => {
// 	var listOfthing = {
// 		active: false
// 	}
// 	fetch(process.env.ADDR+'/contact/'+req.params.states+'/'+req.params.lga)
// 	.then((res) => {
// 		return res.json();
// 	}).then((json) => {
// 		listOfthing.contact = json
// 		listOfthing.active = true
// 	})
// 	fetch(process.env.ADDR+'/excos/'+req.params.states+'/'+req.params.lga)
// 	.then((res) => {
// 		return res.json();
// 	}).then((json) => {
// 		listOfthing.excos = json
// 		listOfthing.active = true
// 	})
//
// 	if (listOfthing.active === true) {
// 		res.status(200).send({title: req.params.states, data: listOfthing});
// 	}
// });

module.exports = router;
