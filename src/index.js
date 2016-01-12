'use strict'

var requestor = require('./requestor')();

// make sure everyone is requesting thought the same object
var User = require('./user.js')(requestor);
var Subreddit = require('./subreddit.js')(requestor);

module.exports = Reddit;

// this is done as a  closure because it's easier 
// to keep track of objects/scope when passing the function
// and such around to the request library and setTimeout

function Reddit() {
	if (!(this instanceof Reddit))
    	return new Reddit();
	var req = requestor;
	
	return {
		connect: function connect(userAgent, cid, secret, user, pw) {

			req.set({
				ua: userAgent,
				id: cid
			});

			var options = {
				method: 'POST',
			    uri: 'https://www.reddit.com/api/v1/access_token',
			    form: {
			    	'grant_type': 'password',
			        'username': user,
			        'password': pw,
			        'duration': 'permanent'
			    },
			    auth: {
					user: cid,
					password: secret,
					sendImmediately: false
				},
				headers: {
					'User-Agent': userAgent
				},
				transform: function(data) { 
					req.set({
						tk: data.access_token,
						rf: data.efresh_token,
						timer: data.expires_in, 
						connected: true
					});
					setTimeout(connect, data.expires_in * 900, userAgent, cid, secret, user, pw);
					return data;
				},
			    json: true
			};

			return req.request(options);
		},
		// constructor for a user
		getUser: function(name) {
			return new User(name);
		},

		getSubreddit: function(name){
			return new Subreddit(name);
		}
	}
}

