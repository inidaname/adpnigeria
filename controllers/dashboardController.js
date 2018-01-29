const express = require('express');
const router = express.Router();
const path = require('path');
const fetch = require('node-fetch');
const request = require('request');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieSession = require('cookie-session');
const moment = require('moment');
require('console.table');

router.use(bodyParser.urlencoded({ extended: true }));

var AdmData = {
	set AdmUserF(name) {
     this.AdmUser = name;
   },
	AdmUser: {}
}

var UserData = {
  set JstUserF(name) {
    this.JstUser = name;
  },
  JstUser: {}
}

function isAuthenticated(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (req.cookies.user_id){
	  return next();
  } else {
	  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
	  res.redirect('http://lvh.me:5000/');
  }
}
function isAdmin(req, res, next) {
  // do any checks you want to in here

  // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
  // you can do this however you want with whatever variables you set up
  if (req.cookies.admin_id){
	  return next();
  } else {
	  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
	  res.redirect('/');
  }
}

router.all('/*', isAuthenticated, (req, res, next) => {
	req.app.locals.layout = 'others/dashboard';
  next()
});

//routes to set the dashboard and admin page

router.get('/:subdomain', isAuthenticated, (req, res) => {
	if (req.params.subdomain === 'dashboard') {
		fetch(process.env.ADDR+'/member/'+req.cookies.user_id, {headers: {authorization: req.headers.authorization}})
		.then((res) => {
			return res.json();
		}).then((json) => {
			res.render('others/index', {title: 'Dashboard', json, header: req.headers.authorization});
		})
	} else if (req.params.subdomain === 'admin') {
		if (req.cookies.admin_id) {
			var theUserMe;
			fetch(process.env.ADDR+'/admin/members', {headers: {authorization: req.headers.authorization}})
				.then((res) => {
					return res.json();
				}).then((members) => {
					var states = ["ABIA", "ADAMAWA", "AKWA IBOM", "ANAMBRA", "BAUCHI", "BAYELSA", "BENUE", "BORNO", "CROSS RIVER", "DELTA", "EBONYI", "EDO", "EKITI", "ENUGU", "FCT", "GOMBE", "IMO", "JIGAWA", "KADUNA", "KANO", "KATSINA", "KEBBI", "KOGI", "KWARA", "LAGOS", "NASARAWA", "NIGER", "OGUN", "ONDO", "OSUN", "OYO", "PLATEAU", "RIVERS", "SOKOTO", "TARABA", "YOBE", "ZAMFARA"];
					theGroupData = {
						total: members.length,
						female: 0,
						male: 0,
						youth: 0,
						old: 0,
						recent: 0,
						stateName: null
					};


					var thestates = {}
					states.forEach((itemST) => {
						thestates[itemST] = {
							name: itemST,
							num: 0
						}
						members.forEach((item) => {
							if (item.stName === itemST) {
								thestates[itemST].num++
								return theGroupData.stateName = thestates;
							}
						})
					})


					members.forEach((item) => {
						if (item.gender === 'female') {
							theGroupData.female++
						} else if (item.gender === 'male') {
							theGroupData.male++
						}

						var dateofBirths = moment(item.dateofBirth, "DD/MM/YYYY").format("DD-MM-YYYY")
						var todayNow = moment()
						if (todayNow.diff(dateofBirths, 'years') >= 40) {
							theGroupData.old++
						} else if(todayNow.diff(dateofBirths, 'years') <= 40 && todayNow.diff(dateofBirths, 'years') >= 10) {
							theGroupData.youth++
						}

						if (moment().diff(item.dateCreated, 'days') <= 2) {
							theGroupData.recent++
						}
						if (item._id === req.cookies.user_id) {
							return theUserMe = item;
						}
					})
					theUserMe.adminid = req.cookies.admin_id
					res.render('others/members', {member: theGroupData, json: theUserMe, admin: true, header: req.headers.authorization});
				})
		} else if (req.cookies.admin_req) {
			fetch(process.env.ADDR+'/admin/'+req.cookies.user_id, {headers: {authorization: req.headers.authorization}})
			.then((res) => {
				return res.json();
			}).then((json) => {
				if (json.approve === true) {
					res.clearCookie('admin_req')
					res.cookie('admin_id', json._id)
					var theUserMe;
					fetch(process.env.ADDR+'/admin/members', {headers: {authorization: req.headers.authorization}})
						.then((res) => {
							return res.json();
						}).then((members) => {
							var states = ["ABIA", "ADAMAWA", "AKWA IBOM", "ANAMBRA", "BAUCHI", "BAYELSA", "BENUE", "BORNO", "CROSS RIVER", "DELTA", "EBONYI", "EDO", "EKITI", "ENUGU", "FCT", "GOMBE", "IMO", "JIGAWA", "KADUNA", "KANO", "KATSINA", "KEBBI", "KOGI", "KWARA", "LAGOS", "NASARAWA", "NIGER", "OGUN", "ONDO", "OSUN", "OYO", "PLATEAU", "RIVERS", "SOKOTO", "TARABA", "YOBE", "ZAMFARA"];
							theGroupData = {
								total: members.length,
								female: 0,
								male: 0,
								youth: 0,
								old: 0,
								recent: 0,
								stateName: null
							};


							var thestates = {}
							states.forEach((itemST) => {
								thestates[itemST] = {
									name: itemST,
									num: 0
								}
								members.forEach((item) => {
									if (item.stName === itemST) {
										thestates[itemST].num++
										return theGroupData.stateName = thestates;
									}
								})
							})


							members.forEach((item) => {
								if (item.gender === 'female') {
									theGroupData.female++
								} else if (item.gender === 'male') {
									theGroupData.male++
								}

								var dateofBirths = moment(item.dateofBirth, "DD/MM/YYYY").format("DD-MM-YYYY")
								var todayNow = moment()
								if (todayNow.diff(dateofBirths, 'years') >= 40) {
									theGroupData.old++
								} else if(todayNow.diff(dateofBirths, 'years') <= 40 && todayNow.diff(dateofBirths, 'years') >= 10) {
									theGroupData.youth++
								}

								if (moment().diff(item.dateCreated, 'days') <= 2) {
									theGroupData.recent++
								}
								if (item._id === req.cookies.user_id) {
									return theUserMe = item;
								}
							})

							res.render('others/members', {member: theGroupData, json: theUserMe, admin: true, header: req.headers.authorization});
						})
				} else {
					res.render('others/regadmin', {title: 'Admin Section', json: json.personalInfo, header: req.headers.authorization});
				}
			})
		} else {
			fetch(process.env.ADDR+'/admin/'+req.cookies.user_id, {headers: {authorization: req.headers.authorization}})
			.then((res) => {
				return res.json();
			}).then((json) => {
				if (json.approve === true) {
					res.cookie('admin_id', json._id)
					var theUserMe;
					fetch(process.env.ADDR+'/admin/members', {headers: {authorization: req.headers.authorization}})
						.then((res) => {
							return res.json();
						}).then((members) => {
							var states = ["ABIA", "ADAMAWA", "AKWA IBOM", "ANAMBRA", "BAUCHI", "BAYELSA", "BENUE", "BORNO", "CROSS RIVER", "DELTA", "EBONYI", "EDO", "EKITI", "ENUGU", "FCT", "GOMBE", "IMO", "JIGAWA", "KADUNA", "KANO", "KATSINA", "KEBBI", "KOGI", "KWARA", "LAGOS", "NASARAWA", "NIGER", "OGUN", "ONDO", "OSUN", "OYO", "PLATEAU", "RIVERS", "SOKOTO", "TARABA", "YOBE", "ZAMFARA"];
							theGroupData = {
								total: members.length,
								female: 0,
								male: 0,
								youth: 0,
								old: 0,
								recent: 0,
								stateName: null
							};


							var thestates = {}
							states.forEach((itemST) => {
								thestates[itemST] = {
									name: itemST,
									num: 0
								}
								members.forEach((item) => {
									if (item.stName === itemST) {
										thestates[itemST].num++
										return theGroupData.stateName = thestates;
									}
								})
							})


							members.forEach((item) => {
								if (item.gender === 'female') {
									theGroupData.female++
								} else if (item.gender === 'male') {
									theGroupData.male++
								}

								var dateofBirths = moment(item.dateofBirth, "DD/MM/YYYY").format("DD-MM-YYYY")
								var todayNow = moment()
								if (todayNow.diff(dateofBirths, 'years') >= 40) {
									theGroupData.old++
								} else if(todayNow.diff(dateofBirths, 'years') <= 40 && todayNow.diff(dateofBirths, 'years') >= 10) {
									theGroupData.youth++
								}

								if (moment().diff(item.dateCreated, 'days') <= 2) {
									theGroupData.recent++
								}
								if (item._id === req.cookies.user_id) {
									return theUserMe = item;
								}
							})

							theUserMe.adminid = json._id

							res.render('others/members', {member: theGroupData, json: theUserMe, admin: true, header: req.headers.authorization});
						})
				} else if (json.approve === false) {
					res.cookie('admin_req', req.cookies.user_id)
					fetch(process.env.ADDR+'/admin/'+req.cookies.user_id, {headers: {authorization: req.headers.authorization}})
					.then((res) => {
						return res.json();
					}).then((json) => {
						res.render('others/regadmin', {title: 'Admin Section', json: json.personalInfo, header: req.headers.authorization});
					})
				} else {
					fetch(process.env.ADDR+'/member/'+req.cookies.user_id, {headers: {authorization: req.headers.authorization}})
					.then((res) => {
						return res.json();
					}).then((json) => {
						res.render('others/regadmin', {title: 'Admin Section', json: json, header: req.headers.authorization});
					})
				}
			})
		}
	}
});

