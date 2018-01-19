const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const mongojs = require('mongojs');
const moment = require('moment');
const request = require('request');

var Nigeria = mongojs(process.env.DB_URL, ['PollingUnits', 'Senates', 'FederalConstituency']);


router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: true}));

function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (!req.cookies.user_id)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.redirect('dashboard.lvh.me:5000');
}


router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', isAuthenticated, (req, res) => {
	req.app.locals.layout = 'layout';
	fetch('https://restcountries.eu/rest/v2/all')
	.then(function(response) {
	  return response.json();
  }).then(function(respo) {
	  res.status(200).render('register', {country: respo, title: 'Membership'});
	});
});

//route to get the wards
router.get('/getWARD', function (req, res) {

	//function to create folders
	let Senatorial, FedConstituency; // to hold the zones
	var regexstring = new RegExp("\\b"+req.query.lgaReg+"\\b","ig") // regular expression to check Federal Constituency

	//querying mongodb to get the senate zone
	Nigeria.Senates.find({state_name: req.query.stateReg}, function (err, docs) {
		docs.forEach((item) => {
			var DBLGAName = item.composition.split(",")
			DBLGAName.forEach((itemSA) => {
				var loCalGovt = itemSA.trim();
				if (req.query.lgaReg === loCalGovt) {
					Senatorial = item.senatorial_zone;
				}
			});
		});
	})

	//querying mongodb to get the Federal  Constituency
	if (req.query.lgaReg === 'Lagos Island') {
		FedConstituency = 'Lagos Island I/II'
	} else if (req.query.lgaReg === 'Mushin') {
		FedConstituency = 'Mushin I/II'
	} else if (req.query.lgaReg=== 'Oshodi/Isolo') {
		FedConstituency = 'Oshodi/Isolo I/II'
	} else if (req.query.lgaReg === 'Surulere') {
		FedConstituency = 'Surulere I/II'
	} else if (req.query.lgaReg === 'Port Harcourt') {
		FedConstituency = 'Port Harcourt I/II'
	} else {
		Nigeria.FederalConstituency.find({name_state: req.query.stateReg}, function (err, docsFED) {
			docsFED.forEach((itemFED) => {
				var FedName = itemFED.fed_const_name;
				if (FedName.match(regexstring) !== null) {
					FedConstituency = FedName;
				}
			});
		})
	}


	Nigeria.PollingUnits.find({
			 stName: req.query.stateReg,
			 lgaName: req.query.lgaReg
		},
		{
			wardName: 1,
	}).sort({lgaName: 1}, function (err, docs) {
		res.send({docs: docs, fedConst: FedConstituency, Senatorial: Senatorial});
	})
});


//route to get the wards
router.get('/getWARDout', function (req, res) {
	Nigeria.PollingUnits.find({
			 stName: req.query.stateReg,
			 lgaName: req.query.lgaReg
		},
		{
			wardName: 1,
	}).sort({lgaName: 1}, function (err, docs) {
		res.send({docs: docs});
	})
});

router.get('/senates', (req, res) => {

	var ThisMember = {
	  set current(name) {
	    this.come = name;
	  },
	  set fedt(name){
		  this.fect = name;
	  },
	  come: null,
	  fect: null
	}


   	//function to create folders
   	var Senatorial, FedConstituency; // to hold the zones

   	//querying mongodb to get the senate zone
   	Nigeria.Senates.find({state_name: req.query.stateReg},function (err, docsSen) {
			Senatorial = docsSen
			Nigeria.FederalConstituency.find({name_state: req.query.stateReg},  function (err, docsFED) {
				FedConstituency = docsFED
				res.send({sen: Senatorial, fedc: FedConstituency});
			})
   	})
});

//get the polling units
router.get('/getPolling', function (req, res) {
	Nigeria.PollingUnits.find({
			 stName: req.query.stateName,
			 lgaName: req.query.localgovtName,
			 wardName: req.query.wardName
		},
		{
			psName: 1,
	}).sort({lgaName: 1}, function (err, docs) {
		res.send(docs);
	})
});

router.post('/contact', (req, res) => {
  var body = req.body

  console.log(body);

  request.post(
	  process.env.ADDR+'/contact',
	  {json: body},
	  function (error, response, body) {
		  if (!error) {
			  res.status(200).send({success: true});
		  } else {
		   res.status(404).send({success: false});
		  }
	  }
  )
});

//creating Excos
router.post('createExco', isAuthenticated, (req, res) => {
	   // console.log(req.body);
	   var body = {
			position: req.body.positionReg,
		   personalInfo: req.body.personalInfo,
		   adminInfo: req.body.adminInfo,
		   level: req.body.levelReg,
			state: req.body.state,
			lga: req.body.lga,
			ward: req.body.ward,
			pollingUnit: req.body.pollingUnit
	   }

	   request.post(
			 process.env.ADDR+'/exco',
			 { json: body},
			 function (error, response, body) {
				  if (!error) {
					  res.status(200).send({message: "created"});
				  } else {
					  res.status(400).send({message: "Sorry we couldn't create user"});
				  }
			 });
});

//getting the lga for confirmation display
router.get('/getLGA', function (req, res) {

	Nigeria.PollingUnits.find({
			 stName: req.query.statePlace
		},
		{
			lgaName: 1,
	}).sort({lgaName: 1}, function (err, docs) {

		res.send(docs);
	})
});

router.post('/', (req, res) => {
	var body = req.body

	// console.log(body);
	request.post(
		 process.env.ADDR+'/register',
		 { json: body},
		 function (error, response, body) {
			  if (!error) {
				  res.status(200).send({success: true});
			  } else {
			  	res.status(404).send({success: false});
			  }
		 }
	);

});

module.exports = router;
