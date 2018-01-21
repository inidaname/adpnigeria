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
	var states = [{_id: "ABIA"}, {_id: "ADAMAWA"}, {_id: "AKWA IBOM"}, {_id: "ANAMBRA"}, {_id: "BAUCHI"}, {_id: "BAYELSA"}, {_id: "BENUE"}, {_id: "BORNO"}, {_id: "CROSS RIVER"}, {_id: "DELTA"}, {_id: "EBONYI"}, {_id: "EDO"}, {_id: "EKITI"}, {_id: "ENUGU"}, {_id: "FCT"}, {_id: "GOMBE"}, {_id: "IMO"}, {_id: "JIGAWA"}, {_id: "KADUNA"}, {_id: "KANO"}, {_id: "KATSINA"}, {_id: "KEBBI"}, {_id: "KOGI"}, {_id: "KWARA"}, {_id: "LAGOS"}, {_id: "NASARAWA"}, {_id: "NIGER"}, {_id: "OGUN"}, {_id: "ONDO"}, {_id: "OSUN"}, {_id: "OYO"}, {_id: "PLATEAU"}, {_id: "RIVERS"}, {_id: "SOKOTO"}, {_id: "TARABA"}, {_id: "YOBE"}, {_id: "ZAMFARA"}];
	res.status(200).render('states', {title: 'About the States', location: states, state: true})

});



router.get('/:states', (req, res) => {
	var states = ["ABIA", "ADAMAWA", "AKWA IBOM", "ANAMBRA", "BAUCHI", "BAYELSA", "BENUE", "BORNO", "CROSS RIVER", "DELTA", "EBONYI", "EDO", "EKITI", "ENUGU", "FCT", "GOMBE", "IMO", "JIGAWA", "KADUNA", "KANO", "KATSINA", "KEBBI", "KOGI", "KWARA", "LAGOS", "NASARAWA", "NIGER", "OGUN", "ONDO", "OSUN", "OYO", "PLATEAU", "RIVERS", "SOKOTO", "TARABA", "YOBE", "ZAMFARA"];
	var listOfthing = {
		active: false
	}

		var thisGuy = {
		  set current(name) {
			 this.come = name;
		  },
		  come: null
		}

	fetch(process.env.ADDR+'/contact/'+req.params.states)
	.then((res) => {
		return res.json();
	}).then((json) => {

		json.forEach((item) => {
			// console.log(item);
			if (req.params.states === item.state) {
			  if (item.level === 'state') {
				  thisGuy.current = item
			  }
			}
		})

		listOfthing.active = true
	})
	fetch(process.env.ADDR+'/excos/'+req.params.states)
	.then((res) => {
		return res.json();
	}).then((json) => {
		listOfthing.excos = json
		listOfthing.active = true
	})

	Nigeria.PollingUnits.aggregate(
    {
        $match : {stName : req.params.states}
    },
    {
        $group : {
             _id : "$lgaName"
        }
    }, function (err, docs) {

		 console.log(thisGuy.come);
		 res.status(200).render('states', {title: 'About '+req.params.states, things: listOfthing, contact: thisGuy.come, location: docs});
	 }
);


});

router.get('/:states/lga', (req, res) => {

		var thisGuy = {
		  set current(name) {
			 this.come = name;
		  },
		  come: null
		}

	fetch(process.env.ADDR+'/contact/'+req.params.states)
	.then((res) => {
		return res.json();
	}).then((json) => {

		json.forEach((item) => {
			// console.log(item);
			if (req.params.states === item.state && req.query.param === item.lga) {
			  if (item.level === 'local govt') {
				  thisGuy.current = item
			  }
			}
		})

		Nigeria.PollingUnits.aggregate(
			{
				$match : {
					stName : req.params.states,
					lgaName: req.query.param
				}
			},
			{
				$group : {
					_id : "$wardName"
				}
			}, function (err, docs) {

				res.send({docs: docs, contact: thisGuy.come});
			}
		);
	})

});

router.get('/:states/ward', (req, res) => {

		var thisGuy = {
		  set current(name) {
			 this.come = name;
		  },
		  come: null
		}

	fetch(process.env.ADDR+'/contact/'+req.params.states)
	.then((res) => {
		return res.json();
	}).then((json) => {

		json.forEach((item) => {
			// console.log(item);
			if (req.params.states === item.state && req.query.param === item.lga) {
			  if (item.level === 'local govt') {
				  thisGuy.current = item
			  }
			}
		})

		Nigeria.PollingUnits.aggregate(
			{
				$match : {
					stName : req.params.states,
					lgaName: req.query.param
				}
			},
			{
				$group : {
					_id : "$wardName"
				}
			}, function (err, docs) {

				res.send({docs: docs, contact: thisGuy.come});
			}
		);
	})

});

module.exports = router;