// rout to get all members according to states
router.get('/:subdomain/members/lists', (req, res) => {

	if (req.params.subdomain === 'admin') {
		fetch(process.env.ADDR + '/admin/members', {headers: {authorization: req.headers.authorization}}).then((res) => {
			return res.json();
		}).then((members) => {
			var theUserMe;
			var states = [
				"ABIA",
				"ADAMAWA",
				"AKWA IBOM",
				"ANAMBRA",
				"BAUCHI",
				"BAYELSA",
				"BENUE",
				"BORNO",
				"CROSS RIVER",
				"DELTA",
				"EBONYI",
				"EDO",
				"EKITI",
				"ENUGU",
				"FCT",
				"GOMBE",
				"IMO",
				"JIGAWA",
				"KADUNA",
				"KANO",
				"KATSINA",
				"KEBBI",
				"KOGI",
				"KWARA",
				"LAGOS",
				"NASARAWA",
				"NIGER",
				"OGUN",
				"ONDO",
				"OSUN",
				"OYO",
				"PLATEAU",
				"RIVERS",
				"SOKOTO",
				"TARABA",
				"YOBE",
				"ZAMFARA"
			];
			theGroupData = {
				total: members.length,
				female: 0,
				male: 0,
				youth: 0,
				old: 0,
				recent: 0,
				stateName: null
			};

			var thestates = {}
			states.forEach((itemST) => {
				thestates[itemST] = {
					name: itemST,
					num: 0
				}
				members.forEach((item) => {
					if (item.stName === itemST) {
						thestates[itemST].num++
						return theGroupData.stateName = thestates;
					}
				})
			})

			members.forEach((item) => {
				if (item.gender === 'female') {
					theGroupData.female++
				} else if (item.gender === 'male') {
					theGroupData.male++
				}

				var dateofBirths = moment(item.dateofBirth, "DD/MM/YYYY").format("DD-MM-YYYY")
				var todayNow = moment()
				if (todayNow.diff(dateofBirths, 'years') >= 40) {
					theGroupData.old++
				} else if (todayNow.diff(dateofBirths, 'years') <= 40 && todayNow.diff(dateofBirths, 'years') >= 10) {
					theGroupData.youth++
				}

				if (moment().diff(item.dateCreated, 'days') <= 2) {
					theGroupData.recent++
				}
			})

			res.send({
				member: theGroupData,
				allMember: members
			});
		})
	}

});


