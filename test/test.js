// make you own login file
var login = require('./settings.json');
var jawfr = require('../')();

jawfr.connect(login.ua, login.client, login.secret, login.user, login.pw)
	.then(function() {
		
		jawfr.getLinks("t3_415m0w")
			.then(function(links){
				
				links[0].reply("hello fom jawfr")
					.then(function(comment) {
						
						console.log("replied");
						
						comment.distinguish()
							.then(function(){
								console.log("distinguished");
							})
							.catch(function(err){
								console.log("could not distinguish");
								//console.log(err);
							});

					})
					.catch(function(err) {
						console.log("could not reply");
						console.log(err);
					})
			})
			.catch(function(err){
				console.log("could not get links");
				console.log(err);
			})
		
	})
	.catch(function(err) {
		console.log("could not connect");
		console.log(err);
	})