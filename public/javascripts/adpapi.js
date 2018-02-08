var jsonADPApi = (() => {
	var apiKey = {
		key: null,
		username: null
	};

	// setting api keys recieved from clients page
	apiKey.apiConfig = function (apiKey) {
		apiKey.key = apiKey
	}

	// receiving api keys for usage
	apiKey.authApi = function (apiKey.key) {
		$.ajax({
			url: 'api.actiondemocraticparty.org/auth/login',
			type: 'POST',
			dataType: 'JSON',
			data: {apiKey: apiKey.key}
		})
		.done(function(data) {
			apiKey.succes = data.token

		});
	}


	apiKey.endpoints = function (endpoint) {
		
	}

	return apiKey;
})();