//routes to get all members out for statistics
router.get('/:subdomain/members', isAuthenticated, isAdmin, (req, res) => {
	fetch(process.env.ADDR+'/admin/'+req.cookies.user_id, {headers: {authorization: req.headers.authorization}})
		 .then(function(res) {
			  return res.json();
		 }).then(function(jsonAD) {
			 if (jsonAD.personalInfo) {
				 res.clearCookie("admin_req");
				if (jsonAD.approve === true) {
					 res.cookie('admin_id', jsonAD._id)
					 res.clearCookie("admin_req");
					 res.render('others/admin', {title:'Admin Section', json: jsonAD.personalInfo, admin: true});
				 } else if (jsonAD.approve === false) {
					 if (!req.cookies.admin_req) {
						 res.cookie('admin_req', json._id)
					 }
					 res.render('others/regadmin', {title: 'Admin Section', json: json, header: req.headers.authorization});
				 }
			 } else {
				 res.clearCookie("admin_req");
				 fetch(process.env.ADDR+'/member/'+req.cookies.user_id, {headers: {authorization: req.headers.authorization}})
				 .then((res) => {
					 return res.json();
				 }).then((json) => {
					 res.render('others/regadmin', {title: 'Admin Section', json: json, header: req.headers.authorization});
				 })
			 }
		 });
});

