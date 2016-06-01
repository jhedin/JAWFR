'use strict'

var req = require('./requestor')();

// make sure everyone is requesting thought the same object
var u = require('./user.js');
var s = require('./subreddit.js');
var l = require('./link.js');
var c = require('./comment.js');

module.exports = function() {
	
	[u,s,l,c].map(function(i){return i.init(req, u.User, s.Subreddit, c.Comment, l.Link)});
	Jawfr.prototype.req = req;
 	Jawfr.prototype.User = u.User;
    Jawfr.prototype.Subreddit = s.Subreddit;
    Jawfr.prototype.Link = l.Link;
    Jawfr.prototype.Comment = c.Comment;
	
	return new Jawfr(); 
}
// this is done as a  closure because it's easier 
// to keep track of objects/scope when passing the function
// and such around to the request library and setTimeout

function Jawfr() {
	this._timeout = null;
	if (!(this instanceof Jawfr))
    	return new Jawfr();     
}

Jawfr.prototype.connect =  function (userAgent, cid, secret, user, pw) {
	this.req.set({
		ua: userAgent,
		id: cid
	});
	var that = this;

	var options = {
		method: 'POST',
	    uri: 'https://www.reddit.com/api/v1/access_token',
	    form: {
	    	'grant_type': 'password',
	        'username': user,
	        'password': pw,
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
			if(data.error) {throw data.error};
			this.req.set({
				tk: data.access_token,
				rf: data.refresh_token,
				timer: data.expires_in, 
				connected: true
			});
			that._timeout = setTimeout(this.connect.bind(this), data.expires_in * 900, userAgent, cid, secret, user, pw);
			return data;
		}.bind(this),
	    json: true
	};

	return this.req.request(options);
};

Jawfr.prototype.disconnect = function(){
	clearTimeout(this._timeout);
}

// constructor for a user
Jawfr.prototype.getUser = function(name) {
	return new this.User(name);
};

Jawfr.prototype.getSubreddit = function(name) {
	return new this.Subreddit(name);
};

Jawfr.prototype.asLink = function(info) {

	return new this.Link(info);
}

Jawfr.prototype.getLinks = function(names) {

	if(typeof names != 'string') {
		names = names.join(',');
	}

	var options = {
		method: 'GET',
	    uri: 'https://oauth.reddit.com/api/info',
	    qs: {
	    	id: names,
	    	raw_json: 1
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
		transform: function(data) {
			var Link = this.Link;
			var ret = data.data.children.map(function(t){return new Link(t.data)});
			ret.before = data.data.before;
			ret.after = data.data.after;

			return ret;	
		}.bind(this),
	    json: true
	};

	return this.req.request(options);
}

Jawfr.prototype.getComments = function(names) {

	if(typeof names === 'array') {
		names = names.join(' ');
	}

	var options = {
		method: 'GET',
	    uri: 'https://oauth.reddit.com/api/info',
	    qs: {
	    	id: names,
	    	raw_json: 1
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
		transform: function(data) {
			var Comment = this.Comment;
			var ret = data.data.children.map(function(t){return new Comment(t.data)});
			ret.before = data.data.before;
			ret.after = data.data.after;

			return ret;	
		}.bind(this),
	    json: true
	};

	return this.req.request(options);
}

