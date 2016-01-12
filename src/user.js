'use strict'

var $ = require('cheerio');

module.exports = function(requestor) {
	User.prototype.req = requestor;
	return User;
}

function User(name) {
	if (!(this instanceof User))
    	return new User();
	this.name = name;
}

User.prototype.getComments = function(opts) {
	opts = opts || {};
	opts.sort = opts.sort || "new";

	var options = {
		method: 'GET',
	    uri: 'https://oauth.reddit.com/user/' + this.name + '/comments',
	    qs: opts,
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
		transform: function(data) {
			var ret = data.data.children.map(function(t){return t.data});
			ret.before = data.data.before;
			ret.after = data.data.after;

			return ret;	
		},
	    json: true
	};

	return this.req.request(options);
}

User.prototype.getLinks = function(opts) {
	opts = opts || {};
	opts.sort = opts.sort || "new";

	var options = {
		method: 'GET',
	    uri: 'https://oauth.reddit.com/user/' + this.name + '/submitted',
	    qs: opts,
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
		transform: function(data) {
			var ret = data.data.children.map(function(t){return t.data});
			ret.before = data.data.before;
			ret.after = data.data.after;

			return ret;	
		},
	    json: true
	};

	return this.req.request(options);
}

User.prototype.moderates = function() {

	var options = {
		method: 'GET',
	    uri: 'https://www.reddit.com/user/' + this.name,
		headers: {
			'User-Agent': this.req.get().ua
		},
		transform: function (body, response, resolveWithFullResponse) { 
			return $('li a','#side-mod-list', body).map(function() {return $(this).text().slice(3)}).toArray();
		}
	};

	return this.req.request(options);

}