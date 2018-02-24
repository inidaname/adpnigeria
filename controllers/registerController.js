const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const mongojs = require('mongojs');
const moment = require('moment');
const md5 = require('md5');
const hbs = require('nodemailer-express-handlebars');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const request = require('request');

var Nigeria = mongojs(process.env.DB_URL, ['PollingUnits', 'Senates', 'FederalConstituency']);

//nodemailer settings
//This options sends mail
let transporter = nodemailer.createTransport({
	host: process.env.MAILHOST,
	port: process.env.MAILPORT,
	secure: false, // true for 465, false for other ports
	tls: {
        rejectUnauthorized:false
    },
	auth: {
		user: process.env.MAILUSER,
		pass: process.env.MAILPASS
	}
});

//useing engine for mail view
transporter.use('compile', hbs({
	viewPath: 'views/email',
	extName: '.hbs'
}));


//random codes for mail verification
random = (howMany, chars) => {
    chars = chars
        || "ABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    let rnd = crypto.randomBytes(howMany)
        , value = new Array(howMany)
        , len = chars.length;

    for (let i = 0; i < howMany; i++) {
        value[i] = chars[rnd[i] % len]
    };

    return value.join('');
}



router.use(cookieParser());
router.use(bodyParser.urlencoded({extended: true}));

function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (!req.cookies.user_id)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
  res.status(200).redirect('https://dashboard.adp.ng');
}


router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', isAuthenticated, (req, res) => {
	req.app.locals.layout = 'layout';
	fetch('https://restcountries.eu/rest/v2/all')
	.then(function(response) {
	  return response.json();
  }).then(function(respo) {
	  res.status(200).render('register', {country: respo, title: 'Membership', header: req.headers.authorization});
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


	Nigeria.PollingUnits.aggregate(
		{
			 $match : {
				 stName: req.query.stateReg,
				 lgaName: req.query.lgaReg
			 }
		},
		{
			 $group : {
					_id : "$wardName"
			 }
		}).sort({wardName: 1}, function (err, docs) {
		res.send({docs: docs, fedConst: FedConstituency, Senatorial: Senatorial});
	})
});


//route to get the wards
router.get('/getWARDout', function (req, res) {
	Nigeria.PollingUnits.aggregate(
		{
			 $match : {
				 stName: req.query.stateReg,
				 lgaName: req.query.lgaReg
			 }
		},
		{
			 $group : {
					_id : "$wardName"
			 }
		}, function (err, docs) {
		res.send(docs);
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
	Nigeria.PollingUnits.aggregate(
		{
			$match : {
		 		stName: req.query.stateName,
				lgaName: req.query.localgovtName,
				 wardName: req.query.wardName
			 }
		 },
		 {
 			 $group : {
 					_id : "$psName"
 			 }
 		}).sort({psName: 1}, function (err, docs) {
		res.send(docs);
	})
});

router.post('/contact', (req, res) => {
  var body = req.body

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

	Nigeria.PollingUnits.aggregate({
			$match: {stName: req.query.statePlace}
		},
		{
			$group: { _id: '$lgaName'}
	}).sort({lgaName: 1}, function (err, docs) {

		res.send(docs);
	})
});

router.post('/', (req, res) => {
	var body = req.body
	body.hashUser = md5(moment().format() + body.full_name + body.phone_number)
	body.mobileCode =  random(3) +''+ random(4)
	body.TempID = random(6) +''+ random(3)

	// console.log(body);
	request.post(
		 process.env.ADDR+'/register',
		 { json: body},
		 function (error, response, bodies) {
			 // console.log(error, response, body);
			  if (!error) {
					if (bodies.body) {

						// sending sms for confirmation

							var owneremail = process.env.SMSACCT;
							var subacct = process.env.SUBACCT;
							var subacctpwd = process.env.SUBACCTPWD;
							var senderNum = 'ADP Office';
							var SMSmes = 'Hello '+bodies.body.full_name+' \nYour registration as a member of ADP was succesful your membership ID is: '+bodies.body.MemberAuth.TempID +'. \n#TheCredibleAlternative \nThank You \nOne Destiny';
							request.post('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+owneremail+'&subacct='+subacct+'&subacctpwd='+subacctpwd+'&message='+SMSmes+'&sender='+senderNum+'&sendto='+bodies.body.phone_number+'&msgtype=0');


						transporter.sendMail({
							from: 'ADP National Secretariat <contact@adp.ng>', // sender address
							to: bodies.body.email, // list of receivers
							subject: bodies.body.full_name + ' Congratulations!, You are now A Member of ADP', // Subject line
							template: 'emailtempl', // email template
							context: {
								full_name: bodies.body.full_name,
								member_id: bodies.body.MemberAuth.TempID,

							}
						}, function (err, info) {
							if (!err) {
								console.log('Message sent: %s', info.messageId);
								// Preview only available when sending through an Ethereal account
								console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

								// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
								// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
								res.cookie('user_id', bodies.body._id, {domain: '.adp.ng'});
								res.redirect('/pay/')
							} else {
								res.cookie('user_id', bodies.body._id, {domain: '.adp.ng'})
								res.redirect('/pay/')
							}
						});
					}
			  } else {
				  res.redirect('/register/');
			  	// res.status(404).send({success: false});
			  }
		 }
	);

});

module.exports = router;
