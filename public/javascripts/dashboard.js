$(document).ready(function() {

	$.cloudinary.config({ cloud_name: 'inidaname', secure: true});

    // var cl = cloudinary.Cloudinary.new({cloud_name: "inidaname"});
    // // replace 'demo' with your cloud name in the line above
    // cl.responsive();


	$('#ntExco').click(function(event) {
		event.preventDefault()
		if ($('#pronat').val()) {
			$(this).addClass('is-loading')
			document.getElementById('showCon').className = ""
			$.ajax({
				url: 'http://192.168.0.100:8888/api/memberphone/'+$('#pronat').val(),
				type: 'GET',
				dataType: 'JSON'
			})
			.done(function(json) {
				console.log("success");
				function getCookie(cname) {
					var name = cname + "=";
					var decodedCookie = decodeURIComponent(document.cookie);
					var ca = decodedCookie.split(';');
					for(var i = 0; i <ca.length; i++) {
						var c = ca[i];
						while (c.charAt(0) == ' ') {
							c = c.substring(1);
						}
						if (c.indexOf(name) == 0) {
							return c.substring(name.length, c.length);
						}
					}
					return "";
				}

				$('#ntExco').removeClass('is-loading')
				$('#naName').html(json.full_name)
				$('#naState').html(json.stName)
				$("#naLga").html(json.lgaName)
				$("#naWard").html(json.wardName)
				$("#SenSt").html(json.Senatorial)
				$("#fedCo").html(json.FedConstituency)
				$("#naPolling").html(json.pollingUnit)
				$('#theNaImg').attr('src', json.passport);
				$('#personalInfo').val(json._id)
				$('#adminInfo').val(getCookie('user_id'))
			})
			.fail(function(err) {
				$('#ntExco').removeClass('is-loading')
				$('#naName strong').html('Member Not Found')
			})
		}
	});
});
