'use strict'

// Todo: make comment inherit from link

module.exports = {
	Link: Link,
	init: function(requestor, user, subreddit, comment, link) {
		Link.prototype.req = requestor;
		Link.prototype.User = user;
		Link.prototype.Subreddit = subreddit;
		Link.prototype.Comment = comment;
		return Link;
	}
}

function Link(info) {
	if (!(this instanceof Link))
    	return new Link();
    info = info || {};
    for(let i in info) {
    	this[i] = info[i];
    }
    this.subreddit = new this.Subreddit(this.subreddit);
	this.author = new this.User(this.author);
}


Link.prototype.reply = function(msg) {

	var options = {
		method: 'POST',
	    uri: 'https://oauth.reddit.com/api/comment',
	    qs: {
	    	raw_json: 1
	    },
	    form: {
	    	parent: this.name,
	    	text: msg
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
		transform: function(data) {
			return new this.Comment(data.jquery[18][3][0][0].data);	
		}.bind(this),
	    json: true
	};

	return this.req.request(options);
}

Link.prototype.remove = function(opts) {
	opts = opts || {spam:false};

	var options = {
		method: 'POST',
	    uri: 'https://oauth.reddit.com/api/remove',
	    qs: {
	    	raw_json: 1
	    },
	    form: {
	    	id: this.name,
	    	spam: opts.spam
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
	    json: true
	};

	return this.req.request(options);
}

Link.prototype.distinguish = function(opts) {
	opts = opts || {how: "yes"};

	var options = {
		method: 'POST',
	    uri: 'https://oauth.reddit.com/api/distinguish',
	    qs: {
	    	raw_json: 1
	    },
	    form: {
	    	id: this.name,
	    	how: opts.how
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
	    json: true
	};

	return this.req.request(options);
}

Link.prototype.report = function(reason) {

	var options = {
		method: 'POST',
	    uri: 'https://oauth.reddit.com/api/report',
	    qs: {
	    	raw_json: 1
	    },
	    form: {
	    	thing_id: this.name,
	    	other_reason: reason
	    },
		headers: {
			'Authorization': 'bearer ' + this.req.get().tk,
			'User-Agent': this.req.get().ua
		},
	    json: true
	};

	return this.req.request(options);
}