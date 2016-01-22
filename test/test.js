// make you own login file
var login = require('./settings.json');
var jawfr = require('../')();

jawfr.connect(login.ua, login.client, login.secret, login.user, login.pw)
	.then(function() {
		
		var fp = jawfr.getSubreddit("facepalm");

		fp.getLinks().then(function(links){
			console.log(links);
		})





		jawfr.getLinks("t3_413mxk")
			.then(function(links){
				
				console.log(links[0].preview.images[0].source.url);
				/*links[0].reply("hello fom jawfr")
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
					})*/
			})
			.catch(function(err){
				console.log("could not get links");
				console.log(err);
			})
			jawfr.getLinks("t3_41duhb")
			.then(function(links){
				
				console.log(links[0].preview.images[0].source.url);
				/*links[0].reply("hello fom jawfr")
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
					})*/
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