router.get('/:subdomain/authority', isAuthenticated, isAdmin, (req, res) => {
  if (req.params.subdomain === 'admin') {
	  fetch(process.env.ADDR+'/admin', {headers: {authorization: req.headers.authorization}})
  	.then((res) => {
  		return res.json();
  	}).then((json) => {
		var adminCheck = [];
		var perInC,
		arryP = [];
		json.forEach((item) => {
			if (item.personalInfo._id === req.cookies.user_id) {
				perInC = item;
				if (item.level === 'national') {
					adminCheck = ['national', 'state', 'local govt', 'ward', 'polling units']
				} else if (item.level === 'state') {
					adminCheck = ['state', 'local govt', 'ward', 'polling units']
				} else if (item.level === 'local govt') {
					adminCheck = ['local govt', 'ward', 'polling units']
				} else if (item.level === 'ward') {
					adminCheck = ['ward', 'polling units']
				} else if (item.level === 'polling units') {
					adminCheck = ['polling units']
				}
			}
		})

		json.forEach((otheritem) => {
			if (otheritem.approve === false) {
				if (perInC.level === 'national') {
					otheritem.hislocation = otheritem.personalInfo.stName
					arryP.push(otheritem)
				} else if (perInC.level === 'state') {
					if (perInC.personalInfo.stName === otheritem.personalInfo.stName) {
						if (otheritem.level === 'local govt' || otheritem.level === 'ward' || otheritem.level === 'polling units') {
							otheritem.hislocation = otheritem.personalInfo.lgaName
							arryP.push(otheritem)
						}
					}
				} else if (perInC.level === 'local govt') {
					if (perInC.personalInfo.lgaName === otheritem.personalInfo.lgaName) {
						if (otheritem.level === 'ward' || otheritem.level === 'polling units') {
							otheritem.hislocation = otheritem.personalInfo.wardName
							arryP.push(otheritem)
						}
					}
				} else if (perInC.level === 'ward') {
					if (perInC.personalInfo.wardName === otheritem.personalInfo.wardName) {
						if (otheritem.level === 'polling units') {
							arryP.push(otheritem)
						}
					}
				}
			}
		})
		perInC.personalInfo.level = perInC.level
		res.status(200).render('others/authority', {json: perInC.personalInfo, admin: adminCheck, admins: arryP, title: 'Authority', header: req.headers.authorization});
  	})
  }
});


router.get('/:subdomain/candidacy', isAuthenticated, isAdmin, (req, res) => {
  res.render('others/candidacy');
});

router.post('/:subdomain', isAuthenticated, (req, res) => {
  if (req.params.subdomain === 'admin') {
	  // console.log(req.body);
	  var body = {
		  phone: req.body.phone,
		  personalInfo: req.body.personalInfo,
		  level: req.body.level,
		  position: req.body.position
	  }

	  // console.log(body);
	  request.post(
	      process.env.ADDR+'/admin/register',
	      { json: body},
	      function (error, response, body) {
	          if (!error) {
					 res.cookie('admin_req', req.cookies.user_id)
					 res.redirect('/');
	          } else {
	          	console.log(error);
	          }
	      }
	  );

	}
});

router.get('/:subdomain/platform', isAuthenticated, (req, res) => {
	if (req.params.subdomain === 'dashboard') {
		fetch(process.env.ADDR+'/member/'+req.cookies.user_id, {headers: {authorization: req.headers.authorization}})
		.then((res) => {
			return res.json();
		}).then((json) => {
			res.render('others/platform', {title: 'Plstform', json});
		})
	}
});

router.post('/:subdomain/platform', (req, res) => {
  if (req.params.subdomain === 'dashboard') {
	  var body = req.body
	  body.contestant = req.cookies.user_id
	  request.post(
		  process.env.ADDR+'/interest/',
		  {json: body},
		  function (err, response, body) {
			  if (!err) {
			  	// FIXME: To send email after return
			  	res.send({payfor: response.position});
			  }
		  }
	  )
  }
});

router.get('/:subdomain/profile', isAuthenticated, (req, res) => {
	fetch(process.env.ADDR+'/member/'+req.cookies.user_id, {headers: {authorization: req.headers.authorization}})
	.then((res) => {
		return res.json();
	}).then((json) => {
		if (moment().diff(json.dateCreated, 'minutes') <= 60) {
			json.proage = moment().diff(json.dateCreated, 'minutes') + " Minute(s) Old"
		} else if (moment().diff(json.dateCreated, 'hours') <= 24) {
			json.proage = moment().diff(json.dateCreated, 'hours') + " Hour(s) Old"
		} else if (moment().diff(json.dateCreated, 'days') <= 7) {
			json.proage = moment().diff(json.dateCreated, 'days') + " Day(s) Old"
		} else if (moment().diff(json.dateCreated, 'weeks') <= 4) {
			json.proage = moment().diff(json.dateCreated, 'weeks') + " Week(s) Old"
		} else if (moment().diff(json.dateCreated, 'months') <= 12) {
			json.proage = moment().diff(json.dateCreated, 'month') + " Month(s) Old"
		} else {
			json.proage = moment().diff(json.dateCreated, 'years') + " Year(s) Old"
		}
		res.render('others/profile', {title: 'Dashboard', json, header: req.headers.authorization});
	})
});

module.exports = router
