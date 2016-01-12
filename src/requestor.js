'use strict'

var rp = require('request-promise'),
	queue = require('queue'),
	Promise = require("bluebird");

module.exports = requestor;

function requestor() {

	var q = queue();
	var ua = '';
	var id = '';
	var tk = '';
	var rf = '';
	var connected = false;

	// ensures that no more than 60 requests will be made per minute
	// should be replaced by something that checks the headers then updates the timeout
	var timeout = 1002;
	return {
		set: function(options) {
			ua = options.ua || ua;
			id = options.id || id;
			tk = options.tk || tk;
			rf = options.rf || rf;
			connected = options.connected || connected;
			timeout = options.timeout || options;
		},
		get: function() {
			return {
				ua: ua,
				id: id,
				tk: tk,
				rf: rf,
				connected: connected,
				timeout: timeout
			};
		},
		request: function(options) {
			// we make a new promise and send it
			return new Promise(function (resolve, reject) {
				// at the start of it, we queue our request
				q.push(function(cb){
					// make sure to not go above the API limit 
					setTimeout(function(){
						// send the request
						rp(options)
							.then(function (data) {
						        resolve(data);
						    })
						    .catch(function (err) {
						        // todo: check the error, if it's related to connect, 
						        // set connected to false
						        reject(err); 
						    });
						// process the next request
						cb();
					}, timeout);
				});
				if(!q.running) {
					q.start();
				}
			});
		}
	}

}

