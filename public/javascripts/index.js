$(document).ready(function() {
	var HostPlace = window.location.hostname
	$.cloudinary.config({ cloud_name: 'inidaname', secure: true});

    var cl = cloudinary.Cloudinary.new({cloud_name: "inidaname"});
    // replace 'demo' with your cloud name in the line above
    cl.responsive();

	 // $.post('http://192.168.0.100:8888/api/auth/login', {email: 'a@gmail.com', password: 'amaz'}, function(data, textStatus, xhr) {
		//  console.log(data);
	 // });

		let iScrol = 0;
		$(window).scroll(function() {

			/* Act on the event */
			let theScroll = $(this).scrollTop();

			if (theScroll > iScrol) {
				$('header').addClass('header');
			} else {
				$('header').removeClass('header');
			}
		});

		// checking the regi page
		if (document.location.pathname === '/register/') {

			var toggleModal = () => {
				$('#loading').modal('toggle');
				setTimeout(function () {
					$('#loading').modal('toggle');
				}, 7000);
			}

			var stateReg = $('#stateReg'), localgovt = $('#localgovt'), wardCT = $('#wardCT'), pollingUnit = $('#pollingUnit')


			var states = ["Select State", "ABIA", "ADAMAWA", "AKWA IBOM", "ANAMBRA", "BAUCHI", "BAYELSA", "BENUE", "BORNO", "CROSS RIVER", "DELTA", "EBONYI", "EDO", "EKITI", "ENUGU", "FCT", "GOMBE", "IMO", "JIGAWA", "KADUNA", "KANO", "KATSINA", "KEBBI", "KOGI", "KWARA", "LAGOS", "NASARAWA", "NIGER", "OGUN", "ONDO", "OSUN", "OYO", "PLATEAU", "RIVERS", "SOKOTO", "TARABA", "YOBE", "ZAMFARA"];

			states.forEach(elem => {
				$('#stateReg').append("<option value='"+elem+"'>"+elem+"</option>")
			});


			//checking for local govt from states
			stateReg.change(function(event) {
				var emptyLGA = ['Select One'];

				if (stateReg.val() !== 'Select State') {
					toggleModal()
					localgovt.removeAttr('disabled')
					localgovt.html('<option value="Select One">Select One</option>')
					wardCT.html('<option value="">Select LGA First</option')
					wardCT.attr('disabled', 'true');
					pollingUnit.html('<option value="">Select LGA and WARD First</option')
					pollingUnit.attr('disabled', 'true');
					$('#senatePat').html(' ')
					$('#senateSp').val(' ')
					$('#FedConPat').html(' ')
					$('#FedSp').val(' ')


					$.ajax({
						url: 'getLGA',
						type: 'GET',
						dataType: 'JSON',
						data: {statePlace: stateReg.val()}
					})
					.done(function(data) {
						data.forEach(elemLGA => {
							$('#localgovt').append(`<option value="`+elemLGA._id+`">`+elemLGA._id+`</option>`)
						});
					})
					.fail(function() {
						console.log("error");
					});
				} else {
					localgovt.attr('disabled', 'true')
					localgovt.html('<option value="Select A State">Select One</option>')
					wardCT.html('<option value="">Select LGA First</option')
					wardCT.attr('disabled', 'true');
					pollingUnit.html('<option value="">Select LGA and WARD First</option')
					pollingUnit.attr('disabled', 'true');
					$('#senatePat').html(' ')
					$('#senateSp').val(' ')
					$('#FedConPat').html(' ')
					$('#FedSp').val(' ')
				}
			});



					localgovt.change(function(event) {
						var emptyWard = ['Select Your Ward'];
						if (localgovt.val() !== 'Select One') {
							wardCT.html('<option value="Select One">Select One</option')
							wardCT.removeAttr('disabled');
							pollingUnit.html('<option value="">Select WARD First</option')
							pollingUnit.attr('disabled', 'true');
							$('#senatePat').html(' ')
							$('#senateSp').val(' ')
							$('#FedConPat').html(' ')
							$('#FedSp').val(' ')
							toggleModal()
							$.ajax({
								url: 'getWARD',
								type: 'GET',
								dataType: 'JSON',
								data: {stateReg: stateReg.val(), lgaReg: localgovt.val()}
							})
							.done(function(data) {
								$('#senatePat').html(data.Senatorial)
								$('#senateSp').val(data.Senatorial)
								$('#FedConPat').html(data.fedConst)
								$('#FedSp').val(data.fedConst)
								var thisData = data.docs
								thisData.forEach(elemWard => {
									wardCT.append(`<option value="`+elemWard._id+`">`+elemWard._id+`</option>`);
								});
							})
							.fail(function() {
								console.log("error");
							});
						} else {
							wardCT.html('<option value="Select One">Select LGA</option')
							wardCT.attr('disabled', 'true');
							pollingUnit.html('<option value="">Select WARD First</option')
							pollingUnit.attr('disabled', 'true');
							$('#senatePat').html(' ')
							$('#senateSp').val(' ')
							$('#FedConPat').html(' ')
							$('#FedSp').val(' ')
						}
					});

					wardCT.change(function(event) {
						var emptyPU = [' '];
						if (wardCT.val() !== 'Select One') {
							pollingUnit.html('<option value="Select One">Select One</option')
							pollingUnit.removeAttr('disabled');
							toggleModal()
							$.ajax({
								url: 'getPolling',
								type: 'GET',
								dataType: 'JSON',
								data: {stateName: stateReg.val(), localgovtName: localgovt.val(), wardName: wardCT.val()}
							})
							.done(function(data) {
								pollingUnit.html('<option value="">Please select your polling unit</option>')
								data.forEach(elemPU => {
									$('#loading').modal('hide')
									pollingUnit.append(`<option value="`+elemPU._id+`">`+elemPU._id+`</option>`)
								});
							})
							.fail(function() {
								console.log("error");
							});
						} else {
							pollingUnit.html('<option value="">Select WARD First</option')
							pollingUnit.attr('disabled', 'true');
						}
					});


			//login function begins here
			var login = $('#getLogin');
			$('#HostPlace').val(HostPlace)
			login.submit(function(event) {
				$('#hostname').val(HostPlace)
				var loginName = $('#loginName');
				var loginPassword = $('loginPassword')
				loginName.removeClass('is-invalid')
				loginPassword.removeClass('is-invalid')

				if (loginName.val() === '' || loginPassword.val() === '') {
					event.preventDefault()
					loginName.addClass('is-invalid')
					loginPassword.addClass('is-invalid')
					$('#logErr').addClass('text-danger').html('All Feilds must be completed')
				}
			});


			var theError = [];

			var full_name = $('#full_name')// the fullname feild

			full_name.change(function(event) {
				$('#prFulname').html()
				full_name.removeClass('is-invalid')
				if (full_name.val() !== '') {
					let getNames = full_name.val().split(' ')
					if (getNames.length <= 1) {
						full_name.addClass('is-invalid')
						$('#prFulname').addClass('text-danger').html('Please the Full Name must be at least with a Second Name');
						if ($.inArray('full_name', theError) === -1) {
							theError.push('full_name');
						}
					} else if (getNames[1] === '') {
						full_name.addClass('is-invalid')
						$('#prFulname').html('Please the Full Name must be at least with a Second Name');
						if ($.inArray('full_name', theError) === -1) {
							theError.push('full_name');
						}
					} else {
						if (theError.length >= '1') {
							var indexFN = theError.indexOf('full_name');
							if ($.inArray('full_name', theError) > -1) {
								 theError.splice(indexFN, 1);
							}
						}
						full_name.parent().removeClass('is-invalid')
					}
				}
			});
      //
			// //phone field formatting
			// $("#phone_number").intlTelInput({
			// 	initialCountry: "auto",
			// 	geoIpLookup: function(callback) {
			// 		$.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
			// 			var countryCode = (resp && resp.country)
			// 				? resp.country
			// 				: "";
			// 			callback(countryCode);
			// 		});
			// 	},
			// 	utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.1.6/js/utils.js" // just for formatting/placeholders etc
			// });
      //
			// var telInput = $("#phone_number"),
			// 	errorMsg = $("#error-msg"),
			// 	validMsg = $("#valid-msg");
      //
			// // initialise plugin
			// telInput.intlTelInput({utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.1.6/js/utils.js"});
      //
			// var reset = function() {
			// 	telInput.removeClass("is-invalid");
			// 	errorMsg.addClass("d-none");
			// 	validMsg.addClass("d-none");
			// };
      //
			// // on blur: validate
			// telInput.blur(function() {
			// 	reset();
			// 	if (theError.length >= '1') {
			// 		var indexPhone = theError.indexOf('phone_number');
			// 		if ($.inArray('phone_number', theError) > -1) {
			// 			theError.splice(indexPhone, 1);
			// 		}
			// 	}
			// 	if ($.trim(telInput.val())) {
			// 		if (telInput.intlTelInput("isValidNumber")) {
			// 			validMsg.removeClass("hide");
			// 			$('#phone_number').removeClass('is-invalid')
			// 			$('#phoneError').html(' ')
			// 			$('#phonealert').hide('slow');
			// 			$('#phone_number').parent().removeClass('is-Invalid')
      //
			// 			//checking if user phone number already exist
			// 			$.getJSON('http://192.168.0.100:8888/api/checkexist/'+$('#phone_number').intlTelInput("getNumber"), function(json, textStatus) {
			// 				if (json.success === true) {
			// 					$('#phoneError').html('already exist. <code>E66.3</code>')
			// 					$('#phone_number').addClass('is-invalid')
			// 					if ($.inArray('phone_number', theError) === -1) {
			// 						theError.push('phone_number');
			// 					}
			// 				} else {
			// 					if (theError.length >= '1') {
			// 						var indexPhone = theError.indexOf('phone_number');
			// 						if ($.inArray('phone_number', theError) > -1) {
			// 							theError.splice(indexPhone, 1);
			// 						}
			// 					}
			// 				}
			// 			});
			// 		} else {
			// 			telInput.addClass("danger");
			// 			errorMsg.removeClass("d-none");
			// 			$('#phone_number').addClass('has-warning')
			// 			if ($.inArray('phone_number', theError) === -1) {
			// 				theError.push('phone_number')
			// 			}
			// 		}
			// 	}
			// });
      //
			// // on keyup / change flag: reset
			// telInput.on("keyup change", reset);


			// checking for email
			// function to check for email
			function isEmail(email) {
				var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				return regex.test(email);
			}
			var email = $('#email') // the email

			email.change(function(event) {
				email.removeClass('is-invalid')
				$('#emailError').html(' ')
				if (!isEmail(email.val())) {
					$('#emailError').addClass('d-block').html('Invalid Email Format. <code>E56.1</code>')
					email.parent().addClass('is-invalid')
					email.addClass('is-invalid')
					if ($.inArray('email', theError) === -1) {
						theError.push('email');
					}
				}
			});


			// vslidating date of birth
			var dateofBirth = $('#dateofBirth')
			dateofBirth.change(function(event) {
				dateofBirth.parent().removeClass('is-invalid');
				$('#dateCheck').removeClass('d-block').addClass('d-none')
				let receivedDate = moment(dateofBirth.val(), "DD MM YYYY");
				if (receivedDate.isAfter()) {
					dateofBirth.parent().addClass('is-invalid')
					$('#dateCheck').removeClass('d-none').addClass('d-block').html('Selected value is a future time')
					if ($.inArray('dateofBirth', theError) === -1) {
						theError.push('dateofBirth')
					}
				} else if (moment().diff(receivedDate, 'years', false) <= 15) {
					dateofBirth.parent().addClass('is-invalid')
					$('#dateCheck').removeClass('d-none').addClass('d-block').html('Voter age limit is 18')
					if ($.inArray('dateofBirth', theError) === -1) {
						theError.push('dateofBirth')
					}
				} else {
					if (theError.length >= '1') {
						var indexDOB = theError.indexOf('dateofBirth');
						if ($.inArray('dateofBirth', theError) > -1) {
							theError.splice(indexDOB, 1);
						}
					}
				}

			});

			$('#register').submit(function(event) {
				$('#checkAll').addClass('d-none')
				if (theError.length >= 1) {
					console.log(theError);
					event.preventDefault()
					$('#checkAll').removeClass('d-none')
				}
			});

			// registration page ends here
  	 	} else if (document.location.pathname === '/pay/') {
			$('#unpaid').modal({
				show: true,
				keyboard: false,
				backdrop: 'static'
			})

			$('#pay_subs').change(function(event) {
				if ($('#pay_subs').val() === '3 Months') {
					$('#amountVal').val(40000)
					$('#amount').html(400.00)
				} else if ($('#pay_subs').val() === '6 Months') {
					$('#amountVal').val(70000)
					$('#amount').html(700.00)
				} else if ($('#pay_subs').val() === '1 Year') {
					$('#amountVal').val(130000)
					$('#amount').html('1,300.00')
				}
			});

			$('#payBtn').click(function(event) {
				$('#showTotal').removeClass('alert-danger')
				if (!$('#pay_subs').val()) {
					$('#showTotal').removeClass('alert-primary').addClass('alert-danger')
				} else {
					payWithPaystack()
				}
			});
  	 	}

});